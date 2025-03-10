import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createCountTodayTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS count_member_today(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT NOT NULL,
      groupjid TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (memberjid, groupjid),
      CONSTRAINT countmember_groupjid_fkey FOREIGN KEY (groupjid) REFERENCES pvx_group (groupjid),
      CONSTRAINT countmember_memberjid_fkey FOREIGN KEY (memberjid) REFERENCES member (memberjid)
    );`
  );
};

export interface GetCountTopToday {
  name: string;
  memberjid: string;
  message_count: number;
}

// Top member stats of all groups
export const getCountTopToday = async (
  noOfResult: number
): Promise<GetCountTopToday[]> => {
  try {
    const res = await pool.query(
      `SELECT member.name,count_member_today.memberjid,sum(count_member_today.message_count) as message_count FROM count_member_today LEFT JOIN member ON count_member_today.memberjid=member.memberjid GROUP BY count_member_today.memberjid,member.name ORDER BY message_count DESC LIMIT ${noOfResult};`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountTopToday DB]", error, { noOfResult });
  }
  return [];
};

export interface GetCountGroupsToday {
  gname: string;
  message_count: number;
}

export const getCountGroupsToday = async (): Promise<GetCountGroupsToday[]> => {
  try {
    const res = await pool.query(
      `SELECT pvx_group.gname,SUM(count_member_today.message_count) as message_count from count_member_today INNER JOIN pvx_group ON count_member_today.groupjid = pvx_group.groupjid GROUP BY pvx_group.gname ORDER BY message_count DESC;`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountGroupsToday DB]", error, undefined);
  }
  return [];
};

export interface GetCountUniqueMemberToday {
  member_count: number;
  group_count: number;
}

export const getCountUniqueMemberToday = async (): Promise<
  GetCountUniqueMemberToday[]
> => {
  try {
    const res = await pool.query(
      `SELECT COUNT(DISTINCT memberjid) as member_count, COUNT(DISTINCT groupjid) as group_count FROM count_member_today;`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(
      undefined,
      "[getCountUniqueMemberToday DB]",
      error,
      undefined
    );
  }
  return [];
};

export const setCountMemberToday = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    // update count
    const res1 = await pool.query(
      "UPDATE count_member_today SET message_count = message_count+1, updated_at = NOW() WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    if (res1.rowCount === 0) {
      await pool.query(
        "INSERT INTO count_member_today (memberjid, groupjid, message_count) VALUES($1,$2,$3);",
        [memberjid, groupjid, 1]
      );
    }

    return true;
  } catch (error) {
    await loggerBot(undefined, "[setCountMemberToday DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};

export const deleteCountMemberToday = async (): Promise<boolean> => {
  try {
    const res = await pool.query("DELETE FROM count_member_today");

    if (res.rowCount && res.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[deleteCountMemberToday DB]", error, undefined);
    return false;
  }
};
