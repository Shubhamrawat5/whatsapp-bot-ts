// import { Milestonetext } from "@prisma/client";
// import { loggerBot } from "../../utils/logger";
// import prisma from "../../prismaClient";

// export const getMilestoneTexts = async (): Promise<Milestonetext[]> => {
//   try {
//     const milestonetexts = await prisma.milestonetext.findMany({});

//     return milestonetexts;
//   } catch (error) {
//     await loggerBot(undefined, "[getMilestoneText DB]", error, undefined);
//   }
//   return [];
// };

// export const getMilestoneText = async (
//   milestone: string
// ): Promise<Milestonetext | null> => {
//   try {
//     const milestonetext = await prisma.milestonetext.findUnique({
//       where: {
//         milestone,
//       },
//     });

//     return milestonetext;
//   } catch (error) {
//     await loggerBot(undefined, "[getMilestoneText DB]", error, { milestone });
//   }
//   return null;
// };

// export const createMilestoneText = async (
//   milestone: string
// ): Promise<boolean> => {
//   try {
//     const milestoneaddtext = await getMilestoneText(milestone);

//     if (!milestoneaddtext) {
//       const res = await prisma.milestonetext.create({
//         data: {
//           milestone,
//         },
//       });

//       if (res) {
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[createMilestoneText DB]", error, {
//       milestone,
//     });
//     return false;
//   }
// };
