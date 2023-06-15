import { pool } from "./pool";

// create createCountVideoTable table if not there
const createMilestoneTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS milestone(memberjid text PRIMARY KEY, achieved json);"
  );
};

export interface GetMilestone {
  memberjid: string;
  name: string;
  achieved: string[];
}

export const getMilestone = async (
  memberjid: string
): Promise<GetMilestone[]> => {
  try {
    const result = await pool.query(
      "SELECT m.memberjid,m.achieved,cmn.name FROM milestone m INNER JOIN countmembername cmn ON m.memberjid=cmn.memberjid WHERE m.memberjid=$1;",
      [memberjid]
    );
    if (result.rowCount) {
      return result.rows;
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestone = async (
  memberjid: string,
  achieved: string[]
): Promise<boolean> => {
  try {
    const achievedJson = JSON.stringify(achieved);
    const res = await pool.query(
      "UPDATE milestone SET achieved=$2 WHERE memberjid=$1;",
      [memberjid, achievedJson]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO milestone VALUES($1,$2);", [
        memberjid,
        achievedJson,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createMilestoneTable();
    return false;
  }
};

// create createCountVideoTable table if not there
const createMilestoneTextTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS milestonetext(sno SERIAL NOT NULL PRIMARY KEY, milestone text);"
  );
};

export interface GetMilestoneText {
  sno: number;
  milestone: string;
}

export const getMilestoneText = async (): Promise<GetMilestoneText[]> => {
  try {
    const result = await pool.query("SELECT * from milestonetext;");
    if (result.rowCount) {
      return result.rows;
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestoneText = async (milestone: string): Promise<boolean> => {
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
