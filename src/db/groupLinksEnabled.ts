import pool from "./pool";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// getGroupLink().then(async (res) => {
//   console.log(res);
//   res.forEach(async (group) => {
//     await pool.query("UPDATE groupname SET link = $1 WHERE groupjid=$2;", [
//       group.link,
//       group.groupjid,
//     ]);
//   });
// });

// create group links table if not there
export const createGroupLinksEnabledTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS grouplinksenabled(enabled integer PRIMARY KEY);"
  );
};

// 0 or 1
export const setGroupLinksEnabled = async (
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
