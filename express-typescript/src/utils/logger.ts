import { createLogger, format, transports as winstonTransports } from 'winston';

import { config } from 'src/config';

export enum Transport {
  Console = 'console'
}

const getTransports = (transports: Transport[]) => {
  return transports.map((transport) => {
    switch (transport) {
      case Transport.Console:
        return new winstonTransports.Console();
    }
  });
};

const transports = getTransports(config.logTransports as Transport[]);

export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports,
  exceptionHandlers: transports, // log uncaughtException
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rejectionHandlers: transports // log unhandledRejection
});
