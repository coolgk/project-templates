import { config } from './config';
import { app } from 'src/app';
import { logger } from 'src/utils/logger';

app().listen(config.port, () => logger.info(`Listening on port ${config.port}`));
