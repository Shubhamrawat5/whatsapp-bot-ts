import pool from "./pool";

export const createMembersTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS members(
        memberjid TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        donation INTEGER,
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

// export const addDonation = async (
//   name: string,
//   number: number,
//   donation: number
// ): Promise<boolean> => {
//   try {
//     await pool.query("INSERT INTO members VALUES($1,$2,$3);", [
//       name,
//       number,
//       donation,
//     ]);

//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };
