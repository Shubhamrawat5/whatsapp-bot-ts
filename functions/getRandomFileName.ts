export const getRandomFileName = (extension: string) => {
  return `${Math.floor(Math.random() * 10000)}${extension}`;
};
