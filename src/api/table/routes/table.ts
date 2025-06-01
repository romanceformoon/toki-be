import express, { Router } from 'express';
import { getTableFile, updateTableFile } from '~/api/table/controllers/table';
import { authChecker } from '~/middlewares/authChecker';

const router: Router = express.Router();

router.get('/:tableName/:fileName', getTableFile);
router.put('/:tableName/:fileName', authChecker, updateTableFile);

module.exports = router;
