import { pool } from "./pool";

// create count table if not there
const createTechTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS technews(news text PRIMARY KEY);"
  );
};

export const storeNewsTech = async (news: string): Promise<boolean> => {
  try {
    await createTechTable();
    await pool.query("INSERT INTO technews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
