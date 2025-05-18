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
📛 *${PREFIX}sticker*
- _Create sticker from media!_
  Alias: *${PREFIX}s*
  
📛 *${PREFIX}sticker crop*
  - _Create full size sticker from media!_
  Alias: *${PREFIX}s c*

📛 *${PREFIX}text*
  - _Create sticker from text!_

📛 *${PREFIX}image*
  - _Create image from sticker!_

📛 *${PREFIX}expert*
  - _Get experts list in group!_

📛 *${PREFIX}tagexpert*
  - _Tag experts in group!_

📛 *${PREFIX}ai*
  - _Ask questions to AI!_
  
📛 *${PREFIX}imagesearch*
  - _Search image from any name!_
  Alias: *${PREFIX}is*
  
📛 *${PREFIX}searchsearch*
  - _Search sticker from any name!_
  Alias: *${PREFIX}ss*

📛 *${PREFIX}insta url* 
  - _Download instagram posts!_
  Alias: *${PREFIX}i url*📛

📛 *${PREFIX}tagadmins*
  - _Tag all the admins!_
  Alias: *${PREFIX}ta*

📛 *${PREFIX}rank*
  - _Know your message count & rank in all PVX groups!_
  
📛 *${PREFIX}ranks*
  - _Know ranks list of PVX groups!_

📛 *${PREFIX}count*
  - _Know your message stats in all PVX groups!_

📛 *${PREFIX}today*
  - _Get today's stats of PVX!_
  
📛 *${PREFIX}ytv url*
  - _Youtube videos downloader!_

📛 *${PREFIX}yta url*
  - _Youtube audio downloader!_

📛 *${PREFIX}steal*
  - _Change sticker name to PVX BOT!_

📛 *${PREFIX}song name*
  - _Get songs in good quality!_
  [Better use ${PREFIX}yta command to download correct song from youtube]

📛 *${PREFIX}alive*
  - _Check if bot is ON or OFF!_
  Alias: *${PREFIX}a*

📛 *${PREFIX}horo name*
  - _Check today's horoscope!_

📛 *${PREFIX}pvxg*
  - _Get stats of all groups message!_

📛 *${PREFIX}pvxgg*
  - _Get stats of all groups message this month!_
  
📛 *${PREFIX}pvxm*
  - _Get stats of member messages of current group!_
  
📛 *${PREFIX}pvxt <number>*
  - _Get top member stats of all groups!_

📛 *${PREFIX}pvxtt <number>*
  - _Get top member stats of all groups this month!_

📛 *${PREFIX}pvxtm*
  - _Get stats of members with rank of current group!_

📛 *${PREFIX}pvxt5*
  - _Get top 5 member stats of all groups!_

📛 *${PREFIX}zero*
  - _Get numbers with 0 message of current group!_
  
📛 *${PREFIX}pvxstats*
  - _Get stats of PVX groups!_

📛 *${PREFIX}cricketcommand*
  - _To get command details of cricket!_
  Alias: *${PREFIX}cc*

📛 *${PREFIX}votecommand*
  - _To get command details of voting!_
  Alias: *${PREFIX}vc*

📛 *${PREFIX}quote*
  - _Give a random quote!_

📛 *${PREFIX}gender firstname*
  - _Get gender from person first name!_
    
📛 *${PREFIX}technews*
  - _Get latest Tech news from inshorts !_ 

📛 *${PREFIX}pvxlink*
  - _Get links for all PVX groups!_
  Alias: *${PREFIX}link*

📛 *${PREFIX}donation*
  - _Get donation details and help PVX community!_

📛 *${PREFIX}feedback*
  - _Get feedback form!_

📛 *${PREFIX}rules*
  - _Get PVX groups rules!_
  Alias: *${PREFIX}r*

📛 *${PREFIX}source*
  - _Get bot source code!_

📛 *${PREFIX}dev*
  - _Get dev contact to report bug or to add new feature!_

📛 *${PREFIX}help*
  - _To get list of public commands!_

📛 *${PREFIX}helpa*
  - _To get list of admin commands!_

📛 *${PREFIX}helpo*
  - _To get list of owner commands!_

send ${PREFIX}source for sourcecode of BOT
✔️ more cool commands coming...`;

  await reply(text);
};

const help = () => {
  const cmd = ["help", "menu", "list"];

  return { cmd, handler };
};

export default help;
