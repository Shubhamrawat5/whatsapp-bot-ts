import pool from "./pool";

// create group links table if not there
export const createGroupLinksTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS grouplinks(groupjid text PRIMARY KEY, link text);"
  );
};

export interface GetGroupLink {
  groupjid: string;
  link: string;
  gname: string;
}

export const getGroupLink = async (): Promise<GetGroupLink[]> => {
  const res = await pool.query(
    "SELECT gl.groupjid,gl.link,gn.gname FROM grouplinks gl LEFT JOIN groupname gn ON gl.groupjid=gn.groupjid;"
  );
  // not updated. time to insert
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

// create group links table if not there
export const createGroupLinksEnabledTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS grouplinksenabled(enabled integer PRIMARY KEY);"
  );
};

// 0 or 1
export const setGroupLinkEnabled = async (
  enabled: number
): Promise<boolean> => {
  try {
    const res = await pool.query("UPDATE grouplinksenabled SET enabled = $1;", [
      enabled,
    ]);
    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO grouplinksenabled VALUES($1);", [enabled]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createGroupLinksEnabledTable();
    return false;
  }
};

export const setGroupLink = async (
  groupjid: string,
  link: string
): Promise<boolean> => {
  try {
    const res = await pool.query(
      "UPDATE grouplinks SET link = $1 WHERE groupjid=$2;",
      [link, groupjid]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO grouplinks VALUES($1,$2);", [
        groupjid,
        link,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createGroupLinksTable();
    return false;
  }
};
