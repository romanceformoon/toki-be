import { createSchema } from '~/config/createSchema';
import { logger } from '~/config/winston';

// Express Server Initialize
const app = require('./app');
const port = process.env.SERVER_PORT || 9876;
const server = app.listen(port, () => {
  logger.info(`Express Server Listening on port ${port}`);
  if (process.send) {
    // PM2에게 앱 구동이 완료되었음을 전달한다
    process.send('ready');
  }
});

createSchema();
// gradeData();

process.on('SIGINT', function () {
  // pm2 재시작 신호가 들어오면 서버를 종료시킨다.
  server.close(function (err: Error | undefined) {
    logger.info('Server closed');
    process.exit(err ? 1 : 0);
  });
});
