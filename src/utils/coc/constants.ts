import { encodeTag } from "./helpers";

/* eslint-disable */

export const pvxClanTag = encodeTag("#2J2U2GGGP");

export const mapKeyToValue: Record<string, string> = new Proxy(
  {
    inviteOnly: "Invite only",
    closed: "Closed",
    open: "Anyone can join",
  },
  {
    get: (target, key) => {
      const value = target[key as keyof typeof target];
      if (!value) {
        return key;
      }
      return value;
    },
  }
);
