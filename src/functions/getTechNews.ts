import axios from "axios";

const getTechNews = async () => {
  try {
    const url = "https://pvx-api-vercel.vercel.app/api/news";
    const { data } = await axios.get(url);

    let msg = `☆☆☆💥 Tech News 💥☆☆☆`;
    const { inshorts } = data;
    let count = 0; // for first 14 news only
    for (let i = 0; i < inshorts.length; ++i) {
      count += 1;
      if (count === 15) break;
      msg += `\n\n🌐 ${inshorts[i]}`;
    }
    msg += `\n\njoin t.me/pvxtechnews for daily tech news!`;
    return msg;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      err.toString();
    }
    return "❌ UNKNOWN ERROR !!";
  }
};

export default getTechNews;
