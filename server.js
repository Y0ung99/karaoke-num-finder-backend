import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';

import searchRoute from './router/search.js'; 
import authRoute from './router/auth.js';
import chartRoute from './router/chart.js';
import bookmarkRoute from './router/bookmark.js';
import { sequelize } from './db/database.js';
import { config } from './config.js';
import { RefreshChartDB } from './controller/chart.js';

const server = express();
const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
};
server.use(express.json());
server.use(helmet());
server.use(cors(corsOption));
server.use(morgan('tiny'));

server.use('/search', searchRoute);
server.use('/auth', authRoute);
server.use('/chart', chartRoute);
server.use('/bookmark', bookmarkRoute);

sequelize.sync().then(() => {
    interval(14400000, RefreshChartDB);
    const ser = server.listen(config.port);
    console.log(`Server is started ${new Date()}`);
});

server.use((req, res, next) => {
    res.sendStatus(404);
});

server.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

async function interval(sec, func) {
    await func();
    return setInterval(func, sec);
}