import express, { Router } from 'express';
import { analyze } from '~/api/analyze/controllers/analyze';
import { getEXPRanking } from '~/api/analyze/controllers/getExpRanking';
import { getGraph } from '~/api/analyze/controllers/getGraph';
import { getHistory } from '~/api/analyze/controllers/getHistory';
import { getRatingRanking } from '~/api/analyze/controllers/getRatingRanking';
import { getUser } from '~/api/analyze/controllers/getUser';
import { reanalyze } from '~/api/analyze/controllers/reanalyze';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.post('/', authChecker, databaseConnector, analyze);
router.post('/reanalyze', databaseConnector, reanalyze);

router.get('/user/score/:uid', databaseConnector, getUser);
router.get('/user/graph/:uid', databaseConnector, getGraph);
router.get('/user/history/:uid', databaseConnector, getHistory);

router.get('/ranking', databaseConnector, getEXPRanking);
router.get('/rating-ranking', databaseConnector, getRatingRanking);

module.exports = router;
