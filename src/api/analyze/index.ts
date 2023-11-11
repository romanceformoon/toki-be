import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/graph', require('~/api/analyze/routes/graph'));

module.exports = router;
