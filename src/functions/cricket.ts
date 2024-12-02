import axios from "axios";

// https://github.com/rsumit123/ipl_live
// `https://cric-score.skdev.one/scorecard/${matchID}`

// https://github.com/mskian/cricket-api-nodejs
// `https://cricket-api-nodejs-five.vercel.app/score?url=https://www.cricbuzz.com/live-cricket-scores/${matchID}`

// interface Batsman {
//   balls: string;
//   dismissal: string;
//   fours: string;
//   name: string;
//   runs: string;
//   sixes: string;
//   sr: string;
// }

// interface Bowlers {
//   economy: string;
//   maidens: string;
//   name: string;
//   overs: string;
//   runs: string;
//   wicket: string;
// }

// interface MatchInfo {
//   overs: string;
//   runs: number;
//   score: string;
//   team: string;
//   wickets: number;
// }

// type Innings = [{ Batsman: Batsman[] }, { Bowlers: Bowlers[] }, MatchInfo];

// interface PlayingEleven {
//   [key: string]: string;
// }

// interface Result {
//   update: string;
//   winning_margin: string;
//   winning_team: string;
// }

// interface TossResult {
//   chose_to: string;
//   update: string;
//   winning_team: string;
// }

// interface CricScore {
//   Innings1: Innings;
//   Innings2: Innings;
//   playing_eleven: PlayingEleven;
//   result: Result;
//   toss_result: TossResult;
// }

// interface CricketApiNodejs {
//   title: string;
//   update: string;
//   current: string;
//   batsman: string;
//   batsmanrun: string;
//   ballsfaced: string;
//   fours: string;
//   sixes: string;
//   sr: string;
//   batsmantwo: string;
//   batsmantworun: string;
//   batsmantwoballsfaced: string;
//   batsmantwofours: string;
//   batsmantwosixes: string;
//   batsmantwosr: string;
//   bowler: string;
//   bowlerover: string;
//   bowlerruns: string;
//   bowlerwickets: string;
//   bowlermaiden: string;
//   bowlertwo: string;
//   bowletworover: string;
//   bowlertworuns: string;
//   bowlertwowickets: string;
//   bowlertwomaiden: string;
//   partnership: string;
//   recentballs: string;
//   lastwicket: string;
//   runrate: string;
//   commentary: string;
// }

// // return object {message:"", info:""} =>
// // message having score and info having extra info about game like inning over, game over etc
// // INFO KEY: "MO" when match over, "IO" when inning over, "ER" when error
// // const getCricketScore = async (matchID) => {
// export const getCricketScore = async (matchID: string) => {
//   interface Res {
//     message: string;
//     info: string;
//   }

//   const res: Res = { message: "", info: "" };
//   try {
//     const { data } = await axios.get<CricketApiNodejs>(
//       `https://cricket-api-nodejs-five.vercel.app/score?url=https://www.cricbuzz.com/live-cricket-scores/${matchID}`
//     );

//     if (typeof data === "string") {
//       res.message = `${data}\nCheck the match ID in description!!`;
//       res.info = "ER";
//       return res;
//     }

//     let { title } = data;
//     title = title.slice(0, title.search(","));
//     const score = data.current;
//     const { runrate } = data;
//     const { lastwicket } = data;
//     let { recentballs } = data;
//     const currentBatsman = data.batsman.slice(0, -1);
//     const { bowler } = data;
//     const { bowlerover } = data;
//     const { bowlerruns } = data;
//     const { bowlerwickets } = data;
//     if (recentballs === "Data Not Found") recentballs = data.lastwicket;

//     const d = await axios.get<CricScore>(
//       `https://cric-score.skdev.one/scorecard/${matchID}`
//     );
//     const cricScore = d.data;

//     let batsman1 = "out ho gaya";
//     let batsman2 = "out ho gaya";
//     let currentInning: "Innings1" | "Innings2";
//     let alt = true;
//     let firstInningRuns: string;
//     let firstInningTeam: string | undefined;
//     const { update } = cricScore.result;
//     let message = "";

//     let isMatchStarted = false;
//     if (Object.keys(cricScore.Innings1[2]).length !== 0) isMatchStarted = true;

//     // check if match started
//     if (!isMatchStarted) {
//       message += `*${title}*\n`;
//       message += `\n${update}`;
//       res.message = message;
//       return res;
//     }

//     // check if its innings 1 or innings 2
//     if (Object.keys(cricScore.Innings2[2]).length === 0) {
//       currentInning = "Innings1";
//       firstInningRuns = "";
//     } else {
//       currentInning = "Innings2";
//       firstInningRuns = `${cricScore.Innings1[2].runs}/${cricScore.Innings1[2].wickets}`;
//       firstInningTeam = cricScore.Innings1[2].team
//         .match(/(\b\S)?/g)
//         ?.join("")
//         .toUpperCase();

//       if (firstInningTeam && firstInningTeam.length <= 1) {
//         firstInningTeam = cricScore.Innings1[2].team;
//       }
//     }

//     let isInningOver = false;

//     // inning over or not
//     if (update === "innings break") {
//       res.info = "IO";
//       isInningOver = true;
//     }

//     // find playing 2 batsman
//     cricScore[currentInning][0].Batsman.forEach((batsman) => {
//       if (batsman.dismissal === "batting") {
//         if (alt) {
//           let batsmanName = batsman.name;
//           if (batsmanName.search(/\(/) !== -1) {
//             batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
//           }
//           batsmanName += batsmanName === currentBatsman ? "*" : ""; // add * to playing batmsan
//           batsman1 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
//           alt = false;
//         } else {
//           let batsmanName = batsman.name;
//           if (batsmanName.search(/\(/) !== -1) {
//             batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
//           }
//           batsmanName += batsmanName === currentBatsman ? "*" : ""; // add * to playing batmsan
//           batsman2 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
//         }
//       }
//     });

//     // is match over?
//     if (cricScore.result.winning_team !== "Not Completed") {
//       res.info = "MO";
//     }

//     if (batsman1 === batsman2) {
//       batsman1 = "";
//       batsman2 = "";
//     }

//     /* MESSAGE :-
//     Royal Challengers Bangalore vs Chennai Super Kings

//     RCB - 156/6
//     CSK - 19/0 (2.1) CRR: 8.77

//     🏏 Ruturaj Gaikwad: 11 (7)
//     🏏 Faf du Plessis: 11 (11)

//     ⚾ Mohammed Siraj* 9-0 (1.1)

//     recent balls
//     ... 0 1 4 1 1 | 0 6 L1 1 2 0 | 1
//     Last Wicket: example 22 (20)
//     chennai super kings need 134 runs
//     */

//     // title
//     message += `*${title}*\n`;

//     // first inning info
//     message += firstInningRuns
//       ? `\n${`${firstInningTeam} - ${firstInningRuns}`}`
//       : "";

//     // current inning info
//     message += `\n${score} ${runrate}`;

//     // bowler and last wicket info | isInningOver (when inning over)
//     // - "out of gya" , "data not found" comes!
//     message +=
//       isInningOver || res.info === "MO"
//         ? ""
//         : `\n\n🏏 ${batsman1} \n🏏 ${batsman2}\n
// ⚾ ${bowler} ${bowlerruns}-${bowlerwickets} (${bowlerover})
// ${batsman2 === "out ho gaya" ? `\nLast Wicket: ${lastwicket}\n` : ""}
// _recent balls_ \n${recentballs}`;

//     // match update
//     message +=
//       currentInning === "Innings2" || isInningOver ? `\n\n${update}` : "";

//     res.message = message;
//   } catch (err) {
//     console.log(err);
//     if (err instanceof Error) {
//       res.message = err.toString();
//     }
//     res.info = "ER";
//   }

//   return res;
// };

// const getScoreCard = async (matchID) => {

/* --------------------------------- NEW API -------------------------------- */
interface Batsman {
  Batsman: {
    balls: string;
    dismissal: string;
    fours: string;
    name: string;
    runs: string;
    sixes: string;
    sr: string;
  }[];
}

interface Bowler {
  Bowler: {
    economy: string;
    maidens: string;
    name: string;
    overs: string;
    runs: string;
    wicket: string;
  }[];
}

interface MatchDetails {
  overs: string;
  runs: number;
  score: string;
  team: string;
  wickets: number;
}

interface Innings {
  0: Batsman; // Batsman array at index 0
  1: Bowler; // Bowler array at index 1
  2: MatchDetails; // Match details object at index 2
}

interface PlayingEleven {
  [key: string]: string[];
}

interface MatchResult {
  update: string;
  winning_margin: string;
  winning_team: string;
}

interface TossResult {
  chose_to: string;
  update: string;
  winning_team: string;
}

interface ScoreData {
  Innings1: Innings;
  Innings2: Innings;
  playing_eleven: PlayingEleven;
  result: MatchResult;
  toss_result: TossResult;
}

export const getScoreCard = async (matchID: string): Promise<string> => {
  try {
    const res = await axios.get<ScoreData>(
      `https://cric-score.skdev.one/scorecard/${matchID}`
    );
    const cricScore = res.data;
    const firstInningTeam = cricScore.Innings1[2].team;
    let secondInningTeam = "";
    const firstInningTeamScore = cricScore.Innings1[2].score;
    let secondInningTeamScore = "";
    let message = `*${firstInningTeam} 🏏*\nscore: ${firstInningTeamScore}\n`;
    // scores of first innings team
    cricScore.Innings1[0].Batsman.forEach((player) => {
      message += `\n${player.runs} (${player.balls}) : ${player.name}`;
      if (player.dismissal === "batting") message += `*`;
    });
    // checking if second innings done
    if (Object.keys(cricScore.Innings2[2]).length) {
      secondInningTeam = cricScore.Innings2[2].team;
      secondInningTeamScore = cricScore.Innings2[2].score;
    }
    // scores of second innings team if done
    if (secondInningTeam) {
      message += `\n\n*${secondInningTeam} 🏏*\nscore: ${secondInningTeamScore}\n`;
      cricScore.Innings2[0].Batsman.forEach((player) => {
        message += `\n${player.runs} (${player.balls}) : ${player.name}`;
        if (player.dismissal === "batting") message += `*`;
      });
    }
    console.log(message);
    return message;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return err.toString();
    }
    return "❌ UNKNOWN ERROR !!";
  }
};

// getCricketScore(66204);
// getScoreCard("66204");

export const getCricketScore = async (matchID: string) => {
  try {
    const { data } = await axios.get<ScoreData>(
      `https://cric-score.skdev.one/scorecard/${matchID}`
    );

    const team1 = data.Innings1[2].team;
    const team2 = data.Innings2[2].team;

    const team1Score = data.Innings1[2].score;
    const team2Score = data.Innings2[2].score;

    const resultUpdate = data.result.update;

    const message = `${team1} - ${team1Score}
${team2} - ${team2Score}

${resultUpdate}`;

    console.log(message);
    return message;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return err.toString();
    }
  }

  return "Something went wrong!";
};

// getCricketScore("109614");

/* MESSAGE :-
//     Royal Challengers Bangalore vs Chennai Super Kings

//     RCB - 156/6
//     CSK - 19/0 (2.1) CRR: 8.77

//     🏏 Ruturaj Gaikwad: 11 (7)
//     🏏 Faf du Plessis: 11 (11)

//     ⚾ Mohammed Siraj* 9-0 (1.1)

//     recent balls
//     ... 0 1 4 1 1 | 0 6 L1 1 2 0 | 1
//     Last Wicket: example 22 (20)
//     chennai super kings need 134 runs
*/
