import winston from 'winston';
import LokiTransport from 'winston-loki';


class LoggerService {
    private logger: winston.Logger;

    constructor() {
        const loki_host = process.env.LOKI || 'http://localhost:36071' 
        const level = process.env.LEVEL_LOG || 'info'
        this.logger = winston.createLogger({
            level: level,
            format:winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.json()
              ),
              transports: [
                new winston.transports.Console({
                  format:winston.format.combine(
                      winston.format.errors({ stack: true }),
                      winston.format.json()
                  )
                })
              ],
        });

    }

    logInfo(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    logError(message: string, meta?: any) {
        this.logger.error(message, meta);
    }

    logDebug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }
}

export const logger = new LoggerService();
