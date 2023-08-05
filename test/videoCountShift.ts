// import pool from "../src/db/pool";

// export interface GetCountVideo {
//   memberjid: string;
//   count: number;
//   name: string;
// }

// export const getCountVideo = async (
//   groupjid: string
// ): Promise<GetCountVideo[]> => {
//   try {
//     const res = await pool.query(
//       "SELECT cv.memberjid,cv.count,memb.name FROM countvideo cv LEFT JOIN members memb ON cv.memberjid=memb.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
//       [groupjid]
//     );
//     if (res.rowCount) {
//       return res.rows;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return [];
// };

// const main = async () => {
//   const groupjid = "190166770@g.us";
//   const res = await getCountVideo(groupjid);
//   console.log(res.length);
//   let time = 0;

//   res.forEach((member, index) => {
//     const { memberjid, count } = member;
//     // console.log(memberjid, groupjid, count);
//     time += 400;

//     setTimeout(async () => {
//       console.log(index + 1);
//       const res2 = await pool.query(
//         "UPDATE countmember SET video_count = $3 WHERE memberjid=$1 AND groupjid=$2;",
//         [memberjid, groupjid, count]
//       );

//       if (res2.rowCount === 1) console.log("SUCCESS");
//       else console.log(memberjid, groupjid, count);
//     }, time);
//   });
// };

// main();
