import pool from "./pool";

// TODO: ADD NOT NULL IN ALL TABLES
// create groupname table if not there
export const createGroupNameTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupname(groupjid text PRIMARY KEY, gname text);"
  );
};

export interface GetGroupNameLink {
  groupjid: string;
  gname: string;
  link: string;
}

// TODO: FIX CAPITAL SMALL OF SELECT AND ALL
export const getGroupNameLink = async (): Promise<GetGroupNameLink[]> => {
  const res = await pool.query("select * from groupname;");
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
    await createGroupNameTable();

    // check if groupjid is present in DB or not
    const res = await pool.query(
      "UPDATE groupname SET gname = $1, link=$2 WHERE groupjid=$3;",
      [gname, link, groupjid]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO groupname VALUES($1,$2,$3);", [
        groupjid,
        gname,
        link,
      ]);
    }

    return true;
  } catch (err) {
    console.log(err);
    await createGroupNameTable();
    return false;
  }
};
