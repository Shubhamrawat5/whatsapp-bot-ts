import { pool } from "./pool";

// create blacklist table if not there
const createBlacklistTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS blacklist(number text PRIMARY KEY, reason text, admin text);"
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
  await createBlacklistTable();
  let result;
  if (number) {
    result = await pool.query("select * from blacklist where number=$1;", [
      number,
    ]);
  } else {
    result = await pool.query(
      "select bl.number,bl.reason,cmn.name from blacklist bl left join countmembername cmn on bl.admin=cmn.memberjid order by number;"
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

    await createBlacklistTable();
    return (err as Error).toString();
  }
};

export const removeBlacklist = async (
  number: string,
  sender: string
): Promise<string> => {
  try {
    const result = await pool.query(
      "select * from blacklist where number=$1;",
      [number]
    );

    if (result.rowCount) {
      const { admin } = result.rows[0];
      if (!admin || admin == sender) {
        await pool.query("DELETE FROM blacklist WHERE number=$1;", [number]);
        return "✔️ Removed from blacklist!";
      }
      return "Only the admin who added in blacklist can remove!";
    }
    return "There is some problem! Check the number";
  } catch (err) {
    console.log(err);
    await createBlacklistTable();
    return (err as Error).toString();
  }
};
