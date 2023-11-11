import express, { Router } from 'express';
import { refresh } from '~/api/auth/controllers/refresh';
import { checkUser } from '../controllers/checkUser';

const router: Router = express.Router();

router.get('/refresh', refresh);
router.get('/check-user', checkUser);


module.exports = router;
