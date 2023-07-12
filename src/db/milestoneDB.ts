import pool from "./pool";

export const createMilestoneTextTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS milestonetext(
      sno SERIAL PRIMARY KEY, 
      milestone TEXT
    );`
  );
};

export interface GetMilestoneText {
  sno: number;
  milestone: string;
}

export const getMilestoneText = async (): Promise<GetMilestoneText[]> => {
  try {
    const res = await pool.query("SELECT * from milestonetext;");
    if (res.rowCount) {
      return res.rows;
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const setMilestoneText = async (milestone: string): Promise<boolean> => {
  try {
    const res = await pool.query(
      "INSERT INTO milestonetext(milestone) VALUES($1);",
      [milestone]
    );

    if (res.rowCount === 1) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    // TODO: SEND ERROR LOGS
    return false;
  }
};
