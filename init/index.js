// const mongoose = require("mongoose");
// const initdata = require("./data.js");
// const Listing =require("../models/listing.js");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
// main()
// .then(()=>{
//     console.log("connected tp DB");
// })
// .catch((err)=>{
//     console.log(err);
// });

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }
 
// const initDB = async()=>{
//      await Listing.deleteMany({});
//      await Listing.insertMany(initdata.data);
//      console.log("data was intialized")
// };

// initDB();


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data initialized");
};
initDB();