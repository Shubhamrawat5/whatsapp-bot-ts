import { getIndianDateTime } from "../functions/getIndianDateTime";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createNewsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS news(
      uuid UUID DEFAULT gen_random_uuid(),
      headline TEXT PRIMARY KEY,
      at DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export const storeNews = async (headline: string): Promise<boolean> => {
  try {
    const date = getIndianDateTime();

    if (!headline) return false;
    // TODO: CHECK THIS
    // SELECT query can be used instead to check if news is already there or not,
    // but it'll lead to one extra query
    const res = await pool.query(
      "INSERT INTO news (headline, at) VALUES($1,$2) ON CONFLICT(headline) DO NOTHING;",
      [headline, date]
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

export const deleteOldNews = async (atOld: Date): Promise<boolean> => {
  try {
    const res = await pool.query("DELETE FROM news WHERE at < $1", [atOld]);

    if (res.rowCount && res.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[storeNews DB]", error, undefined);
    return false;
  }
};
