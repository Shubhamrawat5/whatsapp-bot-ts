// import pool from "./pool";

// export const createGroupbackupTable = async () => {
//   await pool.query(
//     "CREATE TABLE IF NOT EXISTS groupbackup(date text PRIMARY KEY,
// group_name text, group_desc text, members_count integer, data json);"
//   );
// };

// export const takeGroupbackup = async (
//   groupName: string,
//   groupDesc: string,
//   groupData: any
// ): Promise<boolean> => {
//   try {
//     await createGroupbackupTable();

//     const date = new Date().toLocaleString("en-GB", {
//       timeZone: "Asia/kolkata",
//     });
//     const membersCount = groupData.length;
//     const groupDataStringify = JSON.stringify(groupData);

//     await pool.query("INSERT INTO groupbackup VALUES($1,$2,$3,$4,$5);", [
//       date,
//       groupName,
//       groupDesc,
//       membersCount,
//       groupDataStringify,
//     ]);

//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };
