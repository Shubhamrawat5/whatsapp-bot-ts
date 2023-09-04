// import { Meta } from "@prisma/client";
// import { loggerBot } from "../../utils/logger";
// import prisma from "../../prismaClient";

// export const getMetas = async (): Promise<Meta[]> => {
//   try {
//     const meta = await prisma.meta.findMany();

//     return meta;
//   } catch (error) {
//     await loggerBot(undefined, "[getMetas DB]", error, undefined);
//   }
//   return [];
// };

// export const getMeta = async (variable: string): Promise<Meta | null> => {
//   try {
//     const meta = await prisma.meta.findUnique({
//       where: {
//         variable,
//       },
//     });

//     return meta;
//   } catch (error) {
//     await loggerBot(undefined, "[getMeta DB]", error, { variable });
//   }
//   return null;
// };

// export const createMeta = async (
//   variable: string,
//   value: boolean
// ): Promise<Meta | null> => {
//   try {
//     const meta = await prisma.meta.create({
//       data: {
//         variable,
//         value,
//         last_updated: new Date(),
//       },
//     });

//     return meta;
//   } catch (error) {
//     await loggerBot(undefined, "[createMeta DB]", error, {
//       variable,
//       value,
//     });
//     return null;
//   }
// };

// export const updateMeta = async (
//   variable: string,
//   value: boolean
// ): Promise<boolean> => {
//   try {
//     const meta = await prisma.meta.update({
//       data: {
//         value,
//         last_updated: new Date(),
//       },
//       where: {
//         variable,
//       },
//     });

//     if (!meta) {
//       const res = await createMeta(variable, value);
//       if (!res) return false;
//     }

//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateMeta DB]", error, {
//       variable,
//       value,
//     });
//     return false;
//   }
// };
