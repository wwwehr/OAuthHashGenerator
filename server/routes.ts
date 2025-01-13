import type { Express } from "express";
import { createServer, type Server } from "http";
import { sessionMiddleware, getAuthUrl, handleCallback } from "./auth";
import { generateHash } from "./crypto";

export function registerRoutes(app: Express): Server {
  // Session middleware
  app.use(sessionMiddleware);

  // Auth routes
  app.get('/api/auth/google', (_req, res) => {
    res.redirect(getAuthUrl());
  });

  app.get('/api/auth/callback', async (req, res) => {
    try {
      const code = req.query.code as string;
      const userData = await handleCallback(code);
      req.session.user = userData;
      res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get('/api/auth/user', (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    res.json(req.session.user);
  });

  // Hash generation
  app.post('/api/hash', (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { pin } = req.body;
    if (!pin || typeof pin !== 'string') {
      res.status(400).json({ error: 'Invalid PIN' });
      return;
    }

    const hash = generateHash(pin, req.session.user);
    res.json({ hash });
  });

  return createServer(app);
}
