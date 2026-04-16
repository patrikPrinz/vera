import winston from 'winston';
import type { LoggerPort } from './logger_port.js';

export class WinstonLogger implements LoggerPort {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  debug(message: string, meta?: unknown) {
    this.logger.debug(message, meta);
  }

  info(message: string, meta?: unknown) {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: unknown) {
    this.logger.error(message, meta);
  }
}
