import { Countmember } from "@prisma/client";
import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
import prisma from "../prismaClient";
import { loggerBot } from "../utils/logger";

export const getWarning = async (
  memberjid: string,
  groupjid: string
): Promise<number | null> => {
  try {
    const countmember = await prisma.countmember.findUnique({
      where: {
        memberMemberjid_groupGroupjid: {
          memberMemberjid: memberjid,
          groupGroupjid: groupjid,
        },
      },
    });

    if (countmember) return countmember.warning_count;
    return null;
  } catch (error) {
    await loggerBot(undefined, "[getCountWarning DB]", error, {
      memberjid,
      groupjid,
    });
  }
  return null;
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
      "SELECT countmember.memberjid, sum(countmember.warning_count) as warning_count, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid WHERE warning_count>0 GROUP BY countmember.memberjid,members.name ORDER BY warning_count DESC;"
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
      "SELECT countmember.memberjid, countmember.warning_count, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid WHERE groupjid=$1 and warning_count>0 ORDER BY warning_count DESC;",
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

export const updateWarning = async (
  memberjid: string,
  groupjid: string,
  count: number
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    const countmember = await prisma.countmember.update({
      data: {
        warning_count: count,
      },
      where: {
        memberMemberjid_groupGroupjid: {
          memberMemberjid: memberjid,
          groupGroupjid: groupjid,
        },
      },
    });

    if (!countmember) {
      // create
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
