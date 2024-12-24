// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
     
//   },
//   description: String,
//   image: String,
//   price: Number,
//   location: String,
//   country: String,
// });


// const Listing = mongoose.model("Listing", listingSchema);
// module.exports =Listing;


const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://www.komandoo.com/wp-content/uploads/2022/05/KOM_Jacuzzi-beach-villa_Aerial-18_1600x900.jpg",
    set: (v) =>
      v === ""
        ? "https://www.komandoo.com/wp-content/uploads/2022/05/KOM_Jacuzzi-beach-villa_Aerial-18_1600x900.jpg"
        : v,
  },
  price: {
    type: Number,
   
  },
  location: {
    type: String,
    
  },
  country: {
    type: String,
  }
});


const Listing = mongoose.model("Listing", ListingSchema);
module.exports=Listing;