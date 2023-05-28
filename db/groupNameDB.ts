import { pool } from "./pool";

//create groupname table if not there
const createGroupNameTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupname(groupjid text PRIMARY KEY, gname text);"
  );
};

// module.exports.getCountGroup = async () => {
//   await createGroupNameTable();
//   let result = await pool.query("SELECT * FROM groupname;");
//   if (result.rowCount) {
//     return result.rows;
//   } else {
//     return [];
//   }
// };

export const setGroupName = async (
  groupjid: string,
  gname: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;
    await createGroupNameTable();

    //check if groupjid is present in DB or not
    const result = await pool.query(
      "select * from groupname where groupjid=$1;",
      [groupjid]
    );

    //present
    if (result.rows.length) {
      // const count = result.rows[0].count;

      await pool.query("UPDATE groupname SET gname = $1 WHERE groupjid=$2;", [
        gname,
        groupjid,
      ]);
    } else {
      await pool.query("INSERT INTO groupname VALUES($1,$2);", [
        groupjid,
        gname,
      ]);
    }

    return true;
  } catch (err) {
    console.log(err);
    await createGroupNameTable();
    return false;
  }
};
