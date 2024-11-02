import axios from "axios";

const clashKingApi = axios.create({
  baseURL: "https://api.clashofclans.com/v1",
});

export const getPlayerDetails = async (tag: string) => {
  // TODO: get data from api
  return {
    name: "playerDetails",
    clan: {
      name: "PVX Community",
    },
    townHallLevel: 10,
    trophies: 1000,
  };
  // const response = await clashKingApi.get(`/players/${tag}`);
  // return response.data;
};
