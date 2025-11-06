/* ----------------------------- ADMIN COMMANDS ----------------------------- */
import add from "../commands/admins/add";
import adminlist from "../commands/admins/adminList";
import blacklist from "../commands/admins/blacklist";
import blacklistadd from "../commands/admins/blacklistAdd";
import blacklistremove from "../commands/admins/blacklistRemove";
import disable from "../commands/admins/disable";
import enable from "../commands/admins/enable";
import promote from "../commands/admins/promote";
import demote from "../commands/admins/demote";
// import badgeadd from "../commands/admins/badgeAdd";
// import badgeremove from "../commands/admins/badgeRemove";
import mute from "../commands/admins/mute";
import remove from "../commands/admins/remove";
import rt from "../commands/admins/rt";
import websitelink from "../commands/admins/websiteLink";
// import tagall from "../commands/admins/tagAll";
import unmute from "../commands/admins/unmute";
import warn from "../commands/admins/warn";
import warnclear from "../commands/admins/warnClear";
import warnlist from "../commands/admins/warnList";
import warnlistall from "../commands/admins/warnListAll";
import warnreduce from "../commands/admins/warnReduce";
import setlink from "../commands/admins/setLink";
import today from "../commands/admins/today";
// import expertadd from "../commands/admins/expertAdd";
// import expertremove from "../commands/admins/expertRemove";

/* ----------------------------- MEMBER COMMANDS ---------------------------- */
import ai from "../commands/members/ai";
// import checkvote from "../commands/members/checkVote";
import count from "../commands/members/count";
import gender from "../commands/members/gender";
import horo from "../commands/members/horo";
import image from "../commands/members/image";
import imagesearch from "../commands/members/imageSearch";
import badge from "../commands/members/badge";
import movie from "../commands/members/movie";
import pvxg from "../commands/members/pvxg";
import pvxm from "../commands/members/pvxm";
import pvxstats from "../commands/members/pvxStats";
import pvxt from "../commands/members/pvxt";
import pvxtt from "../commands/members/pvxtt";
import pvxgg from "../commands/members/pvxgg";
import pvxt5 from "../commands/members/pvxt5";
import pvxtm from "../commands/members/pvxtm";
import quote from "../commands/members/quote";
import rank from "../commands/members/rank";
import ranks from "../commands/members/ranks";
import rules from "../commands/members/rules";
// import score from "../commands/members/score";
// import scorecard from "../commands/members/scoreCard";
// import song from "../commands/members/song";
// import startc from "../commands/members/startc";
// import startvote from "../commands/members/startVote";
import stickersearch from "../commands/members/stickerSearch";
import sticker from "../commands/members/sticker";
// import stopvote from "../commands/members/stopVote";
// import tagadmins from "../commands/members/tagAdmins";
// import text from "../commands/members/text";
// import vote from "../commands/members/vote";
import warncheck from "../commands/members/warnCheck";
import yta from "../commands/members/yta";
import ytv from "../commands/members/ytv";
import zero from "../commands/members/zero";
import pvxv from "../commands/members/pvxv";
import technews from "../commands/members/techNews";
// import expert from "../commands/members/expert";
// import tagexpert from "../commands/members/tagExpert";

/* ----------------------------- OWNER COMMANDS ----------------------------- */
import broadcast from "../commands/owner/broadcast";
import donationadd from "../commands/owner/donationAdd";
import getlink from "../commands/owner/getLink";
import badgeaddtext from "../commands/owner/badgeAddText";
import tg from "../commands/owner/tg";

/* ----------------------------- PUBLIC COMMANDS ---------------------------- */
import alive from "../commands/public/alive";
import ask from "../commands/public/ask";
import cricketcommand from "../commands/public/cricketCommand";
import deletee from "../commands/public/delete";
import dev from "../commands/public/dev";
import donation from "../commands/public/donation";
import feedback from "../commands/public/feedback";
import help from "../commands/public/help";
import helpa from "../commands/public/helpa";
import helpo from "../commands/public/helpo";
import link from "../commands/public/link";
import source from "../commands/public/source";
import search from "../commands/public/search";
import steal from "../commands/public/steal";
// import votecommand from "../commands/public/voteCommand";

import bday from "../commands/admins/bday";
import { CommandsObj } from "../interfaces/CommandsObj";
// import addcoctag from "../commands/coc/addCocTag";
// import cocdetails from "../commands/coc/cocDetails";
// import clan from "../commands/coc/clan";
// import tagclan from "../commands/coc/tagClan";
// import clanmembers from "../commands/coc/clanMembers";

const addCommands = async () => {
  const commandsPublic: CommandsObj = {};
  const commandsMembers: CommandsObj = {};
  const commandsAdmins: CommandsObj = {};
  const commandsOwners: CommandsObj = {};

  const publicCommands = [
    alive,
    ask,
    cricketcommand,
    deletee,
    dev,
    donation,
    feedback,
    help,
    helpa,
    helpo,
    link,
    search,
    source,
    steal,
    // votecommand,
  ];

  publicCommands.forEach((command) => {
    const cmdinfo = command(); // {cmd:["",""], handler:function}
    // console.log(cmdinfo.cmd);
    cmdinfo.cmd.forEach((cmd) => {
      commandsPublic[cmd] = cmdinfo.handler;
    });
  });

  const adminCommands = [
    add,
    adminlist,
    bday,
    blacklist,
    blacklistadd,
    blacklistremove,
    disable,
    enable,
    promote,
    demote,
    // badgeadd,
    // badgeremove,
    mute,
    remove,
    rt,
    setlink,
    websitelink,
    // tagall,
    unmute,
    warn,
    warnclear,
    warnlist,
    warnlistall,
    warnreduce,
    // coc
    // addcoctag,
    // tagclan,
    today,
    // expertadd,
    // expertremove,
  ];

  adminCommands.forEach((command) => {
    const cmdinfo = command(); // {cmd:["",""], handler:function}
    // console.log(cmdinfo.cmd);
    cmdinfo.cmd.forEach((cmd) => {
      commandsAdmins[cmd] = cmdinfo.handler;
    });
  });

  const membersCommands = [
    ai,
    // checkvote,
    count,
    gender,
    horo,
    image,
    imagesearch,
    badge,
    movie,
    pvxg,
    pvxm,
    pvxstats,
    pvxt,
    pvxtt,
    pvxgg,
    pvxt5,
    pvxm,
    pvxv,
    pvxtm,
    quote,
    rank,
    ranks,
    rules,
    // score,
    // scorecard,
    // song,
    // startc,
    // startvote,
    sticker,
    stickersearch,
    // stopvote,
    // tagadmins,
    technews,
    // text,
    // vote,
    warncheck,
    yta,
    ytv,
    zero,
    // coc
    // cocdetails,
    // clan,
    // clanmembers,
    // expert,
    // tagexpert,
  ];

  membersCommands.forEach((command) => {
    const cmdinfo = command(); // {cmd:["",""], handler:function}
    // console.log(cmdinfo.cmd);
    cmdinfo.cmd.forEach((cmd) => {
      commandsMembers[cmd] = cmdinfo.handler;
    });
  });

  const ownerCommands = [broadcast, donationadd, getlink, badgeaddtext, tg];

  ownerCommands.forEach((command) => {
    const cmdinfo = command(); // {cmd:["",""], handler:function}
    // console.log(cmdinfo.cmd);
    cmdinfo.cmd.forEach((cmd) => {
      commandsOwners[cmd] = cmdinfo.handler;
    });
  });

  const allCommandsName = [
    ...Object.keys(commandsPublic),
    ...Object.keys(commandsMembers),
    ...Object.keys(commandsAdmins),
    ...Object.keys(commandsOwners),
  ];

  console.log("Commands Added!");

  return {
    commandsPublic,
    commandsMembers,
    commandsAdmins,
    commandsOwners,
    allCommandsName,
  };
};

export default addCommands;
