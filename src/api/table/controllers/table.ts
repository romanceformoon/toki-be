import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from '~/config/winston';

export const getTableFile = (req: Request, res: Response) => {
  try {
    const { tableName, fileName } = req.params;

    // 보안을 위해 경로 유효성 검사
    if (!['aery', 'insane'].includes(tableName)) {
      return res.status(404).json({
        success: false,
        message: '유효하지 않은 테이블 이름입니다.',
      });
    }

    // 경로 조작 방지를 위해 기본 파일명만 추출
    const sanitizedFileName = path.basename(fileName);

    // 파일 경로 구성
    const filePath = path.join(
      process.cwd(),
      'table',
      tableName,
      sanitizedFileName
    );

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '파일을 찾을 수 없습니다.',
      });
    }

    // 파일 전송
    res.sendFile(filePath);
  } catch (error) {
    logger.error(`테이블 파일 요청 오류: ${error}`);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
    });
  }
};
