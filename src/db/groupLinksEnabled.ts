import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createGroupLinksEnabledTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS grouplinksenabled(
      enabled BOOLEAN PRIMARY KEY
    );`
  );
};

export const setGroupLinksEnabled = async (
  enabled: boolean
): Promise<boolean> => {
  try {
    const res = await pool.query("UPDATE grouplinksenabled SET enabled = $1;", [
      enabled,
    ]);
    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO grouplinksenabled VALUES($1);",
        [enabled]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setGroupLinksEnabled DB]", error, { enabled });
    return false;
  }
};
