import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createGroupsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS groups(
      groupjid TEXT PRIMARY KEY, 
      gname TEXT NOT NULL, 
      link TEXT, 
      commands_disabled JSON
    );`
  );
};

export interface GetGroupsData {
  groupjid: string;
  gname: string;
  link?: string;
  commands_disabled?: string[];
}

export const getGroupsData = async (
  groupjid?: string
): Promise<GetGroupsData[]> => {
  try {
    let res;
    if (groupjid) {
      res = await pool.query("SELECT * FROM groups WHERE groupjid=$1;", [
        groupjid,
      ]);
    } else {
      res = await pool.query("SELECT * FROM groups;");
    }
    // not updated. time to insert
    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getGroupsData DB]", error, { groupjid });
  }
  return [];
};

export const setGroupsData = async (
  groupjid: string,
  gname: string,
  link: string | undefined,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    // check if groupjid is present in DB or not
    const res = await pool.query(
      "UPDATE groups SET gname = $1, link=$2 WHERE groupjid=$3;",
      [gname, link, groupjid]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query("INSERT INTO groups VALUES($1,$2,$3,$4);", [
        groupjid,
        gname,
        link,
        disabledJson,
      ]);
      if (res2.rowCount === 1) return true;
      return false;
    }

    return true;
  } catch (error) {
    await loggerBot(undefined, "[setGroupsData DB]", error, {
      groupjid,
      gname,
      link,
      disabled,
    });
    return false;
  }
};

export const setDisableCommand = async (
  groupjid: string,
  gname: string,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);

  try {
    const res = await pool.query(
      "UPDATE groups SET commands_disabled=$1 WHERE groupjid=$2;",
      [disabledJson, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query("INSERT INTO groups VALUES($1,$2,$3,$4);", [
        groupjid,
        gname,
        null,
        disabledJson,
      ]);
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setDisableCommand DB]", error, {
      groupjid,
      gname,
      disabled,
    });
    return false;
  }
};
