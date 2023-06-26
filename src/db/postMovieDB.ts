import pool from "./pool";

// create count table if not there
const createMovieTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS moviesnews(news text PRIMARY KEY);"
  );
};

export const storeNewsMovie = async (news: string): Promise<boolean> => {
  try {
    await createMovieTable();
    await pool.query("INSERT INTO moviesnews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
