import pool from "./pool";

export const dropAuth = async (): Promise<boolean> => {
  try {
    await pool.query("DROP table auth;");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
