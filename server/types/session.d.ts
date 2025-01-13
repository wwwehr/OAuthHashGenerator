import 'express-session';
import { User } from '../auth';

declare module 'express-session' {
  interface SessionData {
    user: {
      sub: string;
      iss: string;
      aud: string;
    };
  }
}
