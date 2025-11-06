import { checkGroupjid, checkMemberlid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export interface GetCountWarning {
  warning_count: number;
}

export const getCountWarning = async (
  memberlid: string,
  groupjid: string
): Promise<GetCountWarning[]> => {
  try {
    const result = await pool.query(
      "SELECT warning_count FROM count_member WHERE memberlid=$1 AND groupjid=$2;",
      [memberlid, groupjid]
    );

    if (result.rowCount) {
      return result.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountWarning DB]", error, {
      memberlid,
      groupjid,
    });
  }
  return [];
};

export interface GetCountWarningAllGroup {
  memberlid: string;
  name: string;
  warning_count: number;
}

export const getCountWarningAllGroup = async (): Promise<
  GetCountWarningAllGroup[]
> => {
  try {
    const res = await pool.query(
      "SELECT count_member.memberlid, sum(count_member.warning_count) as warning_count, member.name FROM count_member INNER JOIN member ON count_member.memberlid=member.memberlid WHERE warning_count>0 GROUP BY count_member.memberlid,member.name ORDER BY warning_count DESC;"
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(
      undefined,
      "[getCountWarningAllGroup DB]",
      error,
      undefined
    );
  }
  return [];
};
export interface GetCountWarningAll {
  name: string;
  memberlid: string;
  warning_count: number;
}

export const getCountWarningAll = async (
  groupjid: string
): Promise<GetCountWarningAll[]> => {
  try {
    const res = await pool.query(
      "SELECT count_member.memberlid, count_member.warning_count, member.name FROM count_member INNER JOIN member ON count_member.memberlid=member.memberlid WHERE groupjid=$1 and warning_count>0 ORDER BY warning_count DESC;",
      [groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountWarningAll DB]", error, { groupjid });
  }
  return [];
};

export const setCountWarning = async (
  memberlid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberlid(memberlid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = warning_count+1 WHERE memberlid=$1 AND groupjid=$2;",
      [memberlid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[setCountWarning DB]", error, {
      memberlid,
      groupjid,
    });
    return false;
  }
};

export const reduceCountWarning = async (
  memberlid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberlid(memberlid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = warning_count-1 WHERE memberlid=$1 AND groupjid=$2;",
      [memberlid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }

    return false;
  } catch (error) {
    await loggerBot(undefined, "[reduceCountWarning DB]", error, {
      memberlid,
      groupjid,
    });
    return false;
  }
};

export const clearCountWarning = async (
  memberlid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberlid(memberlid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = 0 WHERE memberlid=$1 AND groupjid=$2;",
      [memberlid, groupjid]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[clearCountWarning DB]", error, {
      memberlid,
      groupjid,
    });
    return false;
  }
};
