import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/table', require('~/api/table/routes/table'));

module.exports = router;
