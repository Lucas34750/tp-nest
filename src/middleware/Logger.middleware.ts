import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

    fs.appendFileSync(path.join(process.cwd(), 'requests.log'), logLine);

    next();
  }
}
