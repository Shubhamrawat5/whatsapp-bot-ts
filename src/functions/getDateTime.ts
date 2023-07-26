export const getCurrentIndianDate = (): string => {
  // 'DD/MM/YYYY'
  const date = new Date().toLocaleDateString("en-GB", {
    timeZone: "Asia/kolkata",
  });

  return date;
};

export const getCurrentIndianTime = (): string => {
  // 'HH:MM:SS'
  const time = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/kolkata",
  });

  return time;
};

export const getCurrentIndianDateDbFormat = (): string => {
  // 'YYYY-MM-DD'
  const date = getCurrentIndianDate();
  const dateArr = date.split("/");
  [dateArr[0], dateArr[2]] = [dateArr[2], dateArr[0]];

  const dateDbFormat = dateArr.join("-");

  return dateDbFormat;
};
