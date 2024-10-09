import { loggerBot } from "../utils/logger";
import pool from "./pool";

// 25/02/23
export const createUnknownCmdTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS unknown_cmd(
      uuid UUID DEFAULT gen_random_uuid(),
      command TEXT PRIMARY KEY, 
      count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export interface GetUnknowCmdlist {
  command: string;
  count: number;
}

export const getUnknowCmdlist = async (): Promise<GetUnknowCmdlist[]> => {
  try {
    const res = await pool.query("SELECT * FROM unknown_cmd ORDER BY count;");

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getUnknowCmdlist DB]", error, undefined);
  }
  return [];
};

export const addUnknownCmd = async (command: string): Promise<boolean> => {
  try {
    const res = await pool.query(
      "UPDATE unknown_cmd SET count = count+1, updated_at = NOW() WHERE command=$1;",
      [command]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO unknown_cmd (command, count) VALUES($1,$2);",
        [command, 1]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[addUnknownCmd DB]", error, { command });
    return false;
  }
};
