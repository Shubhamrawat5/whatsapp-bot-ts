import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { PREFIX } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const text = `*─「 🔥 <{PVX}> BOT 🔥 」─*
  ${readMore}
_Admin commands only!_

📛 *${PREFIX}add <phone number>*
  - _Add new member!_
 [or tag message of removed member with *${PREFIX}add*]
 
📛 *${PREFIX}kick <mention>*
  - _Kick member from group!_
 [or tag message of member with *${PREFIX}kick*]

📛 *${PREFIX}expertadd <phone number>*
  - _Add new expert in group!_

📛 *${PREFIX}expertremove <phone number>*
  - _Remove expert frpm group!_

📛 *${PREFIX}mute | ${PREFIX}unmute*
  - _Mute and Unmute the group!_

📛 *${PREFIX}delete*
  - _Delete anyone message!_
Alias: *${PREFIX}d*

📛 *${PREFIX}tagall* 
  - _Tag all the members!_  
Alias: *${PREFIX}tagallhidden*

📛 *${PREFIX}disable <command>*
  - _Disable command for current group!_

📛 *${PREFIX}enable <command>*
  - _Enable command for current group!_

📛 *${PREFIX}promote <mention>*
  - _Promote to admin!_

📛 *${PREFIX}demote <mention>*
  - _Demote from admin!_

📛 *${PREFIX}rt*
  - _Tag a random member!_  

📛 *${PREFIX}bday*
  - _Check today's birthday!_  

📛 *${PREFIX}warning*
  - _Give warning to user!_
Alias: *${PREFIX}warn*

📛 *${PREFIX}warninglist*
  - _Check warning of all members!_
Alias: *${PREFIX}warnlist*

📛 *${PREFIX}warningreduce*
  - Reduce warning to user!_
Alias: *${PREFIX}warnreduce*

📛 *${PREFIX}warningclear*
  - _Clear all warning to user!_
Alias: *${PREFIX}warnclear*

📛 *${PREFIX}warningcheck*
  - Check warning to user!_
Alias: *${PREFIX}warncheck*

📛 *${PREFIX}blacklist*
  - _Get blacklist numbers!_ 

📛 *${PREFIX}blacklistadd*
  - _Add number to blacklist!_
Alias: *${PREFIX}bla*

📛 *${PREFIX}blacklistremove*
  - Remove number from blacklist!_  
Alias: *${PREFIX}blr*

send ${PREFIX}source for sourcecode of BOT
✔️ more cool commands coming...`;

  await reply(text);
};

const helpa = () => {
  const cmd = ["helpa"];

  return { cmd, handler };
};

export default helpa;
