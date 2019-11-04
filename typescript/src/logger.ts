import { createLogger, format, transports } from 'winston';

import { logLevel } from 'src/config'

export enum LogLevel {
    Error = 'error',
    Debug = 'debug',
    Info = 'info'
}

export const logger = createLogger({
    level: logLevel || LogLevel.Error,
    format: format.combine(format.timestamp(), format.splat(), format.simple()),
    transports: [new transports.Console()]
});
