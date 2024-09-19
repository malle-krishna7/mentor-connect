const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    author: String,
    text: String,
    rating: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});


const listingSchema = new Schema({
    image:{
        type: String,
        default : "https://unsplash.com/photos/a-woman-with-her-eyes-closed-looking-down-wCwhIi-m1DA",
        set : (v) => 
            v ===""
         ? "https://unsplash.com/photos/a-woman-with-her-eyes-closed-looking-down-wCwhIi-m1DA" 
         : v,
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;