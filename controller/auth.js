import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import * as authRepository from '../data/auth.js';
import { config } from '../config.js';

const jwtSecretKey = config.jwtSecretKey;
const jwtExpriedDays = config.jwtExpriedDays;
const bcryptSaltRounds = config.bcryptSaltRounds;

export async function login(req, res) {
    const {username, password} = req.body;
    const user = await authRepository.findByUsername(username);
    if (!user) return res.status(401).json({message: '유효하지 않은 유저네임이나 패스워드입니다.'});
    const isVaildPassword = await bcrypt.compare(password, user.password);
    if (!isVaildPassword) return res.status(401).json({message: '유효하지 않은 유저네임이나 패스워드입니다.'});

    const token = createJwtToken(user.id);
    res.status(200).json({token, username});
}

export async function signin(req, res) {
    const {username, password, name, email} = req.body;
    const found = await authRepository.findByUsername(username);
    if (found) return res.status(409).json({ message: `'${username}' 동일한 유저네임이 존재합니다`});
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userId = await authRepository.createUser({
        username,
        password: hashed,
        name,
        email
    });
    const token = createJwtToken(userId);
    res.status(201).json({token, username});
}

export async function me(req, res, next) {
    const user = await authRepository.findById(req.userId);
    if (!user) {
        return res.status(404).json({message: 'User Not Found'});
    }
    res.status(200).json({token: req.token, username: user.username});
}

function createJwtToken(id) {
    return jwt.sign({id}, jwtSecretKey, {expiresIn: jwtExpriedDays});
}