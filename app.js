const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")


const {listingSchema}= require("./schema.js")


const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");//jab bhi aditional  error detail aati h tab eska use karte h9
        throw new ExpressError(400,errmsg)
    }else{
        next();
    }

}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/Listing.ejs", { allListing });
}))
//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));
//Create Route
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
//    let result = listingSchema.validate(req.body);
//    console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "send a valid data for listing");
    // }
    // try{
    const newlisting = new Listing({
        ...req.body.listing,
        // console.log(newlisting)
        image: {
            url: req.body.listing.image.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s",
        },
    });
    // const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
    // console.log(req.body.listing);
    // }catch(err){
    //     next(err);
    // }


}))
// app.post("/listings",async(req,res)=>{
//    const newlisting = new Listing({...req.body.listing,
//     // console.log(newlisting)
//     image:{
//         url:req.body.listing.image.url || "default filename",
//     },
//    });
//    await newlisting.save();
//    res.redirect("/listings");
//    console.log(req.body.listing);

// })
//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))
// update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    // console.log(req.body.listing);
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            ...req.body.listing,
            image: {
                url: req.body.listing.image?.url || "https://images.unsplash.com/photo-1641808886171-3d300caed21a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                filename: req.body.listing.image?.filename || "listingimage",
            },
        },
        { new: true }
    );
    res.redirect("/listings");
}));
// app.put("/listings/:id",async(req,res)=>{
//     let {id} = req.params;
//     // console.log(id);
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})//here we perform the deconstruction
//     res.redirect("/listings");

// })
//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeleteItem = await Listing.findByIdAndDelete(id);
    console.log(DeleteItem);
    res.redirect("/listings");
}))
// app.get("/testListing",async(req,res)=>{
//      const sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute, Goa",

app.get("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
        // res.render("error.ejs",{err});

    // res.status(statusCode).send(message);
    res.render("error.ejs",{message});
    // res.send(err.message)
    // res.send("Something went Wrong");
})
app.listen(8080, () => {
    console.log("Server is listening at port 8080 ");
})
