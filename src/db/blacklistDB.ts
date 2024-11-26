import { checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createBlacklistTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS blacklist(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT UNIQUE NOT NULL,
      reason TEXT NOT NULL,
      admin TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT blacklist_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES member(memberjid)
    );`
  );
};
export interface GetBlacklist {
  memberjid: string;
  reason: string | null;
  admin: string | null;
  adminname: string | null;
}

export const getBlacklist = async (
  memberjid?: string
): Promise<GetBlacklist[]> => {
  try {
    let res;
    if (memberjid) {
      res = await pool.query(
        "SELECT bl.memberjid, bl.reason, bl.admin, memb.name as adminname from blacklist bl left join member memb on bl.admin=memb.memberjid WHERE bl.memberjid=$1;",
        [memberjid]
      );
    } else {
      res = await pool.query(
        "SELECT bl.memberjid, bl.reason, bl.admin, memb.name as adminname from blacklist bl left join member memb on bl.admin=memb.memberjid ORDER BY memberjid;"
      );
    }

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getBlacklist DB]", error, { memberjid });
  }
  return [];
};

export const addBlacklist = async (
  memberjid: string,
  reason: string,
  admin: string
): Promise<boolean> => {
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query("SELECT * FROM member WHERE memberjid = $1", [
      memberjid,
    ]);

    // not there
    if (res.rowCount === 0) {
      const number = memberjid.split("@")[0];
      const res2 = await pool.query(
        "INSERT INTO member (memberjid, name, donation, badges) VALUES($1,$2,$3,$4);",
        [memberjid, number, 0, []]
      );
      if (res2.rowCount === 0) return false;
    }

    const res2 = await pool.query(
      "INSERT INTO blacklist (memberjid, reason, admin) VALUES($1,$2,$3) ON CONFLICT(memberjid) DO NOTHING;",
      [memberjid, reason, admin]
    );

    if (res2.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[addBlacklist DB]", error, {
      memberjid,
      reason,
      admin,
    });
    return false;
  }
};

export const removeBlacklist = async (memberjid: string): Promise<boolean> => {
  try {
    const res = await pool.query("DELETE FROM blacklist WHERE memberjid=$1", [
      memberjid,
    ]);

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[removeBlacklist DB]", error, { memberjid });
    return false;
  }
};
