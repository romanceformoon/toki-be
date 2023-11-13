import express, { Router } from 'express';
import { analyze } from '~/api/analyze/controllers/analyze';
import { getUser } from '~/api/analyze/controllers/getUser';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';
import { getEXPRanking } from '../controllers/ranking';

const router: Router = express.Router();

router.post('/', authChecker, databaseConnector, analyze);

router.get('/user/:uid', databaseConnector, getUser);

router.get('/ranking', databaseConnector, getEXPRanking);


module.exports = router;
