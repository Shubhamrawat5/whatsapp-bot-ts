import { pool } from "./pool";

//create count table if not there
const createSportTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS sportsnews(news text PRIMARY KEY);"
  );
};

export const storeNewsSport = async (news: string): Promise<boolean> => {
  try {
    await createSportTable();
    await pool.query("INSERT INTO sportsnews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
