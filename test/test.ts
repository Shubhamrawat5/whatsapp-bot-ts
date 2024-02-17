// import pool from "../src/db/pool";
// import { Getbday } from "../src/db/bdayDB";

//160 total
// const main = async () => {
  //   const res = await pool.query(
  //     "SELECT table1.username,countmember.memberjid, message_count FROM (SELECT username,number || '@s.whatsapp.net' as memberjid FROM bday) table1 LEFT JOIN countmember ON table1.memberjid=countmember.memberjid where countmember.groupjid='919557666582-1467533860@g.us' order by message_count desc;"
  //   );
//   const res = await pool.query("SELECT * FROM bday;");
//   console.log(res.rows.length);
  //   console.log(JSON.stringify(res.rows));

  //   let time = 1000;
  //   res.rows.forEach((r) => {
  //     if (r.message_count < 1000) {
  //       console.log(r);
  //       setTimeout(async () => {
  //         const res = await pool.query("DELETE from bday where number=$1;", [
  //           r.memberjid.split("@")[0],
  //         ]);
  //         console.log("DELETED", r.username, r.memberjid.split("@")[0]);
  //       }, time);
  //       time += 500;
  //     }
  //   });

  //   console.log(allNumbs);
};

// main();
