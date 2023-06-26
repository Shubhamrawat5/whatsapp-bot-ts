/* eslint-disable max-len */

// const pool = require("../db/pool");
// const pvxsticker1 = "919557666582-1580308963@g.us";
// const pvxsticker2 = "919557666582-1621700558@g.us";
// const setCountMember = async (memberjid, groupjid, count) => {
//   try {
//     console.log(memberjid, groupjid, count);
//     let res1 = await pool.query(
//       "UPDATE countmember SET count = count+$3 WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid, count]
//     );

//     //not updated. time to insert
//     if (res1.affectedRows) {
//       await pool.query(
//         "UPDATE countmember SET count = $3 WHERE memberjid=$1 AND groupjid=$2;",
//         [memberjid, groupjid, count]
//       );
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// //pvxm: current group member stats
// const getCountGroupMembers = async (groupjid) => {
//   let result = await pool.query(
//     "SELECT cm.memberjid,cm.count,cmn.name FROM countmember cm INNER JOIN countmembername cmn ON cm.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
//     [groupjid]
//   );
//   if (result.rowCount) {
//     console.log(result.rows);
//     let time = 0;

//     result.rows.forEach((mem) => {
//       time += 500;
//       setTimeout(() => {
//         setCountMember(mem.memberjid, pvxsticker1, mem.count);
//         // console.log(mem.memberjid, pvxsticker1, mem.count);
//       }, time);
//     });
//   } else {
//     return [];
//   }
// };
// getCountGroupMembers(pvxsticker2);
