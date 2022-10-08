import { Router } from 'express';
import {body} from 'express-validator'
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import * as bookmarkController from '../controller/bookmark.js';

const router = Router();

router.get('/', isAuth, bookmarkController.fetchSong);
router.post('/', isAuth, bookmarkController.addSong);
router.delete('/', isAuth, bookmarkController.deleteSong);

export default router;