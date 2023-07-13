import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createBlacklistTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS blacklist(
      number TEXT PRIMARY KEY, 
      reason TEXT NOT NULL, 
      admin TEXT NOT NULL
    );`
  );
};
export interface GetBlacklist {
  number: string;
  reason: string | null;
  admin: string | null;
  adminname: string | null;
}

export const getBlacklist = async (
  number?: string
): Promise<GetBlacklist[]> => {
  try {
    let res;
    if (number) {
      res = await pool.query(
        "select bl.number, bl.reason, bl.admin, memb.name as adminname from blacklist bl left join members memb on bl.admin=memb.memberjid where number=$1;",
        [number]
      );
    } else {
      res = await pool.query(
        "select bl.number, bl.reason,  bl.admin, memb.name as adminname from blacklist bl left join members memb on bl.admin=memb.memberjid order by number;"
      );
    }

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[getBlacklist DB]", error, undefined);
  }
  return [];
};

export const addBlacklist = async (
  number: string,
  reason: string,
  admin: string
): Promise<string> => {
  try {
    const res = await pool.query("INSERT INTO blacklist VALUES($1,$2,$3);", [
      number,
      reason,
      admin,
    ]);

    if (res.rowCount === 0) return "There is some problem!";
    return "✔️ Added to blacklist!";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return "Number is already blacklisted!";
    }

    console.log(error);
    await loggerBot(undefined, "[addBlacklist DB]", error, undefined);
    return (error as Error).toString();
  }
};

export const removeBlacklist = async (number: string): Promise<string> => {
  try {
    const res = await pool.query("DELETE FROM blacklist WHERE number=$1;", [
      number,
    ]);

    if (res.rowCount === 0) {
      return "There is some problem! Check the number";
    }
    return "✔️ Removed from blacklist!";
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[removeBlacklist DB]", error, undefined);
    return (error as Error).toString();
  }
};
