import { loggerBot } from "../utils/logger";
import pool from "./pool";

// 25/02/23
export const createUnknownCmdTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS unknowncmd(
      command TEXT PRIMARY KEY, 
      count INTEGER NOT NULL DEFAULT 0
    );`
  );
};

export interface GetUnknowCmdlist {
  command: string;
  count: number;
}

export const getUnknowCmdlist = async (): Promise<GetUnknowCmdlist[]> => {
  const res = await pool.query("select * from unknowncmd order by count;");

  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

export const addUnknownCmd = async (command: string): Promise<boolean> => {
  try {
    const res = await pool.query(
      "UPDATE unknowncmd SET count = count+1 WHERE command=$1;",
      [command]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO unknowncmd VALUES($1,$2);", [command, 1]);
      // TODO: CHECK RES.ROWCOUNT
    }
    return true;
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[addUnknownCmd DB]", error, undefined);
    return false;
  }
};
