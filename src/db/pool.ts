import "dotenv/config";
import { Pool } from "pg";

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 4, // max connection limit
};

const pool = new Pool(config);
export default pool;
