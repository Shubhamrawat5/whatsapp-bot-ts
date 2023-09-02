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

export const storeNews = async (
  headline: string,
  at: string
): Promise<boolean> => {
  try {
    if (!headline) return false;
    // TODO: CHECK THIS
    // SELECT query can be used instead to check if news is already there or not,
    // but it'll lead to one extra query
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

export const deleteOldNews = async (atOld: string): Promise<boolean> => {
  try {
    const res = await pool.query("DELETE FROM news WHERE at < $1", [atOld]);

    if (res.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[storeNews DB]", error, undefined);
    return false;
  }
};
