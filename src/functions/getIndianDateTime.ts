export const getIndianDateTime = (): Date => {
  const dateIndian = new Date().toLocaleString("en-US", {
    timeZone: "Asia/kolkata",
  });

  const date = new Date(dateIndian);

  return date;
};

export const getOldIndianDateTime = (daysSubtract: number): Date => {
  const dateIndian = getIndianDateTime();
  const oldDate = new Date(
    dateIndian.setDate(dateIndian.getDate() - daysSubtract)
  );

  return oldDate;
};
