import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createStudyTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS studynews(
      news TEXT PRIMARY KEY
    );`
  );
};

export const storeNewsStudy = async (news: string): Promise<boolean> => {
  try {
    const res = await pool.query("INSERT INTO studynews VALUES($1);", [news]);

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[storeNewsStudy DB]", error, undefined);
    return false;
  }
};
