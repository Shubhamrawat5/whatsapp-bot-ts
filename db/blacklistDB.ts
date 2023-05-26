import { pool } from "./pool";

//create blacklist table if not there
//TODO: VERIFY ALL THE NUMBER ARE OF TYPE TEXT IN SCHEMA
const createBlacklistTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS blacklist(number text PRIMARY KEY, reason text);"
  );
};
export interface GetBlacklist {
  number: string;
  reason: string | null;
}

export const getBlacklist = async (
  number?: string
): Promise<GetBlacklist[]> => {
  await createBlacklistTable();
  let result;
  if (number) {
    result = await pool.query("select * from blacklist where number=$1;", [
      number,
    ]);
  } else {
    result = await pool.query("select * from blacklist order by number;");
  }

  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export const addBlacklist = async (
  number: string,
  reason: string
): Promise<string> => {
  try {
    const res = await pool.query("INSERT INTO blacklist VALUES($1,$2);", [
      number,
      reason,
    ]);

    if (res.rowCount === 0) return "There is some problem!";
    else return "✔️ Added to blacklist!";
  } catch (err) {
    //TODO :FIX, in one place it is there
    // if (err.code == 23505) {
    //   return "Number already blacklisted!";
    // }

    await createBlacklistTable();
    return (err as Error).toString();
  }
};

export const removeBlacklist = async (number: string): Promise<string> => {
  try {
    const res = await pool.query("DELETE FROM blacklist WHERE number=$1;", [
      number,
    ]);

    if (res.rowCount === 0) return "There is some problem!";
    else return "✔️ Removed from blacklist!";
  } catch (err) {
    console.log(err);
    await createBlacklistTable();
    return (err as Error).toString();
  }
};
