import { pool } from "./pool";

// TODO: PUT TRY CATCH IN EVERY DB
export const dropAuth = async (): Promise<boolean> => {
  try {
    await pool.query("DROP table auth;");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
