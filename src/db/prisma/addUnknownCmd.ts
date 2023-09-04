// import { Unknowncmd } from "@prisma/client";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";

// export const getUnknownCmds = async (): Promise<Unknowncmd[]> => {
//   try {
//     const unknowncmds = await prisma.unknowncmd.findMany({
//       orderBy: { count: "desc" },
//     });

//     return unknowncmds;
//   } catch (error) {
//     await loggerBot(undefined, "[getUnknownCmds DB]", error, undefined);
//     return [];
//   }
// };

// export const getUnknownCmd = async (
//   command: string
// ): Promise<Unknowncmd | null> => {
//   try {
//     const unknowncmd = await prisma.unknowncmd.findUnique({
//       where: {
//         command,
//       },
//     });

//     return unknowncmd;
//   } catch (error) {
//     await loggerBot(undefined, "[getUnknownCmd DB]", error, { command });
//     return null;
//   }
// };

// export const createUnknownCmd = async (
//   command: string
// ): Promise<Unknowncmd | null> => {
//   try {
//     const unknowncmd = await prisma.unknowncmd.create({
//       data: {
//         command,
//         count: 1,
//       },
//     });
//     return unknowncmd;
//   } catch (error) {
//     await loggerBot(undefined, "[createUnknownCmd DB]", error, {
//       command,
//     });
//     return null;
//   }
// };

// export const updateUnknownCmd = async (command: string): Promise<boolean> => {
//   try {
//     const unknowncmd = await prisma.unknowncmd.update({
//       data: {
//         count: {
//           increment: 1,
//         },
//       },
//       where: { command },
//     });

//     if (!unknowncmd) {
//       const res = await createUnknownCmd(command);

//       if (!res) {
//         return false;
//       }
//     }

//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateUnknownCmd DB]", error, { command });
//     return false;
//   }
// };
