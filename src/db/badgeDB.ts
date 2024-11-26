import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createBadgeTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS badge(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      sno SERIAL,
      badge_info TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export interface GetBadgeText {
  sno: number;
  badge_info: string;
}

export const getBadgeText = async (): Promise<GetBadgeText[]> => {
  try {
    const res = await pool.query("SELECT * FROM badge;");
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getBadgeText DB]", error, undefined);
  }
  return [];
};

export const setBadgeText = async (badge: string): Promise<boolean> => {
  try {
    const res = await pool.query(
      "INSERT INTO badge(badge_info) VALUES($1) ON CONFLICT(badge_info) DO NOTHING;",
      [badge]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[setBadgeText DB]", error, { badge });
    return false;
  }
};
