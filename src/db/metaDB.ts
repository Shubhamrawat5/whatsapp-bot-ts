import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createMetaTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS meta(
      variable text PRIMARY KEY,
      value boolean
    );`
  );
};

export const setMetaValues = async (
  variable: string,
  value: boolean
): Promise<boolean> => {
  try {
    const res = await pool.query(
      "UPDATE meta SET value = $2 where variable=$1;",
      [variable, value]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query("INSERT INTO meta VALUES($1,$2);", [
        variable,
        value,
      ]);
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
