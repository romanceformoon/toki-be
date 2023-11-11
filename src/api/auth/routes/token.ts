import express, { Router } from 'express';
import { refresh } from '~/api/auth/controllers/refresh';

const router: Router = express.Router();

router.get('/refresh', refresh);

module.exports = router;
