import { WAMessage } from "@whiskeysockets/baileys";
import { Bot } from "./Bot";
import { MsgInfoObj } from "./msgInfoObj";

export interface CommandsObj {
  [key: string]: (
    bot: Bot,
    msg: WAMessage,
    msgInfoObj: MsgInfoObj
  ) => Promise<void>;
}
