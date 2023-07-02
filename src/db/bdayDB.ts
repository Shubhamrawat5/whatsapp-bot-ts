/* eslint-disable no-param-reassign */
import pool from "./pool";

export const createbdayTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS bday(
      name TEXT NOT NULL, 
      username TEXT NOT NULL, 
      date INTEGER NOT NULL, 
      month INTEGER NOT NULL, 
      year INTEGER, 
      place TEXT NOT NULL, 
      number TEXT PRIMARY KEY,
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

export const getbday = async (): Promise<Getbday[]> => {
  const result = await pool.query("select * from bday;");

  if (result.rowCount) {
    return result.rows;
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
    await pool.query("INSERT INTO bday VALUES($1,$2,$3,$4,$5,$6,$7);", [
      name,
      username,
      date,
      month,
      year,
      place,
      numb,
    ]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
