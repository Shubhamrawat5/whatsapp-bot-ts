import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createCountVideoTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS countvideo(
      memberjid TEXT NOT NULL, 
      groupjid TEXT NOT NULL, 
      count INTEGER NOT NULL DEFAULT 0, 
      PRIMARY KEY (memberjid, groupjid)
    );`
  );
};

export interface GetCountVideo {
  memberjid: string;
  count: number;
  name: string;
}

export const getCountVideo = async (
  groupjid: string
): Promise<GetCountVideo[]> => {
  try {
    const res = await pool.query(
      "SELECT cv.memberjid,cv.count,memb.name FROM countvideo cv LEFT JOIN members memb ON cv.memberjid=memb.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
      [groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountVideo DB]", error, { groupjid });
  }
  return [];
};

export const setCountVideo = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!groupjid.endsWith("@g.us")) return false;

  try {
    const res = await pool.query(
      "UPDATE countvideo SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO countvideo VALUES($1,$2,$3);",
        [memberjid, groupjid, 1]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setCountVideo DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};

// module.exports.setCountVideo = async (memberjid, groupjid) => {
//   if (!groupjid.endsWith("@g.us")) return;
//   let result;
//   try {
//     result = await pool.query(
//       "SELECT * FROM countvideo WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//   } catch (err) {
//     result = await pool.query(
//       "SELECT * FROM countvideo WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//   }

//   //present
//   if (result.rows.length) {
//     let count = result.rows[0].count;

//     await pool.query(
//       "UPDATE countvideo SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//
//     return count + 1;
//   } else {
//     await pool.query("INSERT INTO countvideo VALUES($1,$2,$3);", [
//       memberjid,
//       groupjid,
//       1,
//     ]);
//
//     return 1;
//   }
// };
