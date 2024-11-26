/* eslint-disable no-param-reassign */
import { loggerBot } from "../utils/logger";
import pool from "./pool";

export const createbirthdayTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS birthday(
      uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      memberjid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      date INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER,
      place TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT birthday_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES member(memberjid)
    );`
  );
};

export interface GetBirthday {
  name: string;
  username: string;
  date: number;
  month: number;
  year: number | null;
  place: string;
  memberjid: string;
}

export const getBirthday = async (): Promise<GetBirthday[]> => {
  try {
    const res = await pool.query("SELECT * FROM birthday;");

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getBirthday DB]", error, undefined);
  }
  return [];
};

export const addBirthday = async (
  name: string,
  username: string,
  date: number,
  month: number,
  year: number | null,
  place: string,
  numb: string
): Promise<boolean> => {
  name = name.toLowerCase();
  username = username.toLowerCase();
  place = place.toLowerCase();
  const memberjid = `${numb}@s.whatsapp.net`;

  try {
    const res = await pool.query(
      "INSERT INTO birthday (name, username, date, month, year, place, memberjid) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(memberjid) DO NOTHING;",
      [name, username, date, month, year, place, memberjid]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[addBirthday DB]", error, {
      name,
      username,
      date,
      month,
      year,
      place,
      numb,
    });
  }
  return false;
};
