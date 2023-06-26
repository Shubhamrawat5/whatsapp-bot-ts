import { pool } from "./pool";

const createDisableCommandTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS disablecommand(chat_id text PRIMARY KEY, disabled json);"
  );
};

export interface GetDisableCommandData {
  chat_id: string;
  disabled: string[];
}

export const getDisableCommand = async (
  groupjid: string
): Promise<GetDisableCommandData[]> => {
  await createDisableCommandTable();

  // check if today date is present in DB or not
  const result = await pool.query(
    "select * from disablecommand where chat_id=$1;",
    [groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export const setDisableCommand = async (
  groupjid: string,
  disabled: string[]
): Promise<boolean> => {
  const disabledJson = JSON.stringify(disabled);

  try {
    const res = await pool.query(
      "UPDATE disablecommand SET disabled=$1 WHERE chat_id=$2;",
      [disabledJson, groupjid]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO disablecommand VALUES($1,$2);", [
        groupjid,
        disabledJson,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createDisableCommandTable();
    return false;
  }
};
