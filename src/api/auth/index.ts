import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/auth/discord', require('~/api/auth/routes/discord'));
router.use('/auth/token', require('~/api/auth/routes/token'));

module.exports = router;
