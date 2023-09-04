// /* eslint-disable no-param-reassign */
// import { Bday } from "@prisma/client";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";

// export const getbdays = async (): Promise<Bday[]> => {
//   try {
//     const bdays = await prisma.bday.findMany({ orderBy: { month: "asc" } });

//     return bdays;
//   } catch (error) {
//     await loggerBot(undefined, "[getbdays DB]", error, undefined);
//   }
//   return [];
// };

// export const createBday = async (
//   name: string,
//   username: string,
//   date: number,
//   month: number,
//   year: number | null,
//   place: string,
//   number: string
// ): Promise<Bday | null> => {
//   try {
//     const bday = await prisma.bday.create({
//       data: {
//         name,
//         username,
//         date,
//         month,
//         year,
//         place,
//         number,
//       },
//     });

//     return bday;
//   } catch (error) {
//     await loggerBot(undefined, "[createBday DB]", error, {
//       name,
//       username,
//       date,
//       month,
//       year,
//       place,
//       number,
//     });
//     return null;
//   }
// };

// export const updateBday = async (
//   name: string,
//   username: string,
//   date: number,
//   month: number,
//   year: number | null,
//   place: string,
//   number: string
// ): Promise<boolean> => {
//   name = name.toLowerCase();
//   username = username.toLowerCase();
//   place = place.toLowerCase();

//   try {
//     const bday = await prisma.bday.update({
//       data: {
//         name,
//         username,
//         date,
//         month,
//         year,
//         place,
//       },
//       where: {
//         number,
//       },
//     });

//     if (!bday) {
//       const res = await createBday(
//         name,
//         username,
//         date,
//         month,
//         year,
//         place,
//         number
//       );

//       if (!res) {
//         return false;
//       }
//     }

//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateBday DB]", error, {
//       name,
//       username,
//       date,
//       month,
//       year,
//       place,
//       number,
//     });

//     return false;
//   }
// };
