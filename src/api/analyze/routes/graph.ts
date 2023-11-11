import express, { Router } from 'express';
import { generateGraph } from '~/api/analyze/controllers/generateGraph';
import { getGraph } from '~/api/analyze/controllers/getGraph';
import { authChecker } from '~/middlewares/authChecker';

const router: Router = express.Router();

router.post('/graph', authChecker, generateGraph);
router.get('/graph', authChecker, getGraph);

module.exports = router;
