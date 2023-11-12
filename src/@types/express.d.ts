declare module Express {
    interface Request {
        accessToken: string;
        database: mysql.Connection;
    }
}
