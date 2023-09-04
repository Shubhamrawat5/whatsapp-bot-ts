// import { Voting } from "@prisma/client";
// import { checkGroupjid } from "../../functions/checkValue";
// import { loggerBot } from "../../utils/logger";
// import prisma from "../../prismaClient";

// export const getVoting = async (groupjid: string): Promise<Voting | null> => {
//   try {
//     const voting = await prisma.voting.findUnique({
//       where: {
//         groupjid,
//       },
//     });
//     return voting;
//   } catch (error) {
//     await loggerBot(undefined, "[getVoting DB]", error, { groupjid });
//   }
//   return null;
// };

// export const deleteVoting = async (groupjid: string): Promise<boolean> => {
//   if (!checkGroupjid(groupjid)) return false;

//   try {
//     const voting = await prisma.voting.delete({
//       where: {
//         groupjid,
//       },
//     });

//     if (voting) {
//       return true;
//     }
//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[deleteVoting DB]", error, { groupjid });
//     return false;
//   }
// };

// export const createVoting = async (
//   groupjid: string,
//   is_started: boolean,
//   started_by: string,
//   title: string,
//   choices: string[],
//   count: number[],
//   members_voted_for: string[],
//   voted_members: string[]
// ): Promise<Voting | null> => {
//   // TODO: members_voted_for is 2D string
//   try {
//     const voting = await prisma.voting.create({
//       data: {
//         is_started,
//         started_by,
//         title,
//         choices,
//         count,
//         members_voted_for,
//         voted_members,
//         groupjid,
//       },
//     });
//     return voting;
//   } catch (error) {
//     await loggerBot(undefined, "[createGroup DB]", error, {
//       groupjid,
//       is_started,
//       started_by,
//       title,
//       choices,
//       count,
//       members_voted_for,
//       voted_members,
//     });
//     return null;
//   }
// };

// export const updateVoting = async (
//   groupjid: string,
//   is_started: boolean,
//   started_by: string,
//   title: string,
//   choices: string[],
//   count: number[],
//   members_voted_for: string[],
//   voted_members: string[]
// ): Promise<boolean> => {
//   if (!checkGroupjid(groupjid)) return false;

//   try {
//     const voting = await prisma.voting.update({
//       data: {
//         is_started,
//         started_by,
//         title,
//         choices,
//         count,
//         members_voted_for,
//         voted_members,
//       },
//       where: {
//         groupjid,
//       },
//     });

//     if (!voting) {
//       const res = await createVoting(
//         groupjid,
//         is_started,
//         started_by,
//         title,
//         choices,
//         count,
//         members_voted_for,
//         voted_members
//       );

//       if (!res) return false;
//     }

//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateVoting DB]", error, {
//       groupjid,
//       is_started,
//       started_by,
//       title,
//       choices,
//       count,
//       members_voted_for,
//       voted_members,
//     });
//     return false;
//   }
// };
