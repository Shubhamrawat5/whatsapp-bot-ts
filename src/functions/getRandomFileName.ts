const getRandomFileName = (extension: string) => {
  const random = Math.floor(Math.random() * 10000);

  return `${random}${extension}`;
};

export default getRandomFileName;
