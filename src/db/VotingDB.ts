import pool from "./pool";

export const createVotingTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS voting(chat_id text PRIMARY KEY, is_started Boolean, started_by text, title text, choices json, count json, membersVotedFor json, votedMembers json);"
  );
};

export interface GetVotingData {
  chat_id: string;
  is_started: boolean;
  started_by: string;
  title: string;
  choices: string[];
  count: number[];
  membersVotedFor: string[][];
  votedMembers: string[];
}

export const getVotingData = async (
  groupjid: string
): Promise<GetVotingData[]> => {
  await createVotingTable();

  // check if today date is present in DB or not
  const result = await pool.query("select * from voting where chat_id=$1;", [
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
  membersVotedFor: string,
  votedMembers: string
): Promise<boolean> => {
  try {
    await pool.query(
      "UPDATE voting SET is_started=$1, started_by=$2, title=$3, choices=$4, count=$5, membersVotedFor=$6, votedMembers=$7  WHERE chat_id=$8;",
      [
        is_started,
        started_by,
        title,
        choices,
        count,
        membersVotedFor,
        votedMembers,
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
      "UPDATE voting SET chat_id=$1, is_started=$2 WHERE chat_id=$3;",
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
  membersVotedFor: string[][],
  votedMembers: string[]
): Promise<boolean> => {
  try {
    const choicesJson = JSON.stringify(choices);
    const countJson = JSON.stringify(count);
    const membersVotedForJson = JSON.stringify(membersVotedFor);
    const votedMembersJson = JSON.stringify(votedMembers);

    const result = await pool.query("SELECT * FROM voting WHERE chat_id=$1", [
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
