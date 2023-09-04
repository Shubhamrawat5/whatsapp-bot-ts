// import { Countmember, Member } from "@prisma/client";
// // import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
// import prisma from "./prismaClient";
// import { loggerBot } from "../../utils/logger";
// // import { setMemberName } from "./membersDB";
// // import pool from "./pool";

// export const createCountMember = async (
//   groupjid: string,
//   memberjid: string,
//   message_count: number,
//   warning_count: number,
//   video_count: number
// ): Promise<Countmember | null> => {
//   try {
//     const countmember = await prisma.countmember.create({
//       data: {
//         groupGroupjid: groupjid,
//         memberMemberjid: memberjid,
//         message_count,
//         warning_count,
//         video_count,
//       },
//     });

//     return countmember;
//   } catch (error) {
//     await loggerBot(undefined, "[createCountMember DB]", error, {
//       groupjid,
//       memberjid,
//       message_count,
//       warning_count,
//       video_count,
//     });
//     return null;
//   }
// };

// // pvxm: current group member stats
// export const getCountGroupMembers = async (
//   groupjid: string
// ): Promise<(Countmember & { Member: Member })[]> => {
//   try {
//     const res = await prisma.countmember.findMany({
//       where: {
//         groupGroupjid: groupjid,
//       },
//       include: { Member: true },
//       orderBy: {
//         message_count: "desc",
//       },
//     });

//     return res;
//   } catch (error) {
//     await loggerBot(undefined, "[getCountGroupMembers DB]", error, {
//       groupjid,
//     });
//   }
//   return [];
// };

// // export interface GetCountIndividual {
// //   message_count: number;
// //   name: string;
// // }

// // // rank count: user current group total messsage count
// // export const getCountIndividual = async (
// //   memberjid: string,
// //   groupjid: string
// // ): Promise<GetCountIndividual[]> => {
// //   try {
// //     const res = await pool.query(
// //       "SELECT memb.name,cm.message_count FROM members memb INNER JOIN countmember cm ON memb.memberjid=cm.memberjid WHERE cm.memberjid=$1 AND cm.groupjid=$2;",
// //       [memberjid, groupjid]
// //     );
// //     if (res.rowCount) {
// //       return res.rows;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountIndividual DB]", error, {
// //       memberjid,
// //       groupjid,
// //     });
// //   }
// //   return [];
// // };

// // export interface GetRankInAllGroups {
// //   name: string;
// //   messageCount: number;
// //   ranks: number;
// //   totalUsers: number;
// // }

// // // rank: rank in all groups message count
// // export const getRankInAllGroups = async (
// //   memberjid: string
// // ): Promise<GetRankInAllGroups[]> => {
// //   try {
// //     const res = await pool.query(
// //       "SELECT memb.name,table1.message_count,table1.memberjid,table1.ranks from (SELECT memberjid,sum(message_count) as message_count,RANK () OVER (ORDER BY sum(message_count) DESC) ranks FROM countmember GROUP BY memberjid ) table1 INNER JOIN members memb on table1.memberjid = memb.memberjid WHERE table1.memberjid=$1;",
// //       [memberjid]
// //     );

// //     const res2 = await pool.query(
// //       "SELECT count(*) from (SELECT memberjid,count(*) from countmember GROUP BY memberjid) table1;"
// //     );

// //     const resultObj: GetRankInAllGroups = {
// //       name: "",
// //       messageCount: 0,
// //       ranks: 0,
// //       totalUsers: 0,
// //     };
// //     if (res.rowCount) {
// //       resultObj.name = res.rows[0].name;
// //       resultObj.messageCount = res.rows[0].message_count;
// //       resultObj.ranks = res.rows[0].ranks;
// //       resultObj.totalUsers = res2.rows[0].count;
// //       return [resultObj];
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getRankInAllGroups DB]", error, { memberjid });
// //   }
// //   return [];
// // };

// // export interface GetCountIndividualAllGroup {
// //   name: string;
// //   gname: string;
// //   message_count: number;
// // }

// // // count: user all group (with group wise) message count
// // export const getCountIndividualAllGroup = async (
// //   memberjid: string
// // ): Promise<GetCountIndividualAllGroup[]> => {
// //   try {
// //     const res = await pool.query(
// //       "SELECT memb.name,grps.gname,cm.message_count FROM countmember cm LEFT JOIN members memb ON memb.memberjid=cm.memberjid INNER JOIN groups grps ON grps.groupjid=cm.groupjid WHERE cm.memberjid=$1 ORDER BY message_count DESC;",
// //       [memberjid]
// //     );
// //     if (res.rowCount) {
// //       return res.rows;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountIndividualAllGroup DB]", error, {
// //       memberjid,
// //     });
// //   }
// //   return [];
// // };

// // export interface GetCountTop {
// //   name: string;
// //   memberjid: string;
// //   message_count: number;
// // }

// // // pvxt: top members stats of all groups
// // export const getCountTop = async (
// //   noOfResult: number
// // ): Promise<GetCountTop[]> => {
// //   try {
// //     const res = await pool.query(
// //       `SELECT members.name,countmember.memberjid,sum(countmember.message_count) as message_count FROM countmember LEFT JOIN members ON countmember.memberjid=members.memberjid GROUP BY countmember.memberjid,members.name ORDER BY message_count DESC LIMIT ${noOfResult};`
// //     );
// //     if (res.rowCount) {
// //       return res.rows;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountTop DB]", error, { noOfResult });
// //   }
// //   return [];
// // };

// // export interface GetCountTop5 {
// //   gname: string;
// //   name: string;
// //   message_count: number;
// // }

// // // pvxt5: top members stats of all groups
// // export const getCountTop5 = async (): Promise<GetCountTop5[]> => {
// //   try {
// //     const res = await pool.query(
// //       "SELECT groups.gname,members.name,rs.message_count FROM (SELECT groupjid,memberjid,message_count, Rank() over (Partition BY groupjid ORDER BY message_count DESC ) AS Rank FROM countmember) rs INNER JOIN groups on rs.groupjid=groups.groupjid INNER JOIN members ON rs.memberjid=members.memberjid WHERE Rank <= 5;"
// //     );
// //     if (res.rowCount) {
// //       return res.rows;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountTop5 DB]", error, undefined);
// //   }
// //   return [];
// // };

// // export interface GetCountGroups {
// //   gname: string;
// //   message_count: number;
// // }

// // // pvxg: all groups stats
// // export const getCountGroups = async (): Promise<
// //   (Countmember & { Group: Group })[]
// // > => {
// //   try {
// //     const res = await prisma.countmember.groupBy({
// //       by: ["groupGroupjid"],
// //       _sum: {
// //         message_count: true,
// //       },
// //     });

// //     // const res = await pool.query(
// //     //   "SELECT groups.gname,SUM(countmember.message_count) as message_count from countmember INNER JOIN groups ON countmember.groupjid = groups.groupjid GROUP BY groups.gname ORDER BY message_count DESC;"
// //     // );
// //     return res;
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountGroups DB]", error, undefined);
// //   }
// //   return [];
// // };

// // export interface SetCountMember {
// //   currentGroup: number;
// //   allGroup: number;
// // }

// // export const setCountMember = async (
// //   memberjid: string,
// //   groupjid: string,
// //   name: string | undefined | null
// // ): Promise<SetCountMember> => {
// //   const result = { currentGroup: 1, allGroup: 1 };
// //   if (!checkGroupjid(groupjid)) return result;
// //   if (!checkMemberjid(memberjid)) return result;

// //   try {
// //     // update username of member
// //     await setMemberName(name, memberjid);

// //     // update count
// //     const res1 = await pool.query(
// //       "UPDATE countmember SET message_count = message_count+1 WHERE memberjid=$1 AND groupjid=$2 RETURNING *;",
// //       [memberjid, groupjid]
// //     );

// //     if (res1.rowCount === 0) {
// //       await pool.query(
// //         "INSERT INTO countmember VALUES($1,$2,$3,$4,$5) RETURNING *;",
// //         [memberjid, groupjid, 1, 0, 0]
// //       );
// //     } else {
// //       result.currentGroup = res1.rows[0].message_count;
// //     }

// //     // get current group and all group message count
// //     const res2 = await pool.query(
// //       "SELECT sum(message_count) as message_count, memberjid FROM countmember GROUP BY memberjid HAVING memberjid=$1;",
// //       [memberjid]
// //     );

// //     if (res2.rowCount !== 0) {
// //       result.allGroup = res2.rows[0].message_count;
// //     }
// //   } catch (error) {
// //     await loggerBot(undefined, "[setCountMember DB]", error, {
// //       memberjid,
// //       groupjid,
// //       name,
// //     });
// //   }

// //   return result;
// // };

// // /* ------------------------------- video count ------------------------------ */
// // export interface GetCountVideo {
// //   memberjid: string;
// //   video_count: number;
// //   name: string;
// // }

// // export const getCountVideo = async (
// //   groupjid: string
// // ): Promise<(Countmember & { Member: Member })[]> => {
// //   try {
// //     const res = await prisma.countmember.findMany({
// //       where: {
// //         groupGroupjid: groupjid,
// //       },
// //       include: { Member: true },
// //       orderBy: {
// //         video_count: "desc",
// //       },
// //     });

// //     return res;
// //   } catch (error) {
// //     await loggerBot(undefined, "[getCountVideo DB]", error, { groupjid });
// //   }
// //   return [];
// // };

// // export const setCountVideo = async (
// //   memberjid: string,
// //   groupjid: string
// // ): Promise<boolean> => {
// //   if (!checkGroupjid(groupjid)) return false;
// //   if (!checkMemberjid(memberjid)) return false;

// //   try {
// //     const countmember = await prisma.countmember.update({
// //       data: {
// //         video_count: {
// //           increment: 1,
// //         },
// //       },
// //       where: {
// //         memberMemberjid_groupGroupjid: {
// //           memberMemberjid: memberjid,
// //           groupGroupjid: groupjid,
// //         },
// //       },
// //     });

// //     if (!countmember) {
// //       const res = await createCountMember(groupjid, memberjid, 0, 0, 1);
// //       if (!res) {
// //         return false;
// //       }
// //     }

// //     return true;
// //   } catch (error) {
// //     await loggerBot(undefined, "[setCountVideo DB]", error, {
// //       memberjid,
// //       groupjid,
// //     });
// //     return false;
// //   }
// // };
