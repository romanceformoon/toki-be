import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/auth/discord', require('~/api/auth/routes/discord'));
router.use('/auth/user', require('~/api/auth/routes/user'));

module.exports = router;
