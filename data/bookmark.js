import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

export const Bookmark = sequelize.define('bookmark', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    num: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    singer: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    }
}, {timestamps: false});

Bookmark.belongsTo(User);

export async function fetchSong(id) {
    const fetched = await Bookmark.findAll({where: {userId: id}});
    return fetched;
}

export async function addSong(data, id) {
    const fetched = await fetchSong(id);
    const isExist = fetched.findIndex(song => song.num === data.num);
    if (isExist !== -1) return;
    return Bookmark.create({...data, userId: id}).then(data => data.dataValues);
}

export async function deleteSong(data, id) {
    return Bookmark.destroy({
        where: {userId: id},
    });
}