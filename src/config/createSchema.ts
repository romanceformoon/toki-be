import { connection } from '~/config/connection';

export const createSchema = async () => {
  const conn = await connection();

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS toki DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`
  );
  await conn.query(`USE toki;`);

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS 
    user (
    uid VARCHAR(100) NOT NULL PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL, 
    avatar VARCHAR(100)
    )`;
  await conn.query(createUserTableQuery);

  const createScoreTableQuery = `
    CREATE TABLE IF NOT EXISTS 
    score (
    uid VARCHAR(100) NOT NULL PRIMARY KEY,
    aery_exp INTEGER DEFAULT 0,
    aery_rating INTEGER DEFAULT 0,
    aery_dan VARCHAR(50),
    insane_exp INTEGER DEFAULT 0,
    insane_rating INTEGER DEFAULT 0,
    insane_dan VARCHAR(50),
    sl_exp INTEGER DEFAULT 0,
    sl_rating INTEGER DEFAULT 0,
    sl_dan VARCHAR(50),
    st_exp INTEGER DEFAULT 0,
    st_rating INTEGER DEFAULT 0,
    st_dan VARCHAR(50)
    )`;
  await conn.query(createScoreTableQuery);

  await conn.end();
};
