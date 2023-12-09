import express, { Router } from 'express';
import { getEXPRanking } from '~/api/ranking/controllers/getExpRanking';
import { getRatingRanking } from '~/api/ranking/controllers/getRatingRanking';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.get('/exp/:category', databaseConnector, getEXPRanking);
router.get('/rating/:category', databaseConnector, getRatingRanking);

module.exports = router;
