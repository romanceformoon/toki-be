module.exports = {
    apps: [
        {
            node_args:
                '-r ./tsconfig-paths-bootstrap.js -r tsconfig-paths/register',
            script: 'dist/index.js', // 실행할 파일명
            exec_mode: 'fork', // 실행 모드
            name: "toki",
            wait_ready: true, // ready 신호를 기다릴지에 대한 여부
            listen_timeout: 5000, // 앱 실행 신호까지 기다릴 최대 시간. ms 단위.
            kill_timeout: 5000, // 앱이 종료될 때까지 기다릴 최대 시간. ms 단위.
        },
    ],
};
