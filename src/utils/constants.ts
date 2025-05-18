export interface Pvxgroups {
  pvxcommunity: string;
  pvxprogrammer: string;
  pvxadmin: string;
  pvxsubadmin: string;
  pvxstudy: string;
  pvxmano: string;
  pvxfood: string;
  pvxanime: string;
  pvxtech: string;
  pvxtechonly: string;
  pvxsport: string;
  pvxmovies: string;
  pvxsticker: string;
  pvxstickeronly1: string;
  pvxstickeronly2: string;
  pvxdeals: string;
  pvxgaming: string;
  pvxmemes: string;
  pvxkrypto: string;
  pvxbotcommands: string;
  pvxtesting: string;
  pvxfitness: string;
  pvxjobupdates: string;
  pvxtravellers: string;
}

export const pvxgroups: Pvxgroups = {
  pvxcommunity: "919557666582-1467533860@g.us",
  pvxprogrammer: "919557666582-1584193120@g.us",
  pvxadmin: "919557666582-1498394056@g.us",
  pvxsubadmin: "120363049192218305@g.us",
  pvxstudy: "919557666582-1617595892@g.us",
  pvxmano: "19016677357-1630334490@g.us",
  pvxfood: "120363039452453480@g.us",
  pvxanime: "919557666582-1556821647@g.us",
  pvxtech: "919557666582-1551290369@g.us",
  pvxtechonly: "919557666582-1548337792@g.us",
  pvxsport: "919557666582-1559476348@g.us",
  pvxmovies: "919557666582-1506690003@g.us",
  pvxsticker: "919557666582-1580308963@g.us",
  pvxstickeronly1: "919557666582-1628610549@g.us",
  pvxstickeronly2: "919557666582-1586018947@g.us",
  pvxdeals: "919557666582-1582555632@g.us",
  pvxgaming: "17028054150-1608057174@g.us",
  pvxmemes: "919557666582-1551346051@g.us",
  pvxkrypto: "120363329317457388@g.us",
  pvxbotcommands: "919675642959-1606755119@g.us",
  pvxtesting: "120363189969342767@g.us",
  pvxfitness: "120363166048344466@g.us",
  pvxjobupdates: "120363141318508852@g.us",
  pvxtravellers: "120363418521437326@g.us",
};

export const pvxgroupsList = Object.values(pvxgroups);

export const PREFIX = "!";
export const useStore = false;

export const PACK_NAME = "BOT 🤖";
export const AUTHOR_NAME = "pvxcommunity.com";

export const stats = {
  started: "",
  totalMessages: 0,
  textMessage: 0,
  stickerMessage: 0,
  imageMessage: 0,
  videoMessage: 0,
  documentMessage: 0,
  otherMessage: 0,
  commandExecuted: 0,
  stickerForwarded: 0,
  stickerNotForwarded: 0,
  memberJoined: 0,
  memberLeft: 0,
};
