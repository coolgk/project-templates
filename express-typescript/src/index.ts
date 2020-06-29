import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
// import nocache from 'nocache';
// import bodyParser from 'body-parser';

import config from './config';
import { handle404Error, handleAllError } from './errorHandler';
import route from './routes/routes';

const app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy(config.csp));
// app.use(nocache());
app.use(cors(config.cors));
// app.use(bodyParser.json());

route(app);

app.use(handle404Error);
app.use(handleAllError);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

export default app;
