// import pool from "./pool";

// export const createCountTable = async () => {
//   await pool.query(
//     "CREATE TABLE IF NOT EXISTS count(day DATE PRIMARY KEY, times integer);"
//   );
// };

// export interface GetCount {
//   day: string;
//   times: number;
// }

// export const getcount = async (): Promise<GetCount[]> => {
//   await createCountTable();
//   const result = await pool.query(
//     "SELECT to_char(day, 'DD/MM/YYYY'),day,times FROM count ORDER BY(day) DESC;"
//   );

//   if (result.rowCount) {
//     return result.rows;
//   }
//   return [];
// };

// export const countToday = async (): Promise<number> => {
//   let todayDate = new Date().toLocaleDateString("en-GB", {
//     timeZone: "Asia/kolkata",
//   });
//   const li = todayDate.split("/");
//   const temp = li[0];
//   // eslint-disable-next-line prefer-destructuring
//   li[0] = li[2];
//   li[2] = temp;
//   todayDate = li.join("/");

//   await createCountTable();

//   // check if today date is present in DB or not
//   const result = await pool.query("select * from count where day=$1;", [
//     todayDate,
//   ]);

//   // present
//   if (result.rows.length) {
//     const { times } = result.rows[0];

//     await pool.query("UPDATE count SET times = times+1 WHERE day=$1;", [
//       todayDate,
//     ]);

//     return times + 1;
//   }
//   await pool.query("INSERT INTO count VALUES($1,$2);", [todayDate, 1]);

//   return 1;
// };
