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
_Restricted command for owner only!_
  
📛 *${PREFIX}test query* ✔
  - _Execute code with whatsapp directly!_

📛 *${PREFIX}broadcast* ✔
  - _Broadcast a message to all groups!_  

📛 *${PREFIX}setlink* ✔
  - _Save all group name & links in DB!_  
  
📛 *${PREFIX}getlink* ✔
    - Get all group name & links from DB!_  

📛 *${PREFIX}websitelink #number* ✔
  - _Enable/Disable group link in website!_ 
Alias: *${PREFIX}wl*

📛 *${PREFIX}groupbackup* ❌
  - _Take backup of group in DB!_  

📛 *${PREFIX}countstats* ❌
  - _Get stats of number of command used!_  

📛 *${PREFIX}tg* ✔
  - _Make TG to WA stickers!_
  @tgstowebpbot <- animated 128px.zip
  @Stickerdownloadbot <- non-animated webp.zip

📛 *${PREFIX}stg* ❌
  - _Stop TG to WA stickers!_
  
📛 *${PREFIX}startvotepvx* ❌
  - _Start vote for all pvx groups!_
  
📛 *${PREFIX}stopvotepvx* ❌
  - _Stop vote for all pvx groups!_

📛 *${PREFIX}donationadd* ✔
  - _add by giving after command #name #amount!_
Alias: *${PREFIX}da*

send ${PREFIX}source for sourcecode of BOT
✔️ more cool commands coming...`;

  await reply(text);
};

const helpo = () => {
  const cmd = ["helpo"];

  return { cmd, handler };
};

export default helpo;
