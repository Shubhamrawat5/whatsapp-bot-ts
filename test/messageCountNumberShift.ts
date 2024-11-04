import pool from "../src/db/pool";

const oldNum = "917003@s.whatsapp.net";
const newNum = "918429@s.whatsapp.net";

const setCountMember = async (
  memberjid: string,
  groupjid: string,
  count: number
) => {
  try {
    console.log(memberjid, groupjid, count);
    const res = await pool.query(
      "UPDATE count_member SET message_count = message_count+$3 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid, count]
    );

    if (res.rowCount === 0) {
      await pool.query("INSERT INTO count_member values($1,$2,$3,$4);", [
        memberjid,
        groupjid,
        count,
        0,
      ]);
    }
  } catch (err) {
    console.log(err);
  }
};

// count: user all group (with group wise) message count
const getCountIndividualAllGroupWithName = async (): Promise<void> => {
  const result = await pool.query(
    "SELECT * FROM count_member WHERE memberjid=$1;",
    [oldNum]
  );
  console.log(result.rows);
  if (result.rowCount) {
    console.log(result.rows);
    let time = 0;

    result.rows.forEach((res) => {
      time += 500;
      setTimeout(async () => {
        // console.log(res.memberjid, res.groupjid, res.count);
        await setCountMember(newNum, res.groupjid, res.message_count);
      }, time);
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
getCountIndividualAllGroupWithName();

// delete from count_member where memberjid = '9170031@s.whatsapp.net'
