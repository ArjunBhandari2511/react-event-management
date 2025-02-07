const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    imageUrl: { type: String }, // Cloudinary Image Storage
    imagePublicId : {type : String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User Model
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Attendees List
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
