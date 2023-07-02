import pool from "./pool";

export const createGroupsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS groups(
      groupjid TEXT PRIMARY KEY, 
      gname TEXT NOT NULL, 
      link TEXT, 
      commands_disabled JSON,
    );`
  );
};

export interface GetGroupsData {
  groupjid: string;
  gname: string;
  link?: string;
  commands_disabled?: string[];
}

// TODO: FIX CAPITAL SMALL OF SELECT AND ALL
export const getGroupsData = async (
  groupjid?: string
): Promise<GetGroupsData[]> => {
  let res;
  if (groupjid) {
    res = await pool.query("select * from groups where groupjid=$1;", [
      groupjid,
    ]);
  } else {
    res = await pool.query("select * from groups;");
  }
  // not updated. time to insert
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

export const setGroupsData = async (
  groupjid: string,
  gname: string,
  link: string | undefined,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    // check if groupjid is present in DB or not
    const res = await pool.query(
      "UPDATE groups SET gname = $1, link=$2 WHERE groupjid=$3;",
      [gname, link, groupjid]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO groups VALUES($1,$2,$3,$4);", [
        groupjid,
        gname,
        link,
        disabledJson,
      ]);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const setDisableCommand = async (
  groupjid: string,
  gname: string,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);

  try {
    const res = await pool.query(
      "UPDATE groups SET commands_disabled=$1 WHERE groupjid=$2;",
      [disabledJson, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO groups VALUES($1,$2,$3,$4);", [
        groupjid,
        gname,
        null,
        disabledJson,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
