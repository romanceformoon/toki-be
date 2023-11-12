import express, { Router } from 'express';
import { generateGraph } from '~/api/analyze/controllers/generateGraph';
import { getUser } from '~/api/analyze/controllers/getUser';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.post('/graph', authChecker, databaseConnector, generateGraph);

router.get('/user/:uid', databaseConnector, getUser);

module.exports = router;
