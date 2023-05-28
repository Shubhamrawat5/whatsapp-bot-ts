import { pool } from "./pool";

//create count table if not there
const createGroupbackupTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupbackup(date text PRIMARY KEY, group_name text, group_desc text, members_count integer, data json);"
  );
};

export const takeGroupbackup = async (
  groupName: string,
  groupDesc: string,
  groupData: any
): Promise<boolean> => {
  try {
    await createGroupbackupTable();

    const date = new Date().toLocaleString("en-GB", { timeZone: "Asia/kolkata" });
    const membersCount = groupData.length;
    groupData = JSON.stringify(groupData);

    //insert new
    await pool.query("INSERT INTO groupbackup VALUES($1,$2,$3,$4,$5);", [
      date,
      groupName,
      groupDesc,
      membersCount,
      groupData,
    ]);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
