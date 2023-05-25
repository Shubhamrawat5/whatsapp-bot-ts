import { pool } from "./pool";

const createVotingTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS voting(chat_id text PRIMARY KEY, is_started Boolean, started_by text, title text, choices json, count json, members_voted_for json, voted_members json);"
  );
};

export interface GetVotingData {
  chat_id: string;
  is_started: boolean;
  started_by: string;
  title: string;
  choices: any;
  count: any;
  members_voted_for: any;
  voted_members: any;
}

export const getVotingData = async (
  groupjid: string
): Promise<GetVotingData[]> => {
  await createVotingTable();

  //check if today date is present in DB or not
  let result = await pool.query("select * from voting where chat_id=$1;", [
    groupjid,
  ]);
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

const updateVotingData = async (
  groupjid: string,
  is_started: boolean,
  started_by: string,
  title: string,
  choices: any,
  count: any,
  members_voted_for: any,
  voted_members: any
): Promise<boolean> => {
  try {
    await pool.query(
      "UPDATE voting SET is_started=$1, started_by=$2, title=$3, choices=$4, count=$5, members_voted_for=$6, voted_members=$7  WHERE chat_id=$8;",
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
    let todayDate = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/kolkata",
    });
    let new_chat_id = groupjid + " " + todayDate;

    await pool.query(
      "UPDATE voting SET chat_id=$1, is_started=$2 WHERE chat_id=$3;",
      [new_chat_id, false, groupjid]
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
  choices: any,
  count: any,
  members_voted_for: any,
  voted_members: any
): Promise<boolean> => {
  try {
    choices = JSON.stringify(choices);
    count = JSON.stringify(count);
    members_voted_for = JSON.stringify(members_voted_for);
    voted_members = JSON.stringify(voted_members);
    let result = await pool.query("SELECT * FROM voting WHERE chat_id=$1", [
      groupjid,
    ]);
    if (result.rows.length) {
      //already present
      await updateVotingData(
        groupjid,
        is_started,
        started_by,
        title,
        choices,
        count,
        members_voted_for,
        voted_members
      );
    } else {
      //insert new
      await pool.query("INSERT INTO voting VALUES($1,$2,$3,$4,$5,$6,$7,$8);", [
        groupjid,
        is_started,
        started_by,
        title,
        choices,
        count,
        members_voted_for,
        voted_members,
      ]);
    }
    return true;
  } catch (error) {
    console.log(error);
    await createVotingTable();
    return false;
  }
};
