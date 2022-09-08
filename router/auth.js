import express from 'express';
import {body} from 'express-validator'
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';

const router = express.Router();

const validateCredential = [
    body('username')
    .trim()
    .notEmpty()
    .isLength({min: 5})
    .withMessage('유저네임은 적어도 5자 이상으로 작성해주세요.'),
    body('password')
    .trim()
    .isLength({min: 5})
    .withMessage('패스워드는 적어도 5자 이상으로 작성해주세요.'),
    validate,
];

const validateSignin = [
    ...validateCredential,
    body('name').notEmpty().withMessage('이름이 빈칸입니다!'),
    body('email').isEmail().normalizeEmail().withMessage('유효하지 않은 이메일 입니다.'),
    validate,
]

router.post('/login', validateCredential ,authController.login);
router.post('/signin', validateSignin, authController.signin);
router.get('/me', isAuth, authController.me)

export default router;