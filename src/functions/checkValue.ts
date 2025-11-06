export const checkMemberjid = (memberjid: string) => {
  const regex = /\d+@s.whatsapp.net/;

  return regex.test(memberjid);
};

export const checkMemberlid = (memberlid: string) => {
  const regex = /\d+@lid/;

  return regex.test(memberlid);
};

export const checkGroupjid = (groupjid: string) => {
  const regex = /\d+@g.us/;

  return regex.test(groupjid);
};
