const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
     },
     description:{
         type: String,
     },
     image:{
        // type:String,
        // default:"https://unsplash.com/photos/a-woman-in-a-grey-sweater-and-blue-leggings-xk0Udlkjcp0",
        // set : (v)=>
        //     v===" "
        // ?"https://unsplash.com/photos/a-woman-in-a-grey-sweater-and-blue-leggings-xk0Udlkjcp0"
        // :v,
       type: new Schema({
        filename:{
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
            default: "https://unsplash.com/photos/a-woman-in-a-grey-sweater-and-blue-leggings-xk0Udlkjcp0",
            set:(v)=>
                v===" "
                ?"https://unsplash.com/photos/a-woman-in-a-grey-sweater-and-blue-leggings-xk0Udlkjcp0"
                :v,
           }
       }),
    // required:true,
    },
     price:Number,
     location: String,
     country:String,
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

