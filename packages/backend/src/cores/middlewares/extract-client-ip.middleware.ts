import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// Extend the Request interface to include clientIp property
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

@Injectable()
export class ExtractClientIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.clientIp = req.ip;
    next();
  }
}
