import { checkGroupjid } from "../functions/checkValue";
import { getIndianDateTime } from "../functions/getIndianDateTime";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createVotingTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS voting(
      uuid UUID DEFAULT gen_random_uuid(),
      groupjid TEXT PRIMARY KEY, 
      is_started BOOLEAN NOT NULL, 
      started_by TEXT NOT NULL, 
      title TEXT NOT NULL, 
      choices TEXT[] NOT NULL,
      count TEXT[] NOT NULL, 
      members_voted_for TEXT[][] NOT NULL, 
      voted_members TEXT[] NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export interface GetVotingData {
  groupjid: string;
  is_started: boolean;
  started_by: string;
  title: string;
  choices: string[];
  count: number[];
  members_voted_for: string[][];
  voted_members: string[];
}

export const getVotingData = async (
  groupjid: string
): Promise<GetVotingData[]> => {
  try {
    // check if today date is present in DB or not
    const res = await pool.query("SELECT * FROM voting WHERE groupjid=$1;", [
      groupjid,
    ]);
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getVotingData DB]", error, { groupjid });
  }
  return [];
};

export const stopVotingData = async (groupjid: string): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;

  try {
    const todayDate = getIndianDateTime();
    const groupjidWithDate = `${groupjid} ${todayDate}`;

    const res = await pool.query(
      "UPDATE voting SET groupjid=$1, is_started=$2, updated_at = NOW() WHERE groupjid=$3;",
      [groupjidWithDate, false, groupjid]
    );

    if (res.rowCount) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[stopVotingData DB]", error, { groupjid });
    return false;
  }
};

export const setVotingData = async (
  groupjid: string,
  is_started: boolean,
  started_by: string,
  title: string,
  choices: string[],
  count: number[],
  members_voted_for: string[][],
  voted_members: string[]
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE voting SET is_started=$1, started_by=$2, title=$3, choices=$4, count=$5, members_voted_for=$6, voted_members=$7  WHERE groupjid=$8;",
      [
        is_started,
        started_by,
        title,
        choices,
        count,
        members_voted_for,
        voted_members,
        groupjid,
      ]
    );
    if (res.rowCount === 0) {
      // insert new
      const res2 = await pool.query(
        "INSERT INTO voting (groupjid, is_started, started_by, title, choices, count, members_voted_for, voted_members) VALUES($1,$2,$3,$4,$5,$6,$7,$8);",
        [
          groupjid,
          is_started,
          started_by,
          title,
          choices,
          count,
          members_voted_for,
          voted_members,
        ]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setVotingData DB]", error, {
      groupjid,
      is_started,
      started_by,
      title,
      choices,
      count,
      members_voted_for,
      voted_members,
    });
    return false;
  }
};
