import { AuthenticationState } from "@whiskeysockets/baileys";
import pool from "./pool";
import { loggerBot } from "../utils/logger";

export const createAuthTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS auth(
      noisekey TEXT, 
      signedidentitykey TEXT,
      signedprekey TEXT, 
      registrationid TEXT, 
      advsecretkey TEXT, 
      nextprekeyid TEXT, 
      firstunuploadedprekeyid TEXT, 
      account TEXT, 
      me TEXT, 
      signalidentities TEXT, 
      lastaccountsynctimestamp TEXT, 
      myappstatekeyid TEXT
    );`
  );
};

export interface GetAuth {
  cred: any;
  authRowCount: number;
}

export const getAuth = async (state: AuthenticationState): Promise<GetAuth> => {
  let cred: any;
  let authRowCount = 0;
  try {
    const res = await pool.query("SELECT * FROM auth;"); // checking auth table

    console.log("Fetching login data...");
    authRowCount = res.rowCount;
    const data = res.rows[0];

    if (authRowCount === 0) {
      console.log("No login data found!");
    } else {
      console.log("Login data found!");
      cred = {
        creds: {
          noiseKey: JSON.parse(data.noisekey),
          signedIdentityKey: JSON.parse(data.signedidentitykey),
          signedPreKey: JSON.parse(data.signedprekey),
          registrationId: Number(data.registrationid),
          advSecretKey: data.advsecretkey,
          nextPreKeyId: Number(data.nextprekeyid),
          firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyid),
          account: JSON.parse(data.account),
          me: JSON.parse(data.me),
          signalIdentities: JSON.parse(data.signalidentities),
          lastAccountSyncTimestamp: 0, // To allow bot to read the messages
          // lastAccountSyncTimestamp: Number(data.lastaccountsynctimestamp),
          myAppStateKeyId: data.myappstatekeyid,
        },
        keys: state.keys,
      };
      cred.creds.noiseKey.private = Buffer.from(cred.creds.noiseKey.private);
      cred.creds.noiseKey.public = Buffer.from(cred.creds.noiseKey.public);
      cred.creds.signedIdentityKey.private = Buffer.from(
        cred.creds.signedIdentityKey.private
      );
      cred.creds.signedIdentityKey.public = Buffer.from(
        cred.creds.signedIdentityKey.public
      );
      cred.creds.signedPreKey.keyPair.private = Buffer.from(
        cred.creds.signedPreKey.keyPair.private
      );
      cred.creds.signedPreKey.keyPair.public = Buffer.from(
        cred.creds.signedPreKey.keyPair.public
      );
      cred.creds.signedPreKey.signature = Buffer.from(
        cred.creds.signedPreKey.signature
      );
      cred.creds.signalIdentities[0].identifierKey = Buffer.from(
        cred.creds.signalIdentities[0].identifierKey
      );
    }
  } catch (error) {
    await loggerBot(undefined, "[getAuth DB]", error, { state });
  }

  return { cred, authRowCount };
};

export const setAuth = async (state: AuthenticationState): Promise<boolean> => {
  try {
    const noiseKey = JSON.stringify(state.creds.noiseKey);
    const signedIdentityKey = JSON.stringify(state.creds.signedIdentityKey);
    const signedPreKey = JSON.stringify(state.creds.signedPreKey);
    const { registrationId } = state.creds;
    const { advSecretKey } = state.creds;
    const { nextPreKeyId } = state.creds;
    const { firstUnuploadedPreKeyId } = state.creds;
    const account = JSON.stringify(state.creds.account);
    const me = JSON.stringify(state.creds.me);
    const signalIdentities = JSON.stringify(state.creds.signalIdentities);
    const { lastAccountSyncTimestamp } = state.creds;
    // let lastAccountSyncTimestamp = 0;
    const { myAppStateKeyId } = state.creds; // ?

    const res = await pool.query(
      "UPDATE auth SET noiseKey = $1, signedIdentityKey = $2, signedPreKey = $3, registrationId = $4, advSecretKey = $5, nextPreKeyId = $6, firstUnuploadedPreKeyId = $7, account = $8, me = $9, signalIdentities = $10, lastAccountSyncTimestamp = $11, myAppStateKeyId = $12;",
      [
        noiseKey,
        signedIdentityKey,
        signedPreKey,
        registrationId,
        advSecretKey,
        nextPreKeyId,
        firstUnuploadedPreKeyId,
        account,
        me,
        signalIdentities,
        lastAccountSyncTimestamp,
        myAppStateKeyId,
      ]
    );

    // not updated. time to insert
    if (res.rowCount === 0) {
      console.log("Inserting login data...");
      const res2 = await pool.query(
        "INSERT INTO auth VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);",
        [
          noiseKey,
          signedIdentityKey,
          signedPreKey,
          registrationId,
          advSecretKey,
          nextPreKeyId,
          firstUnuploadedPreKeyId,
          account,
          me,
          signalIdentities,
          lastAccountSyncTimestamp,
          myAppStateKeyId,
        ]
      );
      if (res2.rowCount === 1) {
        console.log("New login data inserted!");
        return true;
      }
      return false;
    }
    console.log("Login data updated!");
    return true;
  } catch (error) {
    await loggerBot(undefined, "[setAuth DB]", error, { state });
    return false;
  }
};

export const deleteAuth = async (): Promise<boolean> => {
  try {
    const res = await pool.query("DELETE FROM auth;");
    if (res.rowCount === 1) return true;
    return false;
  } catch (error) {
    await loggerBot(undefined, "[deleteAuth DB]", error, undefined);
    return false;
  }
};
