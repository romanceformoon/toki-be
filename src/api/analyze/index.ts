import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/data', require('~/api/analyze/routes/analyze'));

module.exports = router;
