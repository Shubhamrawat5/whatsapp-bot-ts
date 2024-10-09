import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export interface GetCountWarning {
  warning_count: number;
}

export const getCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountWarning[]> => {
  try {
    const result = await pool.query(
      "SELECT warning_count FROM count_member WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    if (result.rowCount) {
      return result.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountWarning DB]", error, {
      memberjid,
      groupjid,
    });
  }
  return [];
};

export interface GetCountWarningAllGroup {
  memberjid: string;
  name: string;
  warning_count: number;
}

export const getCountWarningAllGroup = async (): Promise<
  GetCountWarningAllGroup[]
> => {
  try {
    const res = await pool.query(
      "SELECT count_member.memberjid, sum(count_member.warning_count) as warning_count, member.name FROM count_member INNER JOIN member ON count_member.memberjid=member.memberjid WHERE warning_count>0 GROUP BY count_member.memberjid,member.name ORDER BY warning_count DESC;"
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
  memberjid: string;
  warning_count: number;
}

export const getCountWarningAll = async (
  groupjid: string
): Promise<GetCountWarningAll[]> => {
  try {
    const res = await pool.query(
      "SELECT count_member.memberjid, count_member.warning_count, member.name FROM count_member INNER JOIN member ON count_member.memberjid=member.memberjid WHERE groupjid=$1 and warning_count>0 ORDER BY warning_count DESC;",
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
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = warning_count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[setCountWarning DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};

export const reduceCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = warning_count-1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }

    return false;
  } catch (error) {
    await loggerBot(undefined, "[reduceCountWarning DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};

export const clearCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET warning_count = 0 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[clearCountWarning DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};
