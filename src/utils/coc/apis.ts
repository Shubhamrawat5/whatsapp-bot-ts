/* eslint-disable */
import axios from "axios";
import { ClanDetails, CocPlayer } from "../../interfaces/Coc";
import { isValidTag, resolveTag } from "./helpers";

const clashKingApi = axios.create({
  baseURL: "https://api.clashking.xyz/",
});

const officialCocApi = axios.create({
  baseURL: `https://${atob("Y2xhc2hhcGk=")}.${atob("Y29saW5zY2htYWxl")}.dev/`,
  headers: {
    [atob("QXBpa2V5")]: atob("dkFnZ1huaGZoR2REb1pEbXZiMlVCWlRt"),
  },
});

export const getPlayerDetails = async (tag: string) => {
  const resolvedTag = resolveTag(tag);
  if (!isValidTag(resolvedTag)) {
    return Promise.reject(new Error("Please Enter a Valid Tag"));
  }
  const url = `/v1/players/${resolvedTag.replace("#", "%23")}`;
  const { data } = await officialCocApi.get<CocPlayer>(url);
  return {
    name: data.name,
    clan: {
      name: data.clan.name,
    },
    townHallLevel: data.townHallLevel,
    trophies: data.trophies,
  };
};

export const getPvxClanMembers = async () => {
  const url = "/v1/clans/%232J2U2GGGP";
  const { data } = await officialCocApi.get<ClanDetails>(url);
  return data.memberList.map((member) => ({
    name: member.name,
    tag: member.tag,
    trophies: member.trophies,
    townHallLevel: member.townHallLevel,
    role: member.role,
  }));
};

// getPvxClanMembers()
//   .then((data) => {
//     console.log("SUCCESS", data);
//   })
//   .catch((err) => {
//     console.log("ERROR", err.message);
//   });
