import { OAuth2Client } from 'google-auth-library';
import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import dotenv from 'dotenv';

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const MemoryStoreSession = MemoryStore(session);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Missing Google OAuth credentials. Using placeholder values for development.');
}

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id',
  process.env.GOOGLE_CLIENT_SECRET || 'placeholder-client-secret',
  `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${process.env.REPLIT_DOMAIN || 'localhost:5000'}/api/auth/callback`
);

export const sessionMiddleware = session({
  store: new MemoryStoreSession({
    checkPeriod: 86400000
  }),
  secret: process.env.SESSION_SECRET || 'default-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'profile', 'email']
  });
}

export async function handleCallback(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload()!;
  return {
    sub: payload.sub,
    iss: payload.iss,
    aud: payload.aud
  };
}