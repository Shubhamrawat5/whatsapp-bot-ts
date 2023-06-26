export const getRandomFileName = (extension: string) =>
  `${Math.floor(Math.random() * 10000)}${extension}`;
