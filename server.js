import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';

import searchRoute from './router/search.js'; 

const server = express();
const corsOption = {
    origin: '*',
    optionsSuccessStatus: 200,
};
server.use(express.json());
server.use(helmet());
server.use(cors(corsOption));
server.use(morgan('tiny'));

server.use('/search', searchRoute);
// server.use('/chart', chartRoute);
// server.use('/bookmark', bookmarkRoute);

server.listen(8080);

server.use((req, res, next) => {
    res.sendStatus(404);
})

server.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
})