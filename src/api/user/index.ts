import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/user', require('~/api/user/routes/user'));

module.exports = router;
