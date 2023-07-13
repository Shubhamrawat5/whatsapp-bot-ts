import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createCountMemberTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS countmember(
      memberjid TEXT NOT NULL, 
      groupjid TEXT NOT NULL, 
      message_count INTEGER NOT NULL DEFAULT 0, 
      warning INTEGER NOT NULL DEFAULT 0, 
      PRIMARY KEY (memberjid, groupjid), 
      CHECK(warning BETWEEN 0 and 3)
    );`
  );
};

export interface GetCountGroupMembers {
  memberjid: string;
  message_count: number;
  name: string;
}

// pvxm: current group member stats
export const getCountGroupMembers = async (
  groupjid: string
): Promise<GetCountGroupMembers[]> => {
  try {
    const res = await pool.query(
      "SELECT cm.memberjid,cm.message_count,memb.name FROM countmember cm INNER JOIN members memb ON cm.memberjid=memb.memberjid WHERE groupjid=$1 ORDER BY message_count DESC;",
      [groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountGroupMembers DB]", error, undefined);
  }
  return [];
};

export interface GetCountIndividual {
  message_count: number;
  name: string;
}

// count: user current group total messsage count
export const getCountIndividual = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountIndividual[]> => {
  try {
    const res = await pool.query(
      "SELECT memb.name,cm.message_count FROM members memb INNER JOIN countmember cm ON memb.memberjid=cm.memberjid WHERE cm.memberjid=$1 AND cm.groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountIndividual DB]", error, undefined);
  }
  return [];
};

export interface GetRankInAllGroups {
  name: string;
  message_count: number;
  ranks: number;
  totalUsers: number;
}

// rank: rank in all groups message count
export const getRankInAllGroups = async (
  memberjid: string
): Promise<GetRankInAllGroups[]> => {
  try {
    const res = await pool.query(
      "SELECT memb.name,table1.message_count,table1.memberjid,table1.ranks from (SELECT memberjid,sum(message_count) as message_count,RANK () OVER (ORDER BY sum(message_count) DESC) ranks FROM countmember group by memberjid ) table1 INNER JOIN members memb on table1.memberjid = memb.memberjid where table1.memberjid=$1;",
      [memberjid]
    );

    const res2 = await pool.query(
      "select count(*) from (select memberjid,count(*) from countmember GROUP BY memberjid) table1;"
    );

    const resultObj: GetRankInAllGroups = {
      name: "",
      message_count: 0,
      ranks: 0,
      totalUsers: 0,
    };
    if (res.rowCount) {
      resultObj.name = res.rows[0].name;
      resultObj.message_count = res.rows[0].message_count;
      resultObj.ranks = res.rows[0].ranks;
      resultObj.totalUsers = res2.rows[0].count;
      return [resultObj];
    }
  } catch (error) {
    await loggerBot(undefined, "[getRankInAllGroups DB]", error, undefined);
  }
  return [];
};

export interface GetCountIndividualAllGroup {
  name: string;
  gname: string;
  message_count: number;
}

// count: user all group (with group wise) message count
export const getCountIndividualAllGroup = async (
  memberjid: string
): Promise<GetCountIndividualAllGroup[]> => {
  try {
    const res = await pool.query(
      "SELECT memb.name,grps.gname,cm.message_count FROM countmember cm INNER JOIN members memb ON memb.memberjid=cm.memberjid INNER JOIN groups grps ON grps.groupjid=cm.groupjid WHERE cm.memberjid=$1 ORDER BY message_count DESC;",
      [memberjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(
      undefined,
      "[getCountIndividualAllGroup DB]",
      error,
      undefined
    );
  }
  return [];
};

export interface GetCountTop {
  name: string;
  memberjid: string;
  message_count: number;
}

// pvxt: top members stats of all groups
export const getCountTop = async (
  noOfResult: number
): Promise<GetCountTop[]> => {
  try {
    const res = await pool.query(
      `SELECT members.name,countmember.memberjid,sum(countmember.message_count) as message_count FROM countmember LEFT JOIN members ON countmember.memberjid=members.memberjid GROUP BY countmember.memberjid,members.name ORDER BY message_count DESC LIMIT ${noOfResult};`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountTop DB]", error, undefined);
  }
  return [];
};

export interface GetCountTop5 {
  gname: string;
  name: string;
  message_count: number;
}

// pvxt5: top members stats of all groups
export const getCountTop5 = async (): Promise<GetCountTop5[]> => {
  try {
    const res = await pool.query(
      "SELECT groups.gname,members.name,rs.message_count FROM (SELECT groupjid,memberjid,message_count, Rank() over (Partition BY groupjid ORDER BY message_count DESC ) AS Rank FROM countmember) rs INNER JOIN groups on rs.groupjid=groups.groupjid INNER JOIN members ON rs.memberjid=members.memberjid WHERE Rank <= 5;"
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountTop5 DB]", error, undefined);
  }
  return [];
};

export interface GetCountGroups {
  gname: string;
  message_count: number;
}

// pvxg: all groups stats
export const getCountGroups = async (): Promise<GetCountGroups[]> => {
  try {
    const res = await pool.query(
      "SELECT groups.gname,SUM(countmember.message_count) as message_count from countmember INNER JOIN groups ON countmember.groupjid = groups.groupjid GROUP BY groups.gname ORDER BY message_count DESC;"
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountGroups DB]", error, undefined);
  }
  return [];
};

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
    // update count
    const res1 = await pool.query(
      "UPDATE countmember SET message_count = message_count+1 WHERE memberjid=$1 AND groupjid=$2 RETURNING *;",
      [memberjid, groupjid]
    );

    if (res1.rowCount === 0) {
      await pool.query(
        "INSERT INTO countmember VALUES($1,$2,$3,$4) RETURNING *;",
        [memberjid, groupjid, 1, 0]
      );
    } else {
      result.currentGroup = res1.rows[0].message_count;
    }

    // update username of member
    const res2 = await pool.query(
      "UPDATE members SET name=$1 WHERE memberjid=$2;",
      [name, memberjid]
    );
    if (res2.rowCount === 0) {
      await pool.query("INSERT INTO members VALUES($1,$2);", [memberjid, name]);
    }

    // get current group and all group message count
    const res3 = await pool.query(
      "SELECT sum(message_count) as message_count, memberjid FROM countmember GROUP BY memberjid HAVING memberjid=$1;",
      [memberjid]
    );

    if (res3.rowCount !== 0) {
      result.allGroup = res3.rows[0].message_count;
    }
  } catch (error) {
    await loggerBot(undefined, "[setCountMember DB]", error, undefined);
  }

  return result;
};
