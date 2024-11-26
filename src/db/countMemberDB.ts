import { checkGroupjid, checkMemberjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import { setMemberName } from "./membersDB";
import pool from "./pool";

export const createCountMemberTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS count_member(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT NOT NULL,
      groupjid TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      warning_count INTEGER NOT NULL DEFAULT 0 CHECK (
          warning_count BETWEEN 0
          AND 3
      ),
      video_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (memberjid, groupjid),
      CONSTRAINT countmember_groupjid_fkey FOREIGN KEY (groupjid) REFERENCES pvx_group (groupjid),
      CONSTRAINT countmember_memberjid_fkey FOREIGN KEY (memberjid) REFERENCES member (memberjid)
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
      "SELECT cm.memberjid,cm.message_count,memb.name FROM count_member cm INNER JOIN member memb ON cm.memberjid=memb.memberjid WHERE groupjid=$1 ORDER BY message_count DESC;",
      [groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountGroupMembers DB]", error, {
      groupjid,
    });
  }
  return [];
};

export interface GetCountIndividual {
  message_count: number;
  name: string;
}

// rank count: user current group total messsage count
export const getCountIndividual = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountIndividual[]> => {
  try {
    const res = await pool.query(
      "SELECT memb.name,cm.message_count FROM member memb INNER JOIN count_member cm ON memb.memberjid=cm.memberjid WHERE cm.memberjid=$1 AND cm.groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountIndividual DB]", error, {
      memberjid,
      groupjid,
    });
  }
  return [];
};

export interface GetRankInAllGroups {
  name: string;
  messageCount: number;
  ranks: number;
  totalUsers: number;
}

// rank: rank in all groups message count
export const getRankInAllGroups = async (
  memberjid: string
): Promise<GetRankInAllGroups[]> => {
  try {
    const res = await pool.query(
      "SELECT memb.name,table1.message_count,table1.memberjid,table1.ranks from (SELECT memberjid,sum(message_count) as message_count,RANK () OVER (ORDER BY sum(message_count) DESC) ranks FROM count_member GROUP BY memberjid ) table1 INNER JOIN member memb on table1.memberjid = memb.memberjid WHERE table1.memberjid=$1;",
      [memberjid]
    );

    const res2 = await pool.query(
      "SELECT count(*) from (SELECT memberjid,count(*) from count_member GROUP BY memberjid) table1;"
    );

    const resultObj: GetRankInAllGroups = {
      name: "",
      messageCount: 0,
      ranks: 0,
      totalUsers: 0,
    };
    if (res.rowCount) {
      resultObj.name = res.rows[0].name;
      resultObj.messageCount = res.rows[0].message_count;
      resultObj.ranks = res.rows[0].ranks;
      resultObj.totalUsers = res2.rows[0].count;
      return [resultObj];
    }
  } catch (error) {
    await loggerBot(undefined, "[getRankInAllGroups DB]", error, { memberjid });
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
      "SELECT memb.name,grps.gname,cm.message_count FROM count_member cm LEFT JOIN member memb ON memb.memberjid=cm.memberjid INNER JOIN pvx_group grps ON grps.groupjid=cm.groupjid WHERE cm.memberjid=$1 ORDER BY message_count DESC;",
      [memberjid]
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountIndividualAllGroup DB]", error, {
      memberjid,
    });
  }
  return [];
};

export interface GetCountTop {
  name: string;
  memberjid: string;
  message_count: number;
}

// pvxt: top member stats of all groups
export const getCountTop = async (
  noOfResult: number
): Promise<GetCountTop[]> => {
  try {
    const res = await pool.query(
      `SELECT member.name,count_member.memberjid,sum(count_member.message_count) as message_count FROM count_member LEFT JOIN member ON count_member.memberjid=member.memberjid GROUP BY count_member.memberjid,member.name ORDER BY message_count DESC LIMIT ${noOfResult};`
    );
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountTop DB]", error, { noOfResult });
  }
  return [];
};

export interface GetCountTop5 {
  gname: string;
  name: string;
  message_count: number;
}

// pvxt5: top member stats of all groups
export const getCountTop5 = async (): Promise<GetCountTop5[]> => {
  try {
    const res = await pool.query(
      "SELECT pvx_group.gname,member.name,rs.message_count FROM (SELECT groupjid,memberjid,message_count, Rank() over (Partition BY groupjid ORDER BY message_count DESC ) AS Rank FROM count_member) rs INNER JOIN pvx_group on rs.groupjid=pvx_group.groupjid INNER JOIN member ON rs.memberjid=member.memberjid WHERE Rank <= 5;"
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
      "SELECT pvx_group.gname,SUM(count_member.message_count) as message_count from count_member INNER JOIN pvx_group ON count_member.groupjid = pvx_group.groupjid GROUP BY pvx_group.gname ORDER BY message_count DESC;"
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
  const result = { currentGroup: 1, allGroup: 1 };
  if (!checkGroupjid(groupjid)) return result;
  if (!checkMemberjid(memberjid)) return result;

  try {
    // update username of member
    await setMemberName(name, memberjid);

    // update count
    const res1 = await pool.query(
      "UPDATE count_member SET message_count = message_count+1, updated_at = NOW() WHERE memberjid=$1 AND groupjid=$2 RETURNING *;",
      [memberjid, groupjid]
    );

    if (res1.rowCount === 0) {
      await pool.query(
        "INSERT INTO count_member (memberjid, groupjid, message_count, warning_count, video_count) VALUES($1,$2,$3,$4,$5);",
        [memberjid, groupjid, 1, 0, 0]
      );
    } else {
      result.currentGroup = res1.rows[0].message_count;
    }

    // get current group and all group message count
    const res2 = await pool.query(
      "SELECT sum(message_count) as message_count, memberjid FROM count_member GROUP BY memberjid HAVING memberjid=$1;",
      [memberjid]
    );

    if (res2.rowCount !== 0) {
      result.allGroup = res2.rows[0].message_count;
    }
  } catch (error) {
    await loggerBot(undefined, "[setCountMember DB]", error, {
      memberjid,
      groupjid,
      name,
    });
  }

  return result;
};

export interface GetCountVideo {
  memberjid: string;
  video_count: number;
  name: string;
}

export const getCountVideo = async (
  groupjid: string
): Promise<GetCountVideo[]> => {
  try {
    const res = await pool.query(
      "SELECT cm.memberjid,cm.video_count,memb.name FROM count_member cm INNER JOIN member memb ON cm.memberjid=memb.memberjid WHERE groupjid=$1 and video_count>0 ORDER BY video_count DESC;",
      [groupjid]
    );

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getCountVideo DB]", error, { groupjid });
  }
  return [];
};

export const setCountVideo = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;
  if (!checkMemberjid(memberjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE count_member SET video_count = video_count+1, updated_at = NOW() WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO count_member (memberjid, groupjid, message_count, warning_count, video_count) VALUES($1,$2,$3,$4,$5);",
        [memberjid, groupjid, 1, 0, 1]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setCountVideo DB]", error, {
      memberjid,
      groupjid,
    });
    return false;
  }
};
