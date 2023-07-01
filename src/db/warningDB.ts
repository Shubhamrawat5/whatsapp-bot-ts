import pool from "./pool";

export interface GetCountWarning {
  warning: number;
}

export const getCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountWarning[]> => {
  const result = await pool.query(
    "SELECT warning FROM countmember WHERE memberjid=$1 AND groupjid=$2;",
    [memberjid, groupjid]
  );

  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export interface GetCountWarningAllGroup {
  memberjid: string;
  name: string;
  warning: number;
}

export const getCountWarningAllGroup = async (): Promise<
  GetCountWarningAllGroup[]
> => {
  const result = await pool.query(
    "SELECT countmember.memberjid, sum(countmember.warning) as warning, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid where warning>0 group by countmember.memberjid,members.name ORDER BY warning DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};
export interface GetCountWarningAll {
  name: string;
  memberjid: string;
  warning: number;
}

export const getCountWarningAll = async (
  groupjid: string
): Promise<GetCountWarningAll[]> => {
  const result = await pool.query(
    "SELECT countmember.memberjid, countmember.warning, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid WHERE groupjid=$1 and warning>0 ORDER BY warning DESC;",
    [groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export const setCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    // TODO: REMOVE THESE SELECT * in starting
    const result = await pool.query(
      "UPDATE countmember SET warning = warning+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (result.rows.length) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const reduceCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    const result = await pool.query(
      "UPDATE countmember SET warning = warning-1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (result.rows.length) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const clearCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    const result = await pool.query(
      "UPDATE countmember SET warning = 0 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (result.rows.length) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
