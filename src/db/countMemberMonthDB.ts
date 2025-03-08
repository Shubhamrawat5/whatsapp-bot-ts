import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createCountMemberTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS count_member_month(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT NOT NULL,
      groupjid TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      warning_count INTEGER NOT NULL DEFAULT 0 CHECK (
          warning_count BETWEEN 0
          AND 3
      ),
      video_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (memberjid, groupjid),
      CONSTRAINT countmember_groupjid_fkey FOREIGN KEY (groupjid) REFERENCES pvx_group (groupjid),
      CONSTRAINT countmember_memberjid_fkey FOREIGN KEY (memberjid) REFERENCES member (memberjid)
    );`
  );
};

export interface GetCountTopMonth {
  name: string;
  memberjid: string;
  message_count: number;
}

// pvxtt: top member stats of all groups
export const getCountTopMonth = async (
  noOfResult: number
): Promise<GetCountTopMonth[]> => {
  try {
    const res = await pool.query(
      `SELECT member.name,count_member_month.memberjid,sum(count_member_month.message_count) as message_count FROM count_member_month LEFT JOIN member ON count_member_month.memberjid=member.memberjid GROUP BY count_member_month.memberjid,member.name ORDER BY message_count DESC LIMIT ${noOfResult};`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountTopMonth DB]", error, { noOfResult });
  }
  return [];
};

export interface GetCountGroupsMonth {
  gname: string;
  message_count: number;
}

// pvxgg: all groups stats
export const getCountGroupsMonth = async (): Promise<GetCountGroupsMonth[]> => {
  try {
    const res = await pool.query(
      "SELECT pvx_group.gname,SUM(count_member_month.message_count) as message_count from count_member_month INNER JOIN pvx_group ON count_member_month.groupjid = pvx_group.groupjid GROUP BY pvx_group.gname ORDER BY message_count DESC;"
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountGroupsMonth DB]", error, undefined);
  }
  return [];
};

export const setCountMemberMonth = async (
  memberjid: string,
  groupjid: string,
  name: string | undefined | null
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    // update count
    const res1 = await pool.query(
      "UPDATE count_member_month SET message_count = message_count+1, updated_at = NOW() WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    if (res1.rowCount === 0) {
      await pool.query(
        "INSERT INTO count_member_month (memberjid, groupjid, message_count, warning_count, video_count) VALUES($1,$2,$3,$4,$5);",
        [memberjid, groupjid, 1, 0, 0]
      );
    }

    return true;
  } catch (error) {
    await loggerBot(undefined, "[setCountMemberMonth DB]", error, {
      memberjid,
      groupjid,
      name,
    });
    return false;
  }
};
