const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
    candidateName: { type: String, required: true },
    mentorName: { type: String, required: true },
    dateTime: { type: Date, required: true },
    status: { type: String, default: 'booked' } // booked, available
});

module.exports = mongoose.model('Session', sessionSchema);