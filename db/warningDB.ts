import { pool } from "./pool";

//create createCountWarningTable table if not there
const createCountWarningTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countwarning(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid), check(count BETWEEN 1 and 3));"
  );
};

export const getCountWarning = async (memberjid: string, groupJid: string) => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT count FROM countwarning WHERE memberjid=$1 AND groupJid=$2;",
    [memberjid, groupJid]
  );
  if (result.rowCount) {
    return result.rows[0].count;
  } else {
    return 0;
  }
};

export const getCountWarningAllGroup = async () => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT cw.memberjid,sum(cw.count) as count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid group by cw.memberjid,cmn.name ORDER BY count DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export const getCountWarningAll = async (groupJid: string) => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT cw.memberjid,cw.count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
    [groupJid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export const setCountWarning = async (memberJid: string, groupJid: string) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countwarning SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );

    return count + 1;
  } else {
    await pool.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
      memberJid,
      groupJid,
      1,
    ]);

    return 1;
  }
};

export const reduceCountWarning = async (
  memberJid: string,
  groupJid: string
) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countwarning SET count = count-1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
    return count - 1;
  } else {
    await pool.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
      memberJid,
      groupJid,
      1,
    ]);
    return 1;
  }
};

export const clearCountWarning = async (
  memberJid: string,
  groupJid: string
) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "delete from countwarning WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
    return 1;
  } else {
    return 0;
  }
};
