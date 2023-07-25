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
      "INSERT INTO news VALUES($1,$2) ON CONFLICT(headline) DO NOTHING;",
      [headline, at]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[storeNews DB]", error, { headline });
    return false;
  }
};

export const deleteOldNews = async (days: number): Promise<boolean> => {
  const today = new Date();
  const oldDate = new Date(today.setDate(today.getDate() - days));
  const at = oldDate.toISOString().slice(0, 10);

  try {
    const res = await pool.query("DELETE FROM news WHERE at < $1", [at]);

    if (res.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[storeNews DB]", error, undefined);
    return false;
  }
};
