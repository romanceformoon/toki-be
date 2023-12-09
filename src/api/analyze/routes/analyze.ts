import express, { Router } from 'express';
import { analyze } from '~/api/analyze/controllers/analyze';
import { reanalyze } from '~/api/analyze/controllers/reanalyze';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.post('/analyze', authChecker, databaseConnector, analyze);
router.post('/reanalyze', databaseConnector, reanalyze);

module.exports = router;
