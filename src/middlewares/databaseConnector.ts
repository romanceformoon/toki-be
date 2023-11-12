import { NextFunction, Request, Response } from 'express';
import mysql from 'mysql2/promise';

export const databaseConnector = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'toki',
    });

    req.database = connection;
    next();
};
