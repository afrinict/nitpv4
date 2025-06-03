import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        isAdmin: boolean;
      };
    }
  }
}

declare module '../db' {
  export const db: any;
}

declare module '../middleware/auth' {
  export function authenticateToken(req: Request, res: Response, next: NextFunction): void;
}

declare module '../middleware/upload' {
  export const upload: any;
} 