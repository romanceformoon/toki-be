import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

export const connection = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
  });
};
