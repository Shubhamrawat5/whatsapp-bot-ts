// import mongoose from "mongoose";
// import "dotenv/config";
// import { addbday } from "../db/bdayDB";

// const getBdayData = async () => {
//   const uri = process.env.uri;
//   console.log(uri);

//   if (!uri) return;
//   const connection = await mongoose.connect(uri);

//   // Collection schema
//   const bday_schema = new connection.Schema({
//     name: String,
//     username: String,
//     date: Number,
//     month: Number,
//     year: Number,
//     numb: Number,
//     place: String,
//   });

//   const Birthday = connection.model("birthdays", bday_schema);

//   const data = await Birthday.find().sort({ date: 1 }); //sort by date

//   await connection.disconnect();
//   connection.deleteModel("birthdays");

//   const bday: any = [];
//   data.forEach((document) => {
//     const { name, username, date, month, year, place, numb } = document;

//     bday.push({
//       name,
//       username,
//       date,
//       month,
//       year,
//       place,
//       numb: `91${numb}`,
//     });

//     // bday = [{},{},{},{},{}]
//   });

//   //   console.log(JSON.stringify(bday));
//   console.log(bday.length);
//   let time = 500;
//   bday.forEach((data: any, index: number) => {
//     const { name, username, date, month, year, place, numb } = data;
//     setTimeout(async () => {
//       console.log(index + 1);
//       const addbdayRes = await addbday(name, username, date, month, year, place, numb);
//       console.log(addbdayRes, index + 1);
//     }, time);
//     time += 500;
//   });
// };

// getBdayData();
