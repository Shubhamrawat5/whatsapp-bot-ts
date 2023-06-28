import pool from "./pool";

// create count table if not there
export const createStudyTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS studynews(news text PRIMARY KEY);"
  );
};

export const storeNewsStudy = async (news: string): Promise<boolean> => {
  try {
    await createStudyTable();
    await pool.query("INSERT INTO studynews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
