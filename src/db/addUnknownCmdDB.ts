import pool from "./pool";

// create blacklist table if not there
// 25/02/23
export const createUnknownCmdTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS x (command text PRIMARY KEY, count integer NOT NULL DEFAULT 0);"
  );
};

export interface GetUnknowCmdlist {
  command: string;
  count: number;
}

export const getUnknowCmdlist = async (): Promise<GetUnknowCmdlist[]> => {
  await createUnknownCmdTable();
  const result = await pool.query("select * from unknowncmd order by count;");

  if (result.rowCount) {
    return result.rows;
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
    }
    return true;
  } catch (err) {
    console.log(err);
    await createUnknownCmdTable();
    return false;
  }
};
