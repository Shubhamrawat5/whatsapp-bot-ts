import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const text = `*─「 🔥 <{PVX}> BOT 🔥 」─*
  ${readMore}
📛 *${prefix}sticker*
- _Create sticker from media!_
  Alias: *${prefix}s*
  
📛 *${prefix}sticker crop*
  - _Create full size sticker from media!_
  Alias: *${prefix}s c*

📛 *${prefix}text*
  - _Create sticker from text!_

📛 *${prefix}image*
  - _Create image from sticker!_

📛 *${prefix}ai*
  - _Ask questions to AI!_
  
📛 *${prefix}imagesearch*
  - _Search image from any name!_
  Alias: *${prefix}is*
  
📛 *${prefix}searchsearch*
  - _Search sticker from any name!_
  Alias: *${prefix}ss*

📛 *${prefix}insta url* 
  - _Download instagram posts!_
  Alias: *${prefix}i url*📛

📛 *${prefix}tagadmins*
  - _Tag all the admins!_
  Alias: *${prefix}ta*

📛 *${prefix}rank*
  - _Know your message count & rank in all PVX groups!_
  
📛 *${prefix}ranks*
  - _Know ranks list of PVX groups!_

📛 *${prefix}count*
  - _Know your message stats in all PVX groups!_

📛 *${prefix}today*
  - _Get today's stats of PVX!_
  
📛 *${prefix}ytv url*
  - _Youtube videos downloader!_

📛 *${prefix}yta url*
  - _Youtube audio downloader!_

📛 *${prefix}steal*
  - _Change sticker name to PVX BOT!_

📛 *${prefix}song name*
  - _Get songs in good quality!_
  [Better use ${prefix}yta command to download correct song from youtube]

📛 *${prefix}alive*
  - _Check if bot is ON or OFF!_
  Alias: *${prefix}a*

📛 *${prefix}horo name*
  - _Check today's horoscope!_

📛 *${prefix}pvxg*
  - _Get stats of all groups message!_

📛 *${prefix}pvxgg*
  - _Get stats of all groups message this month!_
  
📛 *${prefix}pvxm*
  - _Get stats of member messages of current group!_
  
📛 *${prefix}pvxt <number>*
  - _Get top member stats of all groups!_

📛 *${prefix}pvxtt <number>*
  - _Get top member stats of all groups this month!_

📛 *${prefix}pvxtm*
  - _Get stats of members with rank of current group!_

📛 *${prefix}pvxt5*
  - _Get top 5 member stats of all groups!_

📛 *${prefix}zero*
  - _Get numbers with 0 message of current group!_
  
📛 *${prefix}pvxstats*
  - _Get stats of PVX groups!_

📛 *${prefix}cricketcommand*
  - _To get command details of cricket!_
  Alias: *${prefix}cc*

📛 *${prefix}votecommand*
  - _To get command details of voting!_
  Alias: *${prefix}vc*

📛 *${prefix}quote*
  - _Give a random quote!_

📛 *${prefix}gender firstname*
  - _Get gender from person first name!_
    
📛 *${prefix}technews*
  - _Get latest Tech news from inshorts !_ 

📛 *${prefix}pvxlink*
  - _Get links for all PVX groups!_
  Alias: *${prefix}link*

📛 *${prefix}donation*
  - _Get donation details and help PVX community!_

📛 *${prefix}feedback*
  - _Get feedback form!_

📛 *${prefix}rules*
  - _Get PVX groups rules!_
  Alias: *${prefix}r*

📛 *${prefix}source*
  - _Get bot source code!_

📛 *${prefix}dev*
  - _Get dev contact to report bug or to add new feature!_

📛 *${prefix}help*
  - _To get list of public commands!_

📛 *${prefix}helpa*
  - _To get list of admin commands!_

📛 *${prefix}helpo*
  - _To get list of owner commands!_

send ${prefix}source for sourcecode of BOT
✔️ more cool commands coming...`;

  await reply(text);
};

const help = () => {
  const cmd = ["help", "menu", "list"];

  return { cmd, handler };
};

export default help;
