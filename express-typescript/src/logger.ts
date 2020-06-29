import { createLogger, format, transports } from 'winston';

import config from 'src/config';

export default {
  log: createLogger({
    level: config.logLevel,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
    transports: [
      new transports.Console()
    ]
  })
};
