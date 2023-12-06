import express, { Router } from 'express';
import { analyze } from '~/api/analyze/controllers/analyze';
import { getUser } from '~/api/analyze/controllers/getUser';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';
import { getGraph } from '../controllers/getGraph';
import { getHistory } from '../controllers/getHistory';
import { getEXPRanking } from '../controllers/ranking';
import { reanalyze } from '../controllers/reanalyze';

const router: Router = express.Router();

router.post('/', authChecker, databaseConnector, analyze);
router.post('/reanalyze', databaseConnector, reanalyze);

router.get('/user/score/:uid', databaseConnector, getUser);
router.get('/user/graph/:uid', databaseConnector, getGraph);
router.get('/user/history/:uid', databaseConnector, getHistory);

router.get('/ranking', databaseConnector, getEXPRanking);

module.exports = router;
