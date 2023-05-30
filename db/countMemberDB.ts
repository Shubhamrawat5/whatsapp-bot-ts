import { pool } from "./pool";

//create countmember table if not there
const createCountMemberTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countmember(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid));"
  );
};

//create countmembername table if not there
const createCountMemberNameTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countmembername(memberjid text PRIMARY KEY, name text);"
  );
};

export interface GetCountGroupMembers {
  memberjid: string;
  count: number;
  name: string;
}

//pvxm: current group member stats
export const getCountGroupMembers = async (
  groupjid: string
): Promise<GetCountGroupMembers[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT cm.memberjid,cm.count,cmn.name FROM countmember cm INNER JOIN countmembername cmn ON cm.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
    [groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountIndividual {
  count: number;
  name: string;
}

//count: user current group total messsage count
export const getCountIndividual = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountIndividual[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT cmn.name,cm.count FROM countmembername cmn INNER JOIN countmember cm ON cmn.memberjid=cm.memberjid WHERE cm.memberjid=$1 AND cm.groupjid=$2;",
    [memberjid, groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountIndividualAllGroup {
  count: number;
  name: string;
}

//total: user all group total message count
export const getCountIndividualAllGroup = async (
  memberjid: string
): Promise<GetCountIndividualAllGroup[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT cmn.name,sum(cm.count) as count,cm.memberjid FROM countmembername cmn INNER JOIN countmember cm ON cmn.memberjid=cm.memberjid GROUP BY cmn.name,cm.memberjid HAVING cm.memberjid=$1;",
    [memberjid]
  );

  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetRankInAllGroups {
  name: string;
  count: number;
  ranks: number;
  totalUsers: number;
}

//rank: rank in all groups message count
export const getRankInAllGroups = async (
  memberjid: string
): Promise<GetRankInAllGroups[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT cmn.name,table1.count,table1.memberjid,table1.ranks from (SELECT memberjid,sum(count) as count,RANK () OVER (ORDER BY sum(count) DESC) ranks FROM countmember group by memberjid ) table1 INNER JOIN countmembername cmn on table1.memberjid = cmn.memberjid where table1.memberjid=$1;",
    [memberjid]
  );

  const result2 = await pool.query(
    "select count(*) from (select memberjid,count(*) from countmember GROUP BY memberjid) table1;"
  );

  const resultObj: GetRankInAllGroups = {
    name: "",
    count: 0,
    ranks: 0,
    totalUsers: 0,
  };
  if (result.rowCount) {
    resultObj.name = result.rows[0].name;
    resultObj.count = result.rows[0].count;
    resultObj.ranks = result.rows[0].ranks;
    resultObj.totalUsers = result2.rows[0].count;
    return [resultObj];
  } else {
    return [];
  }
};

export interface GetCountIndividualAllGroupWithName {
  name: string;
  gname: string;
  count: number;
}

//count: user all group (with group wise) message count
export const getCountIndividualAllGroupWithName = async (
  memberjid: string
): Promise<GetCountIndividualAllGroupWithName[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT cmn.name,gn.gname,cm.count FROM countmember cm INNER JOIN countmembername cmn ON cmn.memberjid=cm.memberjid INNER JOIN groupname gn ON gn.groupjid=cm.groupjid WHERE cm.memberjid=$1 ORDER BY count DESC;",
    [memberjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountTop {
  name: string;
  memberjid: string;
  count: number;
}

//pvxt: top members stats of all groups
export const getCountTop = async (
  noOfResult: number
): Promise<GetCountTop[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    `SELECT countmembername.name,countmember.memberjid,sum(countmember.count) as count FROM countmember LEFT JOIN countmembername ON countmember.memberjid=countmembername.memberjid GROUP BY countmember.memberjid,countmembername.name ORDER BY count DESC LIMIT ${noOfResult};`
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountTop5 {
  gname: string;
  name: string;
  count: number;
}

//pvxt5: top members stats of all groups
export const getCountTop5 = async (): Promise<GetCountTop5[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT groupname.gname,countmembername.name,rs.count FROM (SELECT groupjid,memberjid,count, Rank() over (Partition BY groupjid ORDER BY count DESC ) AS Rank FROM countmember) rs INNER JOIN groupname on rs.groupjid=groupname.groupjid INNER JOIN countmembername ON rs.memberjid=countmembername.memberjid WHERE Rank <= 5;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountTop10 {
  gname: string;
  name: string;
  count: number;
}

//pvxt10: top members stats of all groups
export const getCountTop10 = async (): Promise<GetCountTop10[]> => {
  await createCountMemberTable();
  const result = await pool.query(
    "SELECT groupname.gname,countmembername.name,rs.count FROM (SELECT groupjid,memberjid,count, Rank() over (Partition BY groupjid ORDER BY count DESC ) AS Rank FROM countmember) rs INNER JOIN groupname on rs.groupjid=groupname.groupjid INNER JOIN countmembername ON rs.memberjid=countmembername.memberjid WHERE Rank <= 10;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetCountGroups {
  gname: string;
  count: number;
}

//pvxg: all groups stats
export const getCountGroups = async (): Promise<GetCountGroups[]> => {
  await createCountMemberTable();
  // let result = await pool.query(
  //   "SELECT groupjid,SUM(count) as count FROM countmember GROUP BY groupjid ORDER BY count DESC;"
  // );
  const result = await pool.query(
    "SELECT groupname.gname,SUM(countmember.count) as count from countmember INNER JOIN groupname ON countmember.groupjid = groupname.groupjid GROUP BY groupname.gname ORDER BY count DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export interface GetUsernames {
  [key: string]: string;
}

//get usesrnames
export const getUsernames = async (
  memberjidArray: string[]
): Promise<GetUsernames[]> => {
  console.log(memberjidArray);
  const result = await pool.query(
    "SELECT * from countmembername where memberjid = ANY($1::text[])",
    [memberjidArray]
  );
  // console.log(result.rows);
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

// module.exports.setCountMember = async (memberjid, groupjid, name) => {
//   if (!groupjid.endsWith("@g.us")) return;

//   //check if groupjid is present in DB or not
//   let result;
//   try {
//     result = await pool.query(
//       "select * from countmember WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//   } catch (err) {
//     await createCountMemberTable();
//     result = await pool.query(
//       "select * from countmember WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//   }

//   //present
//   if (result.rows.length) {
//     let count = result.rows[0].count;

//     await pool.query(
//       "UPDATE countmember SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
//       [memberjid, groupjid]
//     );
//   } else {
//     await pool.query("INSERT INTO countmember VALUES($1,$2,$3);", [
//       memberjid,
//       groupjid,
//       1,
//     ]);
//   }
//

//   let resultName;
//   try {
//     resultName = await pool.query(
//       "select * from countmembername WHERE memberjid=$1;",
//       [memberjid]
//     );
//   } catch (err) {
//     await createCountMemberNameTable();
//     resultName = await pool.query(
//       "select * from countmembername WHERE memberjid=$1;",
//       [memberjid]
//     );
//   }

//   //present
//   if (resultName.rows.length) {
//     await pool.query(
//       "UPDATE countmembername SET name = $1 WHERE memberjid=$2;",
//       [name, memberjid]
//     );
//   } else {
//     await pool.query("INSERT INTO countmembername VALUES($1,$2);", [
//       memberjid,
//       name,
//     ]);
//   }
//
// };

export interface SetCountMember {
  currentGroup: number;
  allGroup: number;
}

export const setCountMember = async (
  memberjid: string,
  groupjid: string,
  name: string | undefined | null
): Promise<SetCountMember> => {
  const result = { currentGroup: 0, allGroup: 0 };
  try {
    const res = await pool.query(
      "UPDATE countmember SET count = count+1 WHERE memberjid=$1 AND groupjid=$2 RETURNING *;",
      [memberjid, groupjid]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query(
        "INSERT INTO countmember VALUES($1,$2,$3) RETURNING *;",
        [memberjid, groupjid, 1]
      );
    } else {
      result.currentGroup = res.rows[0].count;
    }
  } catch (err) {
    console.log(err);
    await createCountMemberTable();
  }

  try {
    const res = await pool.query(
      "UPDATE countmembername SET name=$1 WHERE memberjid=$2;",
      [name, memberjid]
    );
    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO countmembername VALUES($1,$2);", [
        memberjid,
        name,
      ]);
    }
  } catch (err) {
    console.log(err);
    await createCountMemberNameTable();
  }

  try {
    const res = await pool.query(
      "SELECT sum(count) as count, memberjid FROM countmember GROUP BY memberjid HAVING memberjid=$1;",
      [memberjid]
    );

    //not updated. time to insert
    if (res.rowCount !== 0) {
      result.allGroup = res.rows[0].count;
    }
  } catch (err) {
    console.log(err);
    await createCountMemberTable();
  }

  return result;
};
