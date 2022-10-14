import { config } from '../config.js';
import { Sequelize } from 'sequelize';

const {host, user, port, database, password} = config.db;
export const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //     },
    // },
});