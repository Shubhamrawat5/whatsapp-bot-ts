import pool from "./pool";

// create createCountVideoTable table if not there
// 15/03/23
export const createGroupParticipantTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupparticipant(memberjid text , groupjid text, action text, date timestamp);"
  );
};

// module.exports.getGroupParticipant = async (groupjid) => {
//   try {
//     let result = await pool.query(
//       "SELECT cv.memberjid,cv.count,cmn.name FROM countvideo cv LEFT JOIN countmembername cmn
// ON cv.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
//       [groupjid]
//     );
//     if (result.rowCount) {
//       return result.rows;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// };

export const setGroupParticipant = async (
  memberjid: string,
  groupjid: string,
  action: string
): Promise<boolean> => {
  const today = new Date();
  let localeDate = today.toLocaleDateString("en-GB", {
    timeZone: "Asia/kolkata",
  });
  const localeDateList = localeDate.split("/");
  const temp = localeDateList[0];
  // eslint-disable-next-line prefer-destructuring
  localeDateList[0] = localeDateList[2];
  localeDateList[2] = temp;
  localeDate = localeDateList.join("/");

  const localeTime = today.toLocaleTimeString("en-GB", {
    timeZone: "Asia/kolkata",
  });

  const todayNew = `${localeDate} ${localeTime}`;
  console.log(todayNew);

  try {
    await pool.query("INSERT INTO groupparticipant VALUES($1,$2,$3,$4);", [
      memberjid,
      groupjid,
      action,
      todayNew,
    ]);
    return true;
  } catch (err) {
    console.log(err);
    await createGroupParticipantTable();
    return false;
  }
};
