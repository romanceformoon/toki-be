import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
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

export const updateTableFile = (req: Request, res: Response) => {
  try {
    const { tableName, fileName } = req.params;

    if (!req.decoded['admin']) {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.',
      });
    }

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

    // 업로드된 파일 확인
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: '업로드된 파일이 없습니다.',
      });
    }

    // 업로드된 JSON 파일 가져오기
    const jsonFile = req.files.jsonFile as UploadedFile;

    if (!jsonFile) {
      return res.status(400).json({
        success: false,
        message: 'JSON 파일이 제공되지 않았습니다.',
      });
    }

    // JSON 파일 유효성 검사 (선택적)
    try {
      JSON.parse(jsonFile.data.toString('utf8'));
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 JSON 파일입니다.',
      });
    }

    // 파일 이동
    jsonFile.mv(filePath, (err) => {
      if (err) {
        logger.error(`테이블 파일 업데이트 오류: ${err}`);
        return res.status(500).json({
          success: false,
          message: '파일 저장 중 오류가 발생했습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '파일이 성공적으로 업데이트되었습니다.',
      });
    });
  } catch (error) {
    logger.error(`테이블 파일 업데이트 오류: ${error}`);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
    });
  }
};
