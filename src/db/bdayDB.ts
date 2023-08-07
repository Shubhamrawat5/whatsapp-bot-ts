/* eslint-disable no-param-reassign */
import { loggerBot } from "../utils/logger";
import pool from "./pool";

// TODO: CHECK THESE TABLE NAMES (SINGULAR/PLURAL)
export const createbdayTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS bday(
      number TEXT PRIMARY KEY,
      name TEXT NOT NULL, 
      username TEXT NOT NULL, 
      date INTEGER NOT NULL, 
      month INTEGER NOT NULL, 
      year INTEGER, 
      place TEXT NOT NULL
    );`
  );
};

export interface Getbday {
  name: string;
  username: string;
  date: number;
  month: number;
  year: number | null;
  place: string;
  number: string;
}

// TODO: CHECK THESE FUNCTION NAMES (SINGULAR/PLURAL)
export const getbday = async (): Promise<Getbday[]> => {
  try {
    const res = await pool.query("SELECT * FROM bday;");

    if (res.rowCount) {
      return res.rows;
    }
  } catch (error) {
    await loggerBot(undefined, "[getbday DB]", error, undefined);
  }
  return [];
};

export const addbday = async (
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

  try {
    const res = await pool.query(
      "INSERT INTO bday VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(number) DO NOTHING;",
      [name, username, date, month, year, place, numb]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    await loggerBot(undefined, "[addbday DB]", error, {
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
