import crypto from 'crypto';

interface User {
  sub: string;
  iss: string;
  aud: string;
}

export function generateHash(pin: string, user: User): string {
  // Create a hash using HMAC-SHA256
  const hmac = crypto.createHmac('sha256', pin);
  
  // Add the claims to the hash
  hmac.update(user.sub);
  hmac.update(user.iss);
  hmac.update(user.aud);
  
  // Return the hash in hex format
  return hmac.digest('hex');
}
