import pool from "./pool";

export const createMembersTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS members(
        memberjid TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        donation INTEGER,
        milestones JSON
    );`
  );
};

export interface GetUsernames {
  [key: string]: string;
}

// get usesrnames
export const getUsernames = async (
  memberjidArray: string[]
): Promise<GetUsernames[]> => {
  const result = await pool.query(
    "SELECT * from members where memberjid = ANY($1::TEXT[])",
    [memberjidArray]
  );
  if (result.rowCount) {
    return result.rows;
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
  const result = await pool.query(
    "select * from members where donation>0 ORDER BY donation DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export const setDonation = async (
  number: number,
  donation: number
): Promise<boolean> => {
  const numberWithJid = `${number}@s.whatsapp.net`;
  try {
    const res = await pool.query(
      "UPDATE members SET donation=$2 WHERE memberjid=$1;",
      [numberWithJid, donation]
    );

    // not updated
    if (res.rowCount === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

/* -------------------------------- MILESTONE ------------------------------- */
export interface GetMilestones {
  memberjid: string;
  name: string;
  milestones: string[];
}

export const getMilestones = async (
  memberjid: string
): Promise<GetMilestones[]> => {
  try {
    const result = await pool.query(
      "SELECT memberjid, name, milestones FROM members memberjid=$1;",
      [memberjid]
    );
    if (result.rowCount) {
      return result.rows;
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestones = async (
  memberjid: string,
  milestones: string[]
): Promise<boolean> => {
  try {
    const milestonesJson = JSON.stringify(milestones);
    const res = await pool.query(
      "UPDATE members SET milestones=$2 WHERE memberjid=$1;",
      [memberjid, milestonesJson]
    );

    // not updated
    if (res.rowCount === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// getDonation().then((res) => {
//   res.forEach(async (r) => {
//     const jid = `${r.number}@s.whatsapp.net`;
//     const result = await pool.query(
//       "SELECT * from members WHERE memberjid=$1;",
//       [jid]
//     );
//     console.log(jid);

//     await pool.query("UPDATE members SET donation=$1 where memberjid=$2;", [
//       r.amount,
//       jid,
//     ]);
//   });
// });
