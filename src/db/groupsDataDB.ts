import pool from "./pool";

// TODO: ADD NOT NULL IN ALL TABLES
// create groups table if not there
export const createGroupsTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groups(groupjid text PRIMARY KEY, gname text NOT NULL, link text, commands_disabled json);"
  );
};

export interface GetGroupsData {
  groupjid: string;
  gname: string;
  link: string;
  commands_disabled: string[];
}

// TODO: FIX CAPITAL SMALL OF SELECT AND ALL
export const getGroupsData = async (): Promise<GetGroupsData[]> => {
  const res = await pool.query("select * from groups;");
  // not updated. time to insert
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

export const setGroupNameLink = async (
  groupjid: string,
  gname: string,
  link?: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;
    await createGroupsTable();

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
        null,
      ]);
    }

    return true;
  } catch (err) {
    console.log(err);
    await createGroupsTable();
    return false;
  }
};

export interface GetDisableCommandData {
  groupjid: string;
  commands_disabled: string[];
}

export const getDisableCommand = async (
  groupjid: string
): Promise<GetDisableCommandData[]> => {
  const result = await pool.query("select * from groups where groupjid=$1;", [
    groupjid,
  ]);
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export const setDisableCommand = async (
  groupjid: string,
  gname: string,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);

  try {
    const res = await pool.query(
      "UPDATE groups SET disabled=$1 WHERE groupjid=$2;",
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
    await createGroupsTable();
    return false;
  }
};
