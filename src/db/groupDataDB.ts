import pool from "./pool";

// TODO: ADD NOT NULL IN ALL TABLES
// create groups table if not there
export const createGroupsTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groups(groupjid text PRIMARY KEY, gname text);"
  );
};

export interface GetGroupNameLink {
  groupjid: string;
  gname: string;
  link: string;
}

// TODO: FIX CAPITAL SMALL OF SELECT AND ALL
export const getGroupNameLink = async (): Promise<GetGroupNameLink[]> => {
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
      await pool.query("INSERT INTO groups VALUES($1,$2,$3);", [
        groupjid,
        gname,
        link,
      ]);
    }

    return true;
  } catch (err) {
    console.log(err);
    await createGroupsTable();
    return false;
  }
};
