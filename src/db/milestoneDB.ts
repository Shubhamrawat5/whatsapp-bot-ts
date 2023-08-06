import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createMilestoneTextTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS milestonetext(
      sno SERIAL NOT NULL, 
      milestone TEXT PRIMARY KEY
    );`
  );
};

export interface GetMilestoneText {
  sno: number;
  milestone: string;
}

export const getMilestoneText = async (): Promise<GetMilestoneText[]> => {
  try {
    const res = await pool.query("SELECT * FROM milestonetext;");
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getMilestoneText DB]", error, undefined);
  }
  return [];
};

export const setMilestoneText = async (milestone: string): Promise<boolean> => {
  try {
    const res = await pool.query(
      "INSERT INTO milestonetext(milestone) VALUES($1) ON CONFLICT(milestone) DO NOTHING;",
      [milestone]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[setMilestoneText DB]", error, { milestone });
    return false;
  }
};
