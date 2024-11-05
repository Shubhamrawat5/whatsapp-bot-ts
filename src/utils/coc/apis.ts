/* eslint-disable */
import axios from "axios";
import { ClanDetails, ClanMember, CocPlayer } from "../../interfaces/Coc";
import { encodeTag, isValidTag, resolveTag } from "./helpers";
import { clashApiUrl, cocApiKey, cocApiUrl } from "../config";
import { mapKeyToValue, pvxClanTag } from "./constants";

const clashKingApi = axios.create({
  baseURL: clashApiUrl,
});

const officialCocApi = axios.create({
  baseURL: cocApiUrl,
  headers: {
    [atob("QXBpa2V5")]: cocApiKey ?? "",
  },
});

const getCurrentPvxWar = async () => {
  const { data } = await clashKingApi.get(
    `v1/clans/${pvxClanTag}/currentwar/leaguegroup`
  );
  return data.rounds;
};

export const getPlayerDetails = async (tag: string) => {
  const resolvedTag = resolveTag(tag);
  if (!isValidTag(resolvedTag)) {
    return Promise.reject(new Error("Please Enter a Valid Tag"));
  }

  const { data } = await officialCocApi.get<CocPlayer>(
    `/v1/players/${encodeTag(resolvedTag)}`
  );
  return {
    name: data.name,
    clan: {
      name: data.clan?.name || "None",
    },
    townHallLevel: data.townHallLevel,
    trophies: data.trophies,
  };
};

export const getPvxClanDetails = async () => {
  const { data } = await officialCocApi.get<ClanDetails>(
    `/v1/clans/${pvxClanTag}`
  );
  return {
    currentMembersCount: data.memberList.length,
    joinType: mapKeyToValue[data.type],
    ...data,
  };
};

export const getPvxClanMembers = async () => {
  const { data } = await officialCocApi.get<{
    items: ClanMember[];
  }>(`/v1/clans/${encodeTag(pvxClanTag)}/members`);

  return data.items;
};

export const getPvxWarParticipants = async () => {
  const { data } = await clashKingApi.get<ClanDetails>(
    `v1/clanwarleagues/wars/${encodeTag(pvxClanTag)}`
  );
  return data;
};

// getPvxWarParticipants()
//   .then((data) => {
//     console.log("SUCCESS", data);
//   })
//   .catch((err) => {
//     console.log("ERROR", err.message);
//   });
