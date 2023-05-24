import { pool } from "./pool";

export const dropAuth = async () => {
  await pool.query("DROP table auth;");
};
