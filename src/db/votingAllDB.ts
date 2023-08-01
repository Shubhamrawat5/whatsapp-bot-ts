// import pool from "./pool";

// export const createVotingAllTable = async () => {
//   await pool.query(
//     "CREATE TABLE IF NOT EXISTS votingall(groupjid text PRIMARY KEY, is_started Boolean,
// started_by text, title text, choices json, count json,
// members_voted_for json, voted_members json);"
//   );
// };
// export interface GetVotingAllData {
//   groupjid: string;
//   is_started: boolean;
//   started_by: string;
//   title: string;
//   choices: string[];
//   count: number[];
//   members_voted_for: string[][];
//   voted_members: string[];
// }

// export const getVotingAllData = async (
//   groupjid: string
// ): Promise<GetVotingAllData[]> => {
//   // check if today date is present in DB or not
//   const result = await pool.query(
//     "SELECT * FROM votingall WHERE groupjid=$1;",
//     [groupjid]
//   );
//   if (result.rowCount) {
//     return result.rows;
//   }
//   return [];
// };

// const updateVotingAllData = async (
//   groupjid: string,
//   is_started: boolean,
//   started_by: string,
//   title: string,
//   choices: string,
//   count: string,
//   members_voted_for: string,
//   voted_members: string
// ): Promise<boolean> => {
//   try {
//     await pool.query(
//       "UPDATE votingall SET is_started=$1, started_by=$2, title=$3,
// choices=$4, count=$5, members_voted_for=$6, voted_members=$7  WHERE groupjid=$8;",
//       [
//         is_started,
//         started_by,
//         title,
//         choices,
//         count,
//         members_voted_for,
//         voted_members,
//         groupjid,
//       ]
//     );
//     return true;
//   } catch (error) {
//     console.log(error);
//     await createVotingAllTable();
//     return false;
//   }
// };

// export const stopVotingAllData = async (groupjid: string): Promise<boolean> => {
//   try {
//     const todayDate = new Date().toLocaleString("en-GB", {
//       timeZone: "Asia/kolkata",
//     });
//     const groupjidWithDate = `${groupjid} ${todayDate}`;

//     await pool.query(
//       "UPDATE votingall SET groupjid=$1, is_started=$2 WHERE groupjid=$3;",
//       [groupjidWithDate, false, groupjid]
//     );
//     return true;
//   } catch (error) {
//     console.log(error);
//     await createVotingAllTable();
//     return false;
//   }
// };

// export const setVotingAllData = async (
//   groupjid: string,
//   is_started: boolean,
//   started_by: string,
//   title: string,
//   choices: string[],
//   count: number[],
//   members_voted_for: string[][],
//   voted_members: string[]
// ): Promise<boolean> => {
//   try {
//     const choicesJson = JSON.stringify(choices);
//     const countJson = JSON.stringify(count);
//     const membersVotedForJson = JSON.stringify(members_voted_for);
//     const votedMembersJson = JSON.stringify(voted_members);

//     const result = await pool.query(
//       "SELECT * FROM votingall WHERE groupjid=$1",
//       [groupjid]
//     );
//     if (result.rows.length) {
//       // already present
//       await updateVotingAllData(
//         groupjid,
//         is_started,
//         started_by,
//         title,
//         choicesJson,
//         countJson,
//         membersVotedForJson,
//         votedMembersJson
//       );
//     } else {
//       // insert new
//       await pool.query(
//         "INSERT INTO votingall VALUES($1,$2,$3,$4,$5,$6,$7,$8);",
//         [
//           groupjid,
//           is_started,
//           started_by,
//           title,
//           choicesJson,
//           countJson,
//           membersVotedForJson,
//           votedMembersJson,
//         ]
//       );
//     }
//     return true;
//   } catch (error) {
//     console.log(error);
//     await createVotingAllTable();
//     return false;
//   }
// };
