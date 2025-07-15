const ipRequestMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

export const checkRateLimit = (ip: string): { limited: boolean; message?: string } => {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (record) {
    const timeSinceLastRequest = now - record.lastRequest;

    if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return {
          limited: true,
          message: 'Trop de tentatives. Veuillez réessayer dans une minute.',
        };
      }
      // Increment count if within the window
      ipRequestMap.set(ip, { count: record.count + 1, lastRequest: now });
    } else {
      // Reset count if window has passed
      ipRequestMap.set(ip, { count: 1, lastRequest: now });
    }
  } else {
    // First request from this IP
    ipRequestMap.set(ip, { count: 1, lastRequest: now });
  }

  return { limited: false };
};
