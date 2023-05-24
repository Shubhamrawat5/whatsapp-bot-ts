import { pool } from "./pool";

//create createCountVideoTable table if not there
const createMilestoneTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS milestone(memberjid text PRIMARY KEY, achieved json);"
  );
};

export const getMilestone = async (memberJid: string) => {
  try {
    let result = await pool.query(
      "SELECT m.memberJid,m.achieved,cmn.name FROM milestone m INNER JOIN countmembername cmn ON m.memberJid=cmn.memberJid WHERE m.memberJid=$1;",
      [memberJid]
    );
    if (result.rowCount) {
      return result.rows;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestone = async (memberJid: string, achieved: string) => {
  achieved = JSON.stringify(achieved);

  try {
    let res = await pool.query(
      "UPDATE milestone SET achieved=$2 WHERE memberjid=$1;",
      [memberJid, achieved]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO milestone VALUES($1,$2);", [
        memberJid,
        achieved,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createMilestoneTable();
    return false;
  }
};

//create createCountVideoTable table if not there
const createMilestoneTextTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS milestonetext(sno SERIAL NOT NULL PRIMARY KEY, milestone text);"
  );
};

export const getMilestoneText = async () => {
  try {
    let result = await pool.query("SELECT * from milestonetext;");
    if (result.rowCount) {
      return result.rows;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestoneText = async (milestone: string) => {
  try {
    await pool.query("INSERT INTO milestonetext(milestone) VALUES($1);", [
      milestone,
    ]);
    return true;
  } catch (err) {
    console.log(err);
    await createMilestoneTextTable();
    return false;
  }
};
