import { createLogger, format, transports } from 'winston';

import { logLevel } from 'src/config';

export const logger = createLogger({
    level: logLevel,
    format: format.combine(format.timestamp(), format.splat(), format.simple()),
    transports: [new transports.Console()]
});
