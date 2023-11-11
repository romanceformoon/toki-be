import express, { Router } from 'express';
import { generateGraph } from '~/api/analyze/controllers/generateGraph';

const router: Router = express.Router();

router.post('/graph', generateGraph);

module.exports = router;
