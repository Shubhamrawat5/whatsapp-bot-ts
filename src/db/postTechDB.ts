import pool from "./pool";

export const createTechTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS technews(
      news TEXT PRIMARY KEY
    );`
  );
};

export const storeNewsTech = async (news: string): Promise<boolean> => {
  try {
    const res = await pool.query("INSERT INTO technews VALUES($1);", [news]);

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
