import fs from "fs";
import util from "util";
import { Bot } from "../interface/Bot";
import { MsgInfoObj } from "../interface/msgInfoObj";
import { WAMessage } from "@adiwajshing/baileys";
const readdir = util.promisify(fs.readdir);

export const addCommands = async () => {
  interface CommandsObj {
    [key: string]: (
      bot: Bot,
      msg: WAMessage,
      msgInfoObj: MsgInfoObj
    ) => Promise<void>;
  }

  const commandsPublic: CommandsObj = {};
  const commandsMembers: CommandsObj = {};
  const commandsAdmins: CommandsObj = {};
  const commandsOwners: CommandsObj = {};

  let path = __dirname + "/../commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".ts")) {
      const { command } = require(path + file);
      const cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (const c of cmdinfo.cmd) {
        commandsPublic[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/members/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".ts")) {
      const { command } = require(path + file);
      const cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (const c of cmdinfo.cmd) {
        commandsMembers[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/admins/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".ts")) {
      const { command } = require(path + file);
      const cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (const c of cmdinfo.cmd) {
        commandsAdmins[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/owner/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".ts")) {
      const { command } = require(path + file);
      const cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (const c of cmdinfo.cmd) {
        commandsOwners[c] = cmdinfo.handler;
      }
    }
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
