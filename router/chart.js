import express from 'express';
import {body} from 'express-validator'
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import * as chartController from '../controller/chart.js';

const router = express.Router();

router.post('/popular/:country', chartController.popular);
router.post('/new', chartController.newsong);

export default router;