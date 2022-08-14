import express from 'express';
import 'express-async-errors';
import * as searchController from '../controller/search.js';

const router = express.Router();

router.post('/', searchController.search);


export default router;