import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/analyze', require('~/api/analyze/routes/graph'));

module.exports = router;
