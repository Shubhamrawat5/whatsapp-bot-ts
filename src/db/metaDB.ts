import { getIndianDateTime } from "../functions/getIndianDateTime";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createMetaTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS meta(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      variable TEXT UNIQUE NOT NULL,
      value BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

interface GetMetaValues {
  variable: string;
  value: boolean;
}

export const getMetaValues = async (
  variable: string
): Promise<GetMetaValues[]> => {
  try {
    let res;
    if (variable) {
      res = await pool.query("SELECT * FROM meta WHERE variable=$1;", [
        variable,
      ]);
    } else {
      res = await pool.query("SELECT * FROM meta;");
    }

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getMetaValues DB]", error, { variable });
  }
  return [];
};

export const setMetaValues = async (
  variable: string,
  value: boolean
): Promise<boolean> => {
  const date = getIndianDateTime();
  try {
    const res = await pool.query(
      "UPDATE meta SET value = $2, updated_at = NOW() where variable=$1;",
      [variable, value]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO meta (variable, value) VALUES($1,$2,$3);",
        [variable, value, date]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setMetaValues DB]", error, {
      variable,
      value,
    });
    return false;
  }
};
