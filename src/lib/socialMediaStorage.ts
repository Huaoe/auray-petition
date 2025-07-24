import { google } from 'googleapis';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Configuration for social media credentials sheet
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SHEET_SOCIAL_ID;
const SOCIAL_SHEET_NAME = process.env.SOCIAL_SHEET_NAME || 'SocialMediaCredentials';

// Enhanced diagnostic logging
if (process.env.NODE_ENV === 'development') {
  console.log('[socialMediaStorage] Configuration Debug:');
  console.log('  SPREADSHEET_ID:', SPREADSHEET_ID);
  console.log('  SPREADSHEET_ID type:', typeof SPREADSHEET_ID);
  console.log('  SPREADSHEET_ID length:', SPREADSHEET_ID?.length);
  console.log('  Is valid Google Sheets ID format:', /^[a-zA-Z0-9-_]{44}$/.test(SPREADSHEET_ID || ''));
  console.log('  SOCIAL_SHEET_NAME:', SOCIAL_SHEET_NAME);
}

// Encryption key derived from JWT_SECRET
const getEncryptionKey = (): Buffer => {
  const secret = process.env.JWT_SECRET || 'default-fallback-key-for-dev-environment-only';
  // Create exactly 32 bytes for AES-256
  return createHash('sha256').update(secret).digest();
};

// Encrypt function with proper error handling
const encrypt = (text: string): string => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = getEncryptionKey(); // Now returns Buffer directly
    const iv = randomBytes(16);
    
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt function with proper error handling
const decrypt = (encryptedData: string): string => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = getEncryptionKey(); // Now returns Buffer directly
    
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Interface for social media credentials
export interface SocialMediaCredential {
  userId: string; // Email or unique identifier
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  username?: string;
  userId_platform?: string; // Platform-specific user ID
  connectedAt: string;
  lastUsed?: string;
}

// Interface for stored credential (encrypted)
interface StoredCredential {
  userId: string;
  platform: string;
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  tokenExpiry?: string;
  username?: string;
  userId_platform?: string;
  connectedAt: string;
  lastUsed?: string;
}

// Get Google Sheets client
const getSocialMediaSheetsClient = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient as any });
};

// Initialize the social media credentials sheet
export const initializeSocialMediaSheet = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!SPREADSHEET_ID) {
      const errorMsg = 'GOOGLE_SHEETS_SHEET_SOCIAL_ID not configured';
      console.error('[socialMediaStorage] Configuration Error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!SOCIAL_SHEET_NAME) {
      const errorMsg = 'SOCIAL_SHEET_NAME not configured';
      console.error('[socialMediaStorage] Configuration Error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[socialMediaStorage] Attempting to initialize sheet...');
      console.log('  Using SPREADSHEET_ID:', SPREADSHEET_ID);
      console.log('  Using SOCIAL_SHEET_NAME:', SOCIAL_SHEET_NAME);
    }

    const sheets = await getSocialMediaSheetsClient();
    
    // Check if spreadsheet exists
    let spreadsheet;
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[socialMediaStorage] Checking if spreadsheet exists...');
      }
      spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('[socialMediaStorage] ✅ Spreadsheet found:', spreadsheet.data.properties?.title);
      }
    } catch (error: any) {
      console.error('[socialMediaStorage] ❌ Spreadsheet access failed:');
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      console.error('  SPREADSHEET_ID used:', SPREADSHEET_ID);
      console.error('  Full error:', error);
      throw new Error(`Spreadsheet not found: ${SPREADSHEET_ID} (${error.message})`);
    }

    // Check if our sheet exists
    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === SOCIAL_SHEET_NAME
    );

    if (!sheetExists) {
      console.log(`Creating sheet: ${SOCIAL_SHEET_NAME}`);
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SOCIAL_SHEET_NAME,
              },
            },
          }],
        },
      });
    }

    // Create/update headers
    const headers = [
      ['User ID', 'Platform', 'Encrypted Access Token', 'Encrypted Refresh Token', 'Token Expiry', 'Username', 'Platform User ID', 'Connected At', 'Last Used']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A1:I1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: headers,
      },
    });

    console.log(`✅ Social media sheet initialized: ${SOCIAL_SHEET_NAME}`);
    return { success: true };
  } catch (error) {
    console.error('Error initializing social media sheet:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Store social media credentials
export const storeSocialMediaCredential = async (credential: SocialMediaCredential): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_SHEET_SOCIAL_ID not configured');
    }

    const sheets = await getSocialMediaSheetsClient();
    
    // Encrypt sensitive data
    const encryptedAccessToken = encrypt(credential.accessToken);
    const encryptedRefreshToken = credential.refreshToken ? encrypt(credential.refreshToken) : '';

    // Check if credential already exists for this user and platform
    const existingCredential = await getSocialMediaCredential(credential.userId, credential.platform);
    
    if (existingCredential) {
      // Update existing credential
      return await updateSocialMediaCredential(credential);
    }

    // Prepare data for storage
    const values = [
      [
        credential.userId,
        credential.platform,
        encryptedAccessToken,
        encryptedRefreshToken,
        credential.tokenExpiry || '',
        credential.username || '',
        credential.userId_platform || '',
        credential.connectedAt,
        credential.lastUsed || ''
      ]
    ];

    // Add to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A:I`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error storing social media credential:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Get social media credential
export const getSocialMediaCredential = async (userId: string, platform: string): Promise<SocialMediaCredential | null> => {
  try {
    if (!SPREADSHEET_ID) {
      return null;
    }

    const sheets = await getSocialMediaSheetsClient();
    
    // Get all credentials
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    const credentials = rows.slice(1); // Skip header
    
    // Find matching credential
    const credentialRow = credentials.find(row => 
      row[0] === userId && row[1] === platform
    );

    if (!credentialRow) {
      return null;
    }

    // Decrypt and return credential
    return {
      userId: credentialRow[0],
      platform: credentialRow[1] as 'twitter' | 'facebook' | 'instagram' | 'linkedin',
      accessToken: decrypt(credentialRow[2]),
      refreshToken: credentialRow[3] ? decrypt(credentialRow[3]) : undefined,
      tokenExpiry: credentialRow[4] || undefined,
      username: credentialRow[5] || undefined,
      userId_platform: credentialRow[6] || undefined,
      connectedAt: credentialRow[7],
      lastUsed: credentialRow[8] || undefined,
    };
  } catch (error) {
    console.error('Error getting social media credential:', error);
    return null;
  }
};

// Update social media credential
export const updateSocialMediaCredential = async (credential: SocialMediaCredential): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_SHEET_SOCIAL_ID not configured');
    }

    const sheets = await getSocialMediaSheetsClient();
    
    // Get all credentials to find the row to update
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    const credentials = rows.slice(1); // Skip header
    
    // Find matching credential row index
    const rowIndex = credentials.findIndex(row => 
      row[0] === credential.userId && row[1] === credential.platform
    );

    if (rowIndex === -1) {
      // Credential doesn't exist, create new one
      return await storeSocialMediaCredential(credential);
    }

    // Encrypt sensitive data
    const encryptedAccessToken = encrypt(credential.accessToken);
    const encryptedRefreshToken = credential.refreshToken ? encrypt(credential.refreshToken) : '';

    // Update the row (rowIndex + 2 because of 0-based index + header row)
    const actualRowNumber = rowIndex + 2;
    const values = [
      [
        credential.userId,
        credential.platform,
        encryptedAccessToken,
        encryptedRefreshToken,
        credential.tokenExpiry || '',
        credential.username || '',
        credential.userId_platform || '',
        credential.connectedAt,
        new Date().toISOString() // Update lastUsed
      ]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A${actualRowNumber}:I${actualRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating social media credential:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Cache to avoid repeated initialization checks
let isSheetInitialized = false;

// Get all social media credentials for a user
export const getUserSocialMediaCredentials = async (userId: string): Promise<SocialMediaCredential[]> => {
  try {
    if (!SPREADSHEET_ID || !SOCIAL_SHEET_NAME) {
      console.error("Error: GOOGLE_SHEETS_SHEET_SOCIAL_ID or SOCIAL_SHEET_NAME is not configured.");
      return [];
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[socialMediaStorage] Fetching credentials for userId:', userId);
    }
    
    const sheets = await getSocialMediaSheetsClient();
    
    // Get all credentials with error handling
    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SOCIAL_SHEET_NAME}!A:I`,
      });
    } catch (error: any) {
      if (error.code === 400 && error.message?.includes('Unable to parse range')) {
        console.log('Sheet range not found, initializing once...');
        if (!isSheetInitialized) {
          await initializeSocialMediaSheet();
          isSheetInitialized = true;
        }
        // Retry after initialization
        response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SOCIAL_SHEET_NAME}!A:I`,
        });
      } else {
        throw error;
      }
    }

    const rows = response.data.values || [];
    if (rows.length <= 1) {
      // Only header or empty sheet
      return [];
    }
    
    const credentials = rows.slice(1); // Skip header
    
    // Filter and decrypt credentials for the user
    const userCredentials = credentials
      .filter(row => row[0] === userId && row.length >= 8)
      .map(row => {
        try {
          return {
            userId: row[0],
            platform: row[1] as 'twitter' | 'facebook' | 'instagram' | 'linkedin',
            accessToken: decrypt(row[2]),
            refreshToken: row[3] ? decrypt(row[3]) : undefined,
            tokenExpiry: row[4] || undefined,
            username: row[5] || undefined,
            userId_platform: row[6] || undefined,
            connectedAt: row[7],
            lastUsed: row[8] || undefined,
          };
        } catch (decryptError) {
          console.error('Failed to decrypt credential for platform:', row[1], decryptError);
          return null;
        }
      })
      .filter(Boolean) as SocialMediaCredential[];

    return userCredentials;
  } catch (error) {
    console.error('Error getting user social media credentials:', error);
    return [];
  }
};

// Delete social media credential
export const deleteSocialMediaCredential = async (userId: string, platform: string): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_SHEET_SOCIAL_ID not configured');
    }

    const sheets = await getSocialMediaSheetsClient();
    
    // Get all credentials to find the row to delete
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SOCIAL_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    const credentials = rows.slice(1); // Skip header
    
    // Find matching credential row index
    const rowIndex = credentials.findIndex(row => 
      row[0] === userId && row[1] === platform
    );

    if (rowIndex === -1) {
      return { success: false, message: 'Credential not found' };
    }

    // Delete the row (rowIndex + 2 because of 0-based index + header row)
    const actualRowNumber = rowIndex + 2;
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0, // Assuming first sheet
              dimension: 'ROWS',
              startIndex: actualRowNumber - 1,
              endIndex: actualRowNumber,
            },
          },
        }],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting social media credential:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
