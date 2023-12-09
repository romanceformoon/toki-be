import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/ranking', require('~/api/ranking/routes/ranking'));

module.exports = router;
