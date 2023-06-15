import "dotenv/config";
import { Pool } from "pg";

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 4, // max connection limit
};

export const pool = new Pool(proConfig);
