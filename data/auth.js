import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128)
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, 
{timestamps: false});

export async function findByUsername(username) {
    return User.findOne({where: {username}});  
}

export async function findById(id) {
    return User.findByPk(id);
}

export async function createUser(user) {
    return User.create(user).then(data => data.dataValues.id);
}