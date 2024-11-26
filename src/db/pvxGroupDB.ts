import { checkGroupjid } from "../functions/checkValue";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createGroupTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS pvx_group(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      groupjid TEXT UNIQUE NOT NULL,
      gname TEXT NOT NULL,
      link TEXT,
      commands_disabled TEXT [] NOT NULL DEFAULT '{}',
      type TEXT NOT NULL DEFAULT 'whatsapp',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export interface GetGroupData {
  groupjid: string;
  gname: string;
  link?: string;
  commands_disabled?: string[];
}

export const getGroupData = async (
  groupjid?: string
): Promise<GetGroupData[]> => {
  try {
    let res;
    if (groupjid) {
      res = await pool.query("SELECT * FROM pvx_group WHERE groupjid=$1;", [
        groupjid,
      ]);
    } else {
      res = await pool.query("SELECT * FROM pvx_group;");
    }

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getGroupData DB]", error, { groupjid });
  }
  return [];
};

export const setGroupData = async (
  groupjid: string,
  gname: string,
  link: string | null
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;

  try {
    // check if groupjid is present in DB or not
    const res = await pool.query(
      "UPDATE pvx_group SET gname = $1, link=$2, updated_at = NOW() WHERE groupjid=$3;",
      [gname, link, groupjid]
    );
    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO pvx_group (groupjid, gname, link, commands_disabled) VALUES($1,$2,$3,$4);",
        [groupjid, gname, link, []]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }

    return true;
  } catch (error) {
    await loggerBot(undefined, "[setGroupData DB]", error, {
      groupjid,
      gname,
      link,
    });
    return false;
  }
};

export const setDisableCommand = async (
  groupjid: string,
  gname: string,
  commands_disabled: string[]
): Promise<boolean> => {
  if (!checkGroupjid(groupjid)) return false;

  try {
    const res = await pool.query(
      "UPDATE pvx_group SET commands_disabled=$1, updated_at = NOW() WHERE groupjid=$2;",
      [commands_disabled, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      const res2 = await pool.query(
        "INSERT INTO pvx_group (groupjid, gname, link, commands_disabled) VALUES($1,$2,$3,$4);",
        [groupjid, gname, null, commands_disabled]
      );
      if (res2.rowCount === 1) return true;
      return false;
    }
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setDisableCommand DB]", error, {
      groupjid,
      gname,
      commands_disabled,
    });
    return false;
  }
};
