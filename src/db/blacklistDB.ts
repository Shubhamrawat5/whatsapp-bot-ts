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
}

export const getBlacklist = async (
  number?: string
): Promise<GetBlacklist[]> => {
  // FIX THESE CREATE TABLES
  let result;
  if (number) {
    result = await pool.query(
      "select bl.number,bl.reason,memb.name as admin from blacklist bl left join members memb on bl.admin=memb.memberjid where number=$1;",
      [number]
    );
  } else {
    result = await pool.query(
      "select bl.number,bl.reason,memb.name as admin from blacklist bl left join members memb on bl.admin=memb.memberjid order by number;"
    );
  }

  if (result.rowCount) {
    return result.rows;
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
  } catch (err: any) {
    if (err.code === "23505") {
      return "Number is already blacklisted!";
    }
    console.log(err);

    return (err as Error).toString();
  }
};

export const removeBlacklist = async (
  number: string,
  sender: string
): Promise<string> => {
  try {
    const result = await pool.query(
      "select bl.number, bl.reason, bl.admin, memb.name as adminname from blacklist bl left join members memb on bl.admin=memb.memberjid where number=$1;",
      [number]
    );

    await pool.query("select * from blacklist where number=$1;", [number]);

    if (result.rowCount) {
      const { admin, adminname } = result.rows[0];
      if (!admin || admin === sender) {
        await pool.query("DELETE FROM blacklist WHERE number=$1;", [number]);
        return "✔️ Removed from blacklist!";
      }
      let message = `Only the admin who added in blacklist can remove!`;
      if (adminname) message += `\nGiven by ${adminname}`;
      return message;
    }
    return "There is some problem! Check the number";
  } catch (err) {
    console.log(err);
    return (err as Error).toString();
  }
};
