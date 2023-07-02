import pool from "./pool";

export const createTechTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS technews(news text PRIMARY KEY);"
  );
};

export const storeNewsTech = async (news: string): Promise<boolean> => {
  try {
    await pool.query("INSERT INTO technews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
