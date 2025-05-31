import express, { Router } from 'express';
import { getTableFile } from '~/api/table/controllers/table';

const router: Router = express.Router();

router.get('/:tableName/:fileName', getTableFile);

module.exports = router;
