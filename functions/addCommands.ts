import fs from "fs";
import util from "util";
const readdir = util.promisify(fs.readdir);

export const addCommands = async () => {
  //TODO: CHECK
  interface CommandsObj {
    [key: string]: Function;
  }

  const commandsPublic: CommandsObj = {};
  const commandsMembers: CommandsObj = {};
  const commandsAdmins: CommandsObj = {};
  const commandsOwners: CommandsObj = {};

  let path = __dirname + "/../commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsPublic[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/members/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsMembers[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/admins/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsAdmins[c] = cmdinfo.handler;
      }
    }
  });

  path = __dirname + "/../commands/owner/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
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
