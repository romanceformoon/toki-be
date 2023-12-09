import express, { Router } from 'express';
import { getGraph } from '~/api/user/controllers/getGraph';
import { getHistory } from '~/api/user/controllers/getHistory';
import { getUser } from '~/api/user/controllers/getUser';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.get('/:category/:uid', databaseConnector, getUser);

router.get('/graph/:category/:uid', getGraph);
router.get('/history/:category/:uid', getHistory);

module.exports = router;
