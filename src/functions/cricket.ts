import axios from "axios";

// return object {message:"", info:""} =>
// message having score and info having extra info about game like inning over, game over etc
// INFO KEY: "MO" when match over, "IO" when inning over, "ER" when error
// const getCricketScore = async (matchID) => {

export const getCricketScore = async (matchID: string) => {
  interface Res {
    message: string;
    info: string;
  }

  const res: Res = { message: "", info: "" };
  try {
    // TODO: MAKE INTERFACE OF DATA
    let { data } = await axios.get(
      `https://testing-nine-theta.vercel.app/score?url=https://www.cricbuzz.com/live-cricket-scores/${matchID}`
    );

    if (typeof data === "string") {
      console.log(data);
      res.message = `${data}\nCheck the match ID in description!!`;
      res.info = "ER";
      return res;
    }

    let { title } = data;
    title = title.slice(0, title.search(","));
    const score = data.current;
    const { runrate } = data;
    const { lastwicket } = data;
    let { recentballs } = data;
    const currentBatsman = data.batsman.slice(0, -1);
    const { bowler } = data;
    const { bowlerover } = data;
    const { bowlerruns } = data;
    const { bowlerwickets } = data;
    if (recentballs === "Data Not Found") recentballs = data.lastwicket;

    const d = await axios.get(
      `https://cric-score.skdev.one/scorecard/${matchID}`
    );
    data = d.data;

    let batsman1 = "out ho gaya";
    let batsman2 = "out ho gaya";
    let currentInning;
    let alt = true;
    let firstInningRuns;
    let firstInningTeam;
    const { update } = data.result;
    let message = "";

    let isMatchStarted = false;
    if (Object.keys(data.Innings1[2]).length !== 0) isMatchStarted = true;
    if (!isMatchStarted) {
      // title and update only
      message += `*${title}*\n`;
      message += `\n${update}`;
      res.message = message;
      return res;
    }

    if (Object.keys(data.Innings2[2]).length === 0) {
      currentInning = "Innings1";
    } else {
      currentInning = "Innings2";
      firstInningRuns = `${data.Innings1[2].runs}/${data.Innings1[2].wickets}`;
      firstInningTeam = data.Innings1[2].team
        .match(/(\b\S)?/g)
        .join("")
        .toUpperCase();
      if (firstInningTeam.length <= 1) firstInningTeam = data.Innings1[2].team;
    }

    let isInningOver = false;

    // inning over or not
    if (update === "innings break") {
      res.info = "IO";
      isInningOver = true;
    }

    // find playing 2 batsman
    data[currentInning][0].Batsman.forEach((batsman: any) => {
      if (batsman.dismissal === "batting") {
        if (alt) {
          let batsmanName = batsman.name;
          if (batsmanName.search(/\(/) !== -1) {
            batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
          }
          batsmanName += batsmanName === currentBatsman ? "*" : ""; // add * to playing batmsan
          batsman1 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
          alt = false;
        } else {
          let batsmanName = batsman.name;
          if (batsmanName.search(/\(/) !== -1) {
            batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
          }
          batsmanName += batsmanName === currentBatsman ? "*" : ""; // add * to playing batmsan
          batsman2 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
        }
      }
    });

    // is match over?
    if (data.result.winning_team !== "Not Completed") {
      res.info = "MO";
    }

    if (batsman1 === batsman2) batsman1 = batsman2 = "";

    /* MESSAGE :-
    Royal Challengers Bangalore vs Chennai Super Kings

    RCB - 156/6
    CSK - 19/0 (2.1) CRR: 8.77

    🏏 Ruturaj Gaikwad: 11 (7)
    🏏 Faf du Plessis: 11 (11)

    ⚾ Mohammed Siraj* 9-0 (1.1)

    recent balls
    ... 0 1 4 1 1 | 0 6 L1 1 2 0 | 1
    Last Wicket: example 22 (20)
    chennai super kings need 134 runs
    */

    // title
    message += `*${title}*\n`;

    // first inning info
    message += firstInningRuns
      ? `\n${`${firstInningTeam} - ${firstInningRuns}`}`
      : "";

    // current inning info
    message += `\n${score} ${runrate}`;

    // bowler and last wicket info | isInningOver (when inning over) - "out of gya" , "data not found" comes!
    message +=
      isInningOver || res.info === "MO"
        ? ""
        : `\n\n🏏 ${batsman1} \n🏏 ${batsman2}\n
⚾ ${bowler} ${bowlerruns}-${bowlerwickets} (${bowlerover})
${batsman2 === "out ho gaya" ? `\nLast Wicket: ${lastwicket}\n` : ""}
_recent balls_ \n${recentballs}`;

    // match update
    message +=
      currentInning === "Innings2" || isInningOver ? `\n\n${update}` : "";

    res.message = message;
  } catch (err) {
    console.log(err);
    res.message = (err as Error).toString();
    res.info = "ER";
  }

  // console.log(res);
  return res;
};

// getCricketScore(66369);

// const getScoreCard = async (matchID) => {
export const getScoreCard = async (matchID: string) => {
  try {
    const { data } = await axios.get(
      `https://cric-score.skdev.one/scorecard/${matchID}`
    );
    let firstInningTeam = "";
    let secondInningTeam = "";
    let firstInningTeamScore = "";
    let secondInningTeamScore = "";
    firstInningTeam = data.Innings1[2].team;
    firstInningTeamScore = data.Innings1[2].score;
    let message = `*${firstInningTeam} 🏏*\nscore: ${firstInningTeamScore}\n`;
    if (Object.keys(data.Innings2[2]).length) {
      secondInningTeam = data.Innings2[2].team;
      secondInningTeamScore = data.Innings2[2].score;
    }

    data.Innings1[0].Batsman.forEach((player: any) => {
      message += `\n${player.runs} (${player.balls}) : ${player.name}`;
      if (player.dismissal == "batting") message += `*`;
    });

    if (secondInningTeam) {
      message += `\n\n*${secondInningTeam} 🏏*\nscore: ${secondInningTeamScore}\n`;
      data.Innings2[0].Batsman.forEach((player: any) => {
        message += `\n${player.runs} (${player.balls}) : ${player.name}`;
        if (player.dismissal == "batting") message += `*`;
      });
    }
    // console.log(message);
    return message;
  } catch (err) {
    console.log(err);
    return (err as Error).toString();
  }
};

// getCricketScore(66204);
// getScoreCard(66204);
