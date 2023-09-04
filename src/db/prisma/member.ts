// import { Member } from "@prisma/client";
// import { checkMemberjid } from "../../functions/checkValue";
// import { loggerBot } from "../../utils/logger";
// import prisma from "../../prismaClient";

// export const getMembers = async (): Promise<Member[]> => {
//   try {
//     const members = await prisma.member.findMany();
//     return members;
//   } catch (error) {
//     await loggerBot(undefined, "[getMembers DB]", error, undefined);
//   }
//   return [];
// };

// export const getMember = async (memberjid: string): Promise<Member | null> => {
//   try {
//     const member = await prisma.member.findUnique({
//       where: {
//         memberjid,
//       },
//     });

//     return member;
//   } catch (error) {
//     await loggerBot(undefined, "[getMember DB]", error, { memberjid });
//   }
//   return null;
// };

// export const createMember = async (
//   memberjid: string,
//   name: string,
//   donation: number,
//   milestones: string[]
// ): Promise<Member | null> => {
//   try {
//     const member = await prisma.member.create({
//       data: {
//         memberjid,
//         name,
//         donation,
//         milestones,
//       },
//     });

//     return member;
//   } catch (error) {
//     await loggerBot(undefined, "[createMember DB]", error, {
//       memberjid,
//       name,
//       donation,
//       milestones,
//     });
//     return null;
//   }
// };

// export const updateMemberName = async (
//   memberjid: string,
//   name: string
// ): Promise<boolean> => {
//   if (!checkMemberjid(memberjid)) return false;

//   try {
//     const member = await prisma.member.update({
//       data: {
//         name,
//       },
//       where: {
//         memberjid,
//       },
//     });

//     if (!member) {
//       const res = await createMember(memberjid, name, 0, []);
//       if (!res) {
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateMemberName DB]", error, {
//       name,
//       memberjid,
//     });
//     return false;
//   }
// };

// // export interface GetUsernames {
// //   [key: string]: string;
// // }

// // // get usesrnames
// // export const getUsernames = async (
// //   memberjidArray: string[]
// // ): Promise<GetUsernames[]> => {
// //   try {
// //     const res = await pool.query(
// //       "SELECT * FROM members WHERE memberjid = ANY($1::TEXT[])",
// //       [memberjidArray]
// //     );
// //     if (res.rowCount) {
// //       return res.rows;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getUsernames DB]", error, { memberjidArray });
// //   }
// //   return [];
// // };

// /* -------------------------------- DONATIONS ------------------------------- */
// export const getMemberDonations = async (): Promise<Member[]> => {
//   try {
//     const members = await prisma.member.findMany({
//       where: {
//         donation: {
//           gt: 0,
//         },
//       },
//       orderBy: {
//         donation: "desc",
//       },
//     });

//     return members;
//   } catch (error) {
//     await loggerBot(undefined, "[getMemberDonations DB]", error, undefined);
//   }
//   return [];
// };

// export const updateMemberDonation = async (
//   memberjid: string,
//   name: string,
//   donation: number
// ): Promise<boolean> => {
//   if (!checkMemberjid(memberjid)) return false;

//   try {
//     const member = await prisma.member.update({
//       data: {
//         donation,
//       },
//       where: {
//         memberjid,
//       },
//     });

//     if (!member) {
//       const res = await createMember(memberjid, name, donation, []);
//       if (!res) {
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateMemberDonation DB]", error, {
//       memberjid,
//       name,
//       donation,
//     });
//     return false;
//   }
// };

// /* -------------------------------- MILESTONE ------------------------------- */
// export const getMemberMilestone = async (
//   memberjid: string
// ): Promise<Member | null> => {
//   try {
//     const members = await prisma.member.findUnique({
//       where: {
//         memberjid,
//       },
//     });

//     return members;
//   } catch (error) {
//     await loggerBot(undefined, "[getMemberMilestone DB]", error, { memberjid });
//   }
//   return null;
// };

// export const updateMemberMilestone = async (
//   memberjid: string,
//   name: string,
//   milestones: string[]
// ): Promise<boolean> => {
//   if (!checkMemberjid(memberjid)) return false;

//   try {
//     const member = await prisma.member.update({
//       data: {
//         milestones,
//       },
//       where: {
//         memberjid,
//       },
//     });

//     if (!member) {
//       const res = await createMember(memberjid, name, 0, milestones);
//       if (!res) {
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateMemberMilestone DB]", error, {
//       memberjid,
//       name,
//       milestones,
//     });
//     return false;
//   }
// };
