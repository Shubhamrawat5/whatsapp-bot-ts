// import { Blacklist, Member } from "@prisma/client";
// import { checkMemberjid } from "../../functions/checkValue";
// import { loggerBot } from "../../utils/logger";
// import prisma from "../../prismaClient";

// export const getBlacklists = async (): Promise<
//   ({ Member: Member } & Blacklist)[]
// > => {
//   try {
//     const blacklists = await prisma.blacklist.findMany({
//       include: {
//         Member: true,
//       },
//     });

//     return blacklists;
//   } catch (error) {
//     await loggerBot(undefined, "[getBlacklists DB]", error, undefined);
//     return [];
//   }
// };

// export const getBlacklist = async (
//   memberjid: string
// ): Promise<({ Member: Member } & Blacklist) | null> => {
//   try {
//     const blacklist = await prisma.blacklist.findUnique({
//       where: { memberMemberjid: memberjid },
//       include: {
//         Member: true,
//       },
//     });

//     return blacklist;
//   } catch (error) {
//     await loggerBot(undefined, "[getBlacklist DB]", error, { memberjid });
//     return null;
//   }
// };

// export const createBlacklist = async (
//   memberjid: string,
//   reason: string,
//   admin: string
// ): Promise<boolean> => {
//   if (!checkMemberjid(memberjid)) return false;

//   try {
//     const blacklist = await getBlacklist(memberjid);

//     if (!blacklist) {
//       // TODO: create member data
//     }
//     const res = await prisma.blacklist.create({
//       data: {
//         memberMemberjid: memberjid,
//         reason,
//         admin,
//       },
//     });

//     if (res) return true;

//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[createBlacklist DB]", error, {
//       memberjid,
//       reason,
//       admin,
//     });
//     return false;
//   }
// };

// export const deleteBlacklist = async (memberjid: string): Promise<boolean> => {
//   try {
//     const blacklist = await prisma.blacklist.delete({
//       where: { memberMemberjid: memberjid },
//     });

//     if (blacklist) {
//       return true;
//     }
//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[deleteBlacklist DB]", error, { memberjid });
//     return false;
//   }
// };
