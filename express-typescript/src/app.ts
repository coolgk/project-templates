import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import config from './config';
// import { handle404Error, handleAllError } from './errorHandler';
import route from './routes/route';

const app = express();

app.use(helmet());
app.use(cors(config.cors));

route(app);

// app.use(handle404Error);
// app.use(handleAllError);

export default app;
