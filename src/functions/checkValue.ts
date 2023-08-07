export const checkMemberjid = (memberjid: string) => {
  const regex = /\d+@s.whatsapp.net/;

  return regex.test(memberjid);
};

export const checkGroupjid = (groupjid: string) => {
  const regex = /\d+@g.us/;

  return regex.test(groupjid);
};
