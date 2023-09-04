// import {
//   AuthenticationCreds,
//   AuthenticationState,
//   KeyPair,
//   SignalCreds,
//   SignalIdentity,
//   SignedKeyPair,
// } from "@whiskeysockets/baileys";
// import prisma from "../../prismaClient";
// import { loggerBot } from "../../utils/logger";

// export const getAuth = async (
//   state: AuthenticationState
// ): Promise<AuthenticationCreds | undefined> => {
//   let creds: AuthenticationCreds | undefined;

//   try {
//     console.log("Fetching login data...");
//     // TODO: findUnique
//     const auth = await prisma.auth.findFirst();

//     if (auth) {
//       console.log("Login data found!");

//       const noiseKey: KeyPair = JSON.parse(auth.noisekey);
//       const signedIdentityKey: KeyPair = JSON.parse(auth.signedidentitykey);
//       const signedPreKey: SignedKeyPair = JSON.parse(auth.signedprekey);
//       const signalIdentities: SignalIdentity[] =
//         auth.signalidentities && JSON.parse(auth.signalidentities);

//       const signalCreds: SignalCreds = {
//         signedIdentityKey: {
//           private: Buffer.from(signedIdentityKey.private),
//           public: Buffer.from(signedIdentityKey.public),
//         },
//         signedPreKey: {
//           keyPair: {
//             private: Buffer.from(signedPreKey.keyPair.private),
//             public: Buffer.from(signedPreKey.keyPair.public),
//           },
//           signature: Buffer.from(signedPreKey.signature),
//           keyId: signedPreKey.keyId,
//         },
//         registrationId: auth.registrationid,
//       };

//       creds = {
//         ...state.creds,
//         ...signalCreds,
//         noiseKey: {
//           private: Buffer.from(noiseKey.private),
//           public: Buffer.from(noiseKey.public),
//         },
//         advSecretKey: auth.advsecretkey,
//         me: auth.me && JSON.parse(auth.me),
//         account: auth.account && JSON.parse(auth.account),
//         signalIdentities: [
//           {
//             identifier: signalIdentities[0].identifier,
//             identifierKey: Buffer.from(signalIdentities[0].identifierKey),
//           },
//         ],
//         myAppStateKeyId: auth.myappstatekeyid || undefined,
//         firstUnuploadedPreKeyId: auth.firstunuploadedprekeyid,
//         nextPreKeyId: auth.nextprekeyid,
//         lastAccountSyncTimestamp: auth.lastaccountsynctimestamp || undefined,
//       };
//     } else {
//       console.log("No login data found!");
//       creds = undefined;
//     }
//   } catch (error) {
//     await loggerBot(undefined, "[getAuth DB]", error, undefined);
//   }

//   return creds;
// };

// // TODO: SAVE THESE IN DB
// // [EXTRA CREDS VARIABLES]
// // pairingEphemeralKeyPair ?? not found
// // pairingCode ?? not found
// // processedHistoryMessages
// // accountSyncCounter
// // accountSettings
// // deviceId:
// // phoneId
// // identityId:
// // registered:
// // backupToken
// // registration
// // platform

// export const updateAuth = async (
//   state: AuthenticationState
// ): Promise<boolean> => {
//   try {
//     const noiseKey = JSON.stringify(state.creds.noiseKey);
//     const signedIdentityKey = JSON.stringify(state.creds.signedIdentityKey);
//     const signedPreKey = JSON.stringify(state.creds.signedPreKey);
//     const { registrationId } = state.creds;
//     const { advSecretKey } = state.creds;
//     const { nextPreKeyId } = state.creds;
//     const { firstUnuploadedPreKeyId } = state.creds;
//     const account = JSON.stringify(state.creds.account);
//     const me = JSON.stringify(state.creds.me);
//     const signalIdentities = JSON.stringify(state.creds.signalIdentities);
//     const { lastAccountSyncTimestamp } = state.creds;
//     const { myAppStateKeyId } = state.creds;

//     const auth = await prisma.auth.updateMany({
//       data: {
//         noisekey: noiseKey,
//         signedidentitykey: signedIdentityKey,
//         signedprekey: signedPreKey,
//         registrationid: registrationId,
//         advsecretkey: advSecretKey,
//         nextprekeyid: nextPreKeyId,
//         firstunuploadedprekeyid: firstUnuploadedPreKeyId,
//         account,
//         me,
//         signalidentities: signalIdentities,
//         lastaccountsynctimestamp: lastAccountSyncTimestamp,
//         myappstatekeyid: myAppStateKeyId,
//       },
//     });

//     // not updated. time to insert
//     if (!auth) {
//       console.log("Inserting login data...");
//       const res = await prisma.auth.create({
//         data: {
//           noisekey: noiseKey,
//           signedidentitykey: signedIdentityKey,
//           signedprekey: signedPreKey,
//           registrationid: registrationId,
//           advsecretkey: advSecretKey,
//           nextprekeyid: nextPreKeyId,
//           firstunuploadedprekeyid: firstUnuploadedPreKeyId,
//           account,
//           me,
//           signalidentities: signalIdentities,
//           lastaccountsynctimestamp: lastAccountSyncTimestamp,
//           myappstatekeyid: myAppStateKeyId,
//         },
//       });

//       if (res) {
//         console.log("New login data inserted!");
//         return true;
//       }
//       return false;
//     }
//     console.log("Login data updated!");
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[updateAuth DB]", error, { state });
//     return false;
//   }
// };

// export const deleteAuth = async (): Promise<boolean> => {
//   try {
//     const auth = await prisma.auth.deleteMany();
//     if (auth.count === 0) return false;
//     return true;
//   } catch (error) {
//     await loggerBot(undefined, "[deleteAuth DB]", error, undefined);
//     return false;
//   }
// };
