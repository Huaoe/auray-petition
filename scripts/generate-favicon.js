const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/icons/logo.png');
const publicPath = path.join(__dirname, '../public');

// Favicon sizes to generate
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 256, name: 'favicon-256x256.png' }
];

async function generateFavicons() {
  try {
    console.log('🎨 Génération des favicons à partir de logo.png...');
    
    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo non trouvé: ${logoPath}`);
    }

    // Generate different sizes
    for (const { size, name } of faviconSizes) {
      const outputPath = path.join(publicPath, name);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Généré: ${name} (${size}x${size})`);
    }

    // Generate the main favicon.ico (32x32 is standard)
    const faviconPath = path.join(publicPath, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ Généré: favicon.ico (32x32)');

    // Generate apple-touch-icon
    const appleTouchPath = path.join(publicPath, 'apple-touch-icon.png');
    await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(appleTouchPath);
    
    console.log('✅ Généré: apple-touch-icon.png (180x180)');

    console.log('\n🎉 Tous les favicons ont été générés avec succès!');
    console.log('\n📝 Ajoutez ces lignes dans votre <head> (layout.tsx):');
    console.log(`
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" href="/favicon.ico" />
    `);

  } catch (error) {
    console.error('❌ Erreur lors de la génération des favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
