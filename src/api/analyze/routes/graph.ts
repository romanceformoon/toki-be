import express, { Router } from 'express';
import { generateGraph } from '~/api/analyze/controllers/generateGraph';

const router: Router = express.Router();

// 개별 비디오 업로드
router.post('/', generateGraph);

module.exports = router;
