import { Pool } from "pg";
import { databaseUrl } from "../utils/config";

const config = {
  connectionString: databaseUrl,
  max: 4, // max connection limit
};

const pool = new Pool(config);
export default pool;
