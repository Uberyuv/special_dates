const mongoose =  require("mongoose");

const peopleSchema = new  mongoose.Schema({
  name: String,
  phone: Number,
});

const eventSchema = new mongoose.Schema(
  {
    eventName: String,
    username: String,
    eventDate: Date,
    eventDescription: String,
    persons: [peopleSchema],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Event", eventSchema);

