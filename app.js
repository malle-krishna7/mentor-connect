const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const Review = require("./models/review");
const Session = require('./models/session.js');


const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/mentorConnect";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",(req,res) => {
   res.send("Hi i am Root");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });
  
  //New Route
  app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  });
  
  //Edit Route
  app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route
  app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
  
  //Delete Route
  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });



app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
});


app.delete('/listings/:id/reviews/:reviewId', async (req, res) => {
  try {
      const { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
// app.get("/testListing",async(req,res) => {
//     let samplelisting = new listing ({
//         name: "krishna",
//         bio: "softwar Engeneer",
//         rateing: 5,
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });
 //Show Route

 app.post('/book', async (req, res) => {
  res.render("./listings/book.ejs");
});

app.listen(port,() => {
    console.log("server listening on port ", port);
})