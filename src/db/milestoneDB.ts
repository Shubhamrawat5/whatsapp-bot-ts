import pool from "./pool";

// export const createMilestoneTable = async () => {
//   await pool.query(
//     `CREATE TABLE IF NOT EXISTS milestone(
//       memberjid TEXT PRIMARY KEY,
//       achieved JSON
//     );`
//   );
// };

// create createCountVideoTable table if not there
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
