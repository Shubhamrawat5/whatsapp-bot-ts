// import { Group } from "@prisma/client";
// import { checkGroupjid } from "../../functions/checkValue";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";

// export const getGroups = async (): Promise<Group[]> => {
//   try {
//     const groups = await prisma.group.findMany();
//     return groups;
//   } catch (error) {
//     await loggerBot(undefined, "[getGroups DB]", error, undefined);
//   }
//   return [];
// };

// export const getGroup = async (groupjid: string): Promise<Group | null> => {
//   try {
//     const group = await prisma.group.findUnique({
//       where: {
//         groupjid,
//       },
//     });

//     return group;
//   } catch (error) {
//     await loggerBot(undefined, "[getGroup DB]", error, { groupjid });
//   }
//   return null;
// };

// export const createGroup = async (
//   groupjid: string,
//   gname: string,
//   link: string | null,
//   commands_disabled: string[]
// ): Promise<Group | null> => {
//   try {
//     const group = await prisma.group.create({
//       data: {
//         gname,
//         link,
//         groupjid,
//         commands_disabled,
//       },
//     });
//     return group;
//   } catch (error) {
//     await loggerBot(undefined, "[createGroup DB]", error, {
//       groupjid,
//       gname,
//       link,
//     });
//     return null;
//   }
// };

// export const updateGroupNameAndLink = async (
//   groupjid: string,
//   gname: string,
//   link: string | null
// ): Promise<boolean> => {
//   if (!checkGroupjid(groupjid)) return false;

//   try {
//     const group = await prisma.group.update({
//       data: {
//         gname,
//         link,
//       },
//       where: {
//         groupjid,
//       },
//     });

//     if (!group) {
//       const res = await createGroup(groupjid, gname, link, []);
//       if (!res) {
//         return false;
//       }
//     }

//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateGroupNameAndLink DB]", error, {
//       groupjid,
//       gname,
//       link,
//     });
//     return false;
//   }
// };

// export const updateGroupDisabledCommand = async (
//   groupjid: string,
//   gname: string,
//   commands_disabled: string[]
// ): Promise<boolean> => {
//   if (!checkGroupjid(groupjid)) return false;

//   try {
//     const group = await prisma.group.update({
//       data: {
//         commands_disabled,
//       },
//       where: {
//         groupjid,
//       },
//     });

//     if (!group) {
//       const res = await createGroup(groupjid, gname, null, []);
//       if (!res) {
//         return false;
//       }
//     }
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateGroupDisabledCommand DB]", error, {
//       groupjid,
//       gname,
//       commands_disabled,
//     });
//     return false;
//   }
// };
