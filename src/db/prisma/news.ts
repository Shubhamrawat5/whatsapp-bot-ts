// import { News } from "@prisma/client";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";

// export const getNews = async (headline: string): Promise<News | null> => {
//   try {
//     const news = await prisma.news.findUnique({
//       where: {
//         headline,
//       },
//     });

//     return news;
//   } catch (error) {
//     await loggerBot(undefined, "[getBlacklists DB]", error, undefined);
//     return null;
//   }
// };

// export const createNews = async (headline: string): Promise<boolean> => {
//   try {
//     const news = await getNews(headline);

//     if (!news) {
//       const res = await prisma.news.create({
//         data: {
//           headline,
//           at: new Date(),
//         },
//       });

//       if (res) {
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[storeNews DB]", error, { headline });
//     return false;
//   }
// };

// export const deleteOldNews = async (atOld: string): Promise<boolean> => {
//   // TODO: use new Date() for atOld
//   try {
//     const news = await prisma.news.deleteMany({
//       where: {
//         at: {
//           lt: atOld,
//         },
//       },
//     });

//     if (news.count > 0) {
//       return true;
//     }
//     return false;
//   } catch (error) {
//     await loggerBot(undefined, "[storeNews DB]", error, undefined);
//     return false;
//   }
// };
