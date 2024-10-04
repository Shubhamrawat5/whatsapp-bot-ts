import {
  AuthenticationCreds,
  AuthenticationState,
  SignalCreds,
} from "@whiskeysockets/baileys";
import pool from "./pool";
import { loggerBot } from "../utils/logger";

export const createAuthTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS auth(
      uuid UUID DEFAULT gen_random_uuid(),
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
      myappstatekeyid TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`
  );
};

export const getAuth = async (
  state: AuthenticationState
): Promise<AuthenticationCreds | undefined> => {
  let creds: AuthenticationCreds | undefined;

  try {
    const res = await pool.query("SELECT * FROM auth;");

    console.log("Fetching login data...");
    const data = res.rows[0];

    if (res.rowCount === 0) {
      console.log("No login data found!");
      creds = undefined;
    } else {
      console.log("Login data found!");

      const noiseKey = JSON.parse(data.noisekey);
      const signedIdentityKey = JSON.parse(data.signedidentitykey);
      const signedPreKey = JSON.parse(data.signedprekey);
      const signalIdentities = JSON.parse(data.signalidentities);

      const signalCreds: SignalCreds = {
        signedIdentityKey: {
          private: Buffer.from(signedIdentityKey.private),
          public: Buffer.from(signedIdentityKey.public),
        },
        signedPreKey: {
          keyPair: {
            private: Buffer.from(signedPreKey.keyPair.private),
            public: Buffer.from(signedPreKey.keyPair.public),
          },
          signature: Buffer.from(signedPreKey.signature),
          keyId: signedPreKey.keyId,
        },
        registrationId: Number(data.registrationid),
      };

      creds = {
        ...state.creds,
        ...signalCreds,
        noiseKey: {
          private: Buffer.from(noiseKey.private),
          public: Buffer.from(noiseKey.public),
        },
        advSecretKey: data.advsecretkey,
        me: JSON.parse(data.me),
        account: JSON.parse(data.account),
        signalIdentities: [
          {
            identifier: signalIdentities[0].identifier,
            identifierKey: Buffer.from(signalIdentities[0].identifierKey),
          },
        ],
        myAppStateKeyId: data.myappstatekeyid,
        firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyid),
        nextPreKeyId: Number(data.nextprekeyid),
        lastAccountSyncTimestamp: Number(data.lastaccountsynctimestamp),
      };
    }
  } catch (error) {
    await loggerBot(undefined, "[getAuth DB]", error, undefined);
  }

  return creds;
};

// TODO: SAVE THESE IN DB
// [EXTRA CREDS VARIABLES]
// pairingEphemeralKeyPair ?? not found
// pairingCode ?? not found
// processedHistoryMessages
// accountSyncCounter
// accountSettings
// deviceId:
// phoneId
// identityId:
// registered:
// backupToken
// registration
// platform

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
    const { myAppStateKeyId } = state.creds;

    const res = await pool.query(
      "UPDATE auth SET noiseKey = $1, signedIdentityKey = $2, signedPreKey = $3, registrationId = $4, advSecretKey = $5, nextPreKeyId = $6, firstUnuploadedPreKeyId = $7, account = $8, me = $9, signalIdentities = $10, lastAccountSyncTimestamp = $11, myAppStateKeyId = $12, updated_at = NOW();",
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
        "INSERT INTO auth (noisekey, signedidentitykey, signedprekey, registrationid, advsecretkey, nextprekeyid, firstunuploadedprekeyid, account, me, signalidentities, lastaccountsynctimestamp, myappstatekeyid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);",
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
