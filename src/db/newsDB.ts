import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createNewsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS news(
      headline TEXT PRIMARY KEY,
      at DATE NOT NULL
    );`
  );
};

export const storeNews = async (headline: string): Promise<boolean> => {
  try {
    const at = new Date().toISOString().slice(0, 10);
    const res = await pool.query(
      "INSERT INTO news VALUES($1) ON CONFLICT(news) DO NOTHING;",
      [headline, at]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[storeNews DB]", error, undefined);
    return false;
  }
};
