import { checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createMemberTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS member(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      donation INTEGER DEFAULT 0 CHECK (donation >= 0),
      badges TEXT[] NOT NULL DEFAULT '{}',
      role TEXT NOT NULL DEFAULT 'member',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export const setMemberName = async (
  name: string | undefined | null,
  memberjid: string
): Promise<boolean> => {
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res2 = await pool.query(
      "UPDATE member SET name=$1, updated_at = NOW() WHERE memberjid=$2;",
      [name, memberjid]
    );
    if (res2.rowCount === 0) {
      await pool.query(
        "INSERT INTO member(memberjid, name, donation, badges) VALUES($1,$2,$3,$4);",
        [memberjid, name, 0, []]
      );
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setMemberName DB]", error, {
      name,
      memberjid,
    });
    return false;
  }
};

export interface GetUsernames {
  [key: string]: string;
}

// get usesrnames
export const getUsernames = async (
  memberjidArray: string[]
): Promise<GetUsernames[]> => {
  try {
    const res = await pool.query(
      "SELECT * FROM member WHERE memberjid = ANY($1::TEXT[])",
      [memberjidArray]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getUsernames DB]", error, { memberjidArray });
  }
  return [];
};

/* -------------------------------- DONATIONS ------------------------------- */
export interface GetDonation {
  name: string;
  memberjid: string;
  donation: number;
}

export const getDonation = async (): Promise<GetDonation[]> => {
  try {
    const res = await pool.query(
      "SELECT * FROM member WHERE donation>0 ORDER BY donation DESC;"
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getDonation DB]", error, undefined);
  }
  return [];
};

export const setDonation = async (
  memberjid: string,
  donation: number,
  number: string
): Promise<boolean> => {
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE member SET donation=$2, updated_at = NOW() WHERE memberjid=$1;",
      [memberjid, donation]
    );

    // not updated
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO member(memberjid, name, donation, badges) VALUES($1,$2,$3,$4);",
        [memberjid, number, donation, []]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setDonation DB]", error, {
      number,
      donation,
    });
    return false;
  }
};

/* -------------------------------- badge ------------------------------- */
export interface GetBadges {
  memberjid: string;
  name: string;
  badges?: string[];
}

export const getBadges = async (memberjid: string): Promise<GetBadges[]> => {
  try {
    const res = await pool.query(
      "SELECT memberjid, name, badges FROM member WHERE memberjid=$1;",
      [memberjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getBadges DB]", error, { memberjid });
  }
  return [];
};

export const setBadges = async (
  memberjid: string,
  badges: string[]
): Promise<boolean> => {
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE member SET badges=$2, updated_at = NOW() WHERE memberjid=$1;",
      [memberjid, badges]
    );

    // not updated
    if (res.rowCount === 0) {
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setBadges DB]", error, {
      memberjid,
      badges,
    });
    return false;
  }
};
