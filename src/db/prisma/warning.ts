// import { Countmember, Member } from "@prisma/client";
// import { checkGroupjid, checkMemberjid } from "../../functions/checkValue";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";
// import { createCountMember } from "./countMember";

// // warninglistall
// export const getCountWarningAllGroup = async (): Promise<
//   GetCountWarningAllGroup[]
// > => {
//   try {
//     const res = await pool.query(
//       "SELECT countmember.memberjid, sum(countmember.warning_count) as warning_count, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid WHERE warning_count>0 GROUP BY countmember.memberjid,members.name ORDER BY warning_count DESC;"
//     );
//     if (res.rowCount) {
//       return res.rows;
//     }
//   } catch (error) {
//     await loggerBot(
//       undefined,
//       "[getCountWarningAllGroup DB]",
//       error,
//       undefined
//     );
//     return [];
//   }
// };

// // warninglist
// export const getCountWarningAll = async (
//   groupjid: string
// ): Promise<(Countmember & { Member: Member })[]> => {
//   try {
//     const res = await prisma.countmember.findMany({
//       where: {
//         groupGroupjid: groupjid,
//         warning_count: {
//           gt: 0,
//         },
//       },
//       orderBy: {
//         warning_count: "desc",
//       },
//       include: {
//         Member: true,
//       },
//     });

//     return res;
//   } catch (error) {
//     await loggerBot(undefined, "[getCountWarningAll DB]", error, { groupjid });
//     return [];
//   }
// };

// // warncheck
// export const getGroupMemberWarning = async (
//   memberjid: string,
//   groupjid: string
// ): Promise<Countmember | null> => {
//   try {
//     const countmember = await prisma.countmember.findUnique({
//       where: {
//         memberMemberjid_groupGroupjid: {
//           memberMemberjid: memberjid,
//           groupGroupjid: groupjid,
//         },
//       },
//     });

//     return countmember;
//   } catch (error) {
//     await loggerBot(undefined, "[getGroupMemberWarning DB]", error, {
//       memberjid,
//       groupjid,
//     });
//     return null;
//   }
// };

// export const updateGroupMemberWarning = async (
//   groupjid: string,
//   memberjid: string,
//   warning_count: number
// ): Promise<boolean> => {
//   if (!checkGroupjid(groupjid)) return false;
//   if (!checkMemberjid(memberjid)) return false;

//   try {
//     const countmember = await prisma.countmember.update({
//       data: {
//         warning_count,
//       },
//       where: {
//         memberMemberjid_groupGroupjid: {
//           memberMemberjid: memberjid,
//           groupGroupjid: groupjid,
//         },
//       },
//     });

//     if (!countmember) {
//       const res = await createCountMember(
//         groupjid,
//         memberjid,
//         0,
//         warning_count,
//         0
//       );
//       if (!res) {
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateGroupMemberWarning DB]", error, {
//       memberjid,
//       groupjid,
//     });
//     return false;
//   }
// };
