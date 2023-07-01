import pool from "./pool";

export const createVotingTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS voting(groupjid text PRIMARY KEY, is_started Boolean NOT NULL, started_by text NOT NULL, title text NOT NULL, choices json NOT NULL, count json NOT NULL, members_voted_for json NOT NULL, voted_members json NOT NULL);"
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
  await createVotingTable();

  // check if today date is present in DB or not
  const result = await pool.query("select * from voting where groupjid=$1;", [
    groupjid,
  ]);
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

const updateVotingData = async (
  groupjid: string,
  is_started: boolean,
  started_by: string,
  title: string,
  choices: string,
  count: string,
  members_voted_for: string,
  voted_members: string
): Promise<boolean> => {
  try {
    await pool.query(
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
    return true;
  } catch (error) {
    console.log(error);
    await createVotingTable();
    return false;
  }
};

export const stopVotingData = async (groupjid: string): Promise<boolean> => {
  try {
    const todayDate = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/kolkata",
    });
    const groupjidWithDate = `${groupjid} ${todayDate}`;

    await pool.query(
      "UPDATE voting SET groupjid=$1, is_started=$2 WHERE groupjid=$3;",
      [groupjidWithDate, false, groupjid]
    );
    return true;
  } catch (error) {
    console.log(error);
    await createVotingTable();
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

    const result = await pool.query("SELECT * FROM voting WHERE groupjid=$1", [
      groupjid,
    ]);
    if (result.rows.length) {
      // already present
      await updateVotingData(
        groupjid,
        is_started,
        started_by,
        title,
        choicesJson,
        countJson,
        membersVotedForJson,
        votedMembersJson
      );
    } else {
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
    await createVotingTable();
    return false;
  }
};
