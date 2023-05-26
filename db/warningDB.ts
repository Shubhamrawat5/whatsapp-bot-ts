import { pool } from "./pool";

//create createCountWarningTable table if not there
const createCountWarningTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countwarning(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid), check(count BETWEEN 1 and 3));"
  );
};

export interface GetCountWarning {
  count: number;
}

export const getCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountWarning[]> => {
  let result = await pool.query(
    "SELECT count FROM countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberjid, groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountWarningAllGroup {
  memberjid: string;
  name: string;
  count: number;
}

export const getCountWarningAllGroup = async (): Promise<
  GetCountWarningAllGroup[]
> => {
  let result = await pool.query(
    "SELECT cw.memberjid,sum(cw.count) as count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid group by cw.memberjid,cmn.name ORDER BY count DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};
export interface GetCountWarningAll {
  name: string;
  memberjid: string;
  count: number;
}

export const getCountWarningAll = async (
  groupjid: string
): Promise<GetCountWarningAll[]> => {
  let result = await pool.query(
    "SELECT cw.memberjid,cw.count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
    [groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export const setCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    //check if groupjid is present in DB or not
    let result = await pool.query(
      "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    //present
    if (result.rows.length) {
      let count = result.rows[0].count;

      await pool.query(
        "UPDATE countwarning SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
        [memberjid, groupjid]
      );
    } else {
      await pool.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
        memberjid,
        groupjid,
        1,
      ]);
    }
    return true;
  } catch (error) {
    console.log(error);
    await createCountWarningTable();
    return false;
  }
};

export const reduceCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    //check if groupjid is present in DB or not
    let result = await pool.query(
      "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    //present
    if (result.rows.length) {
      let count = result.rows[0].count;

      await pool.query(
        "UPDATE countwarning SET count = count-1 WHERE memberjid=$1 AND groupjid=$2;",
        [memberjid, groupjid]
      );
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    await createCountWarningTable();
    return false;
  }
};

export const clearCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    //check if groupjid is present in DB or not
    let result = await pool.query(
      "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    //present
    if (result.rows.length) {
      let count = result.rows[0].count;

      await pool.query(
        "delete from countwarning WHERE memberjid=$1 AND groupjid=$2;",
        [memberjid, groupjid]
      );
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    await createCountWarningTable();
    return false;
  }
};
