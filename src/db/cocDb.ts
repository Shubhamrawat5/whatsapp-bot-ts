import { CocTag } from "../interfaces/Coc";
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const addCocTag = async (
  memberjid: string,
  tag: string
): Promise<CocTag | null> => {
  try {
    // Check if tag-member combination already exists
    const existingTag = await pool.query(
      "SELECT tag, memberjid, created_at, updated_at FROM coc_tag WHERE tag = $1 AND memberjid = $2",
      [tag, memberjid]
    );

    if (existingTag.rowCount && existingTag.rowCount > 0) {
      return existingTag.rows[0]; // Return existing tag
    }

    // Insert new tag and return it
    const res = await pool.query(
      "INSERT INTO coc_tag (tag, memberjid) VALUES ($1, $2) RETURNING tag, memberjid, created_at, updated_at",
      [tag, memberjid]
    );

    if (res.rowCount === 1) {
      return res.rows[0];
    }
    return null;
  } catch (error) {
    await loggerBot(undefined, "[addCocTag DB]", error, undefined);
    return null;
  }
};

export const getCocTags = async (memberjid: string): Promise<string[]> => {
  try {
    const res = await pool.query(
      "SELECT tag FROM coc_tag WHERE memberjid = $1",
      [memberjid]
    );

    if (res.rowCount && res.rowCount > 0) {
      return res.rows.map((row) => row.tag);
    }
  } catch (error) {
    await loggerBot(undefined, "[getCocTags DB]", error, undefined);
  }
  return [];
};

export const getAllMembersByTags = async (
  tags: string[]
): Promise<string[]> => {
  const res = await pool.query(
    "SELECT memberjid FROM coc_tag WHERE tag = ANY($1)",
    [tags]
  );
  return res.rows.map((row) => row.memberjid);
};

export const createCocTagTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS coc_tag(
      tag TEXT NOT NULL,
      memberjid TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (tag),
      CONSTRAINT coctag_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES member(memberjid)
    );`
  );
};
