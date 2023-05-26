import { pool } from "./pool";

const createDisableCommandTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS disablecommand(chat_id text PRIMARY KEY, disabled json);"
  );
};

//TODO: check this
export interface GetDisableCommandData {
  chat_id: string;
  disabled: string[];
}

export const getDisableCommandData = async (
  groupjid: string
): Promise<GetDisableCommandData[]> => {
  //TODO: ADD TRY CATCH IN EVERY DB
  await createDisableCommandTable();

  //check if today date is present in DB or not
  let result = await pool.query(
    "select * from disablecommand where chat_id=$1;",
    [groupjid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

export const setDisableCommandData = async (
  groupjid: string,
  disabled: any
): Promise<boolean> => {
  disabled = JSON.stringify(disabled);

  try {
    let res = await pool.query(
      "UPDATE disablecommand SET disabled=$1 WHERE chat_id=$2;",
      [disabled, groupjid]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO disablecommand VALUES($1,$2);", [
        groupjid,
        disabled,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createDisableCommandTable();
    return false;
  }
};
