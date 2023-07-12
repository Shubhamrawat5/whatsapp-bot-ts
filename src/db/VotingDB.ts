import pool from "./pool";

export const createVotingTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS voting(
      groupjid TEXT PRIMARY KEY, 
      is_started BOOLEAN NOT NULL, 
      started_by TEXT NOT NULL, 
      title TEXT NOT NULL, 
      choices JSON NOT NULL,
      count JSON NOT NULL, 
      members_voted_for JSON NOT NULL, 
      voted_members JSON NOT NULL
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
  // check if today date is present in DB or not
  const res = await pool.query("select * from voting where groupjid=$1;", [
    groupjid,
  ]);
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

export const stopVotingData = async (groupjid: string): Promise<boolean> => {
  try {
    const todayDate = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/kolkata",
    });
    const groupjidWithDate = `${groupjid} ${todayDate}`;

    const res = await pool.query(
      "UPDATE voting SET groupjid=$1, is_started=$2 WHERE groupjid=$3;",
      [groupjidWithDate, false, groupjid]
    );

    if (res.rowCount) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
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
  try {
    const choicesJson = JSON.stringify(choices);
    const countJson = JSON.stringify(count);
    const membersVotedForJson = JSON.stringify(members_voted_for);
    const votedMembersJson = JSON.stringify(voted_members);

    const res = await pool.query(
      "UPDATE voting SET is_started=$1, started_by=$2, title=$3, choices=$4, count=$5, members_voted_for=$6, voted_members=$7  WHERE groupjid=$8;",
      [
        is_started,
        started_by,
        title,
        choicesJson,
        countJson,
        membersVotedForJson,
        votedMembersJson,
        groupjid,
      ]
    );
    if (res.rowCount === 0) {
      // insert new
      await pool.query("INSERT INTO voting VALUES($1,$2,$3,$4,$5,$6,$7,$8);", [
        groupjid,
        is_started,
        started_by,
        title,
        choicesJson,
        countJson,
        membersVotedForJson,
        votedMembersJson,
      ]);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
