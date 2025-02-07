const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create Event
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, description, dateTime } = req.body;
    let imageUrl = "", imagePublicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
    }

    const event = new Event({ name, description, dateTime, imageUrl, imagePublicId, createdBy: req.user._id });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User's Events
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const myEvents = await Event.find({ createdBy: req.user._id });
    res.status(200).json(myEvents);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update Event
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    if (req.file) {
      if (event.imagePublicId) await cloudinary.uploader.destroy(event.imagePublicId);
      const result = await cloudinary.uploader.upload(req.file.path);
      event.imageUrl = result.secure_url;
      event.imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
    }

    Object.assign(event, req.body);
    await event.save();
    res.status(200).json({ message: "Event updated successfully", event });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Event
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    if (event.imagePublicId) await cloudinary.uploader.destroy(event.imagePublicId);
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// Join Event
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() === req.user._id.toString()) return res.status(400).json({ message: "You cannot join your own event" });
    if (event.attendees.includes(req.user._id)) return res.status(400).json({ message: "You have already joined this event" });

    event.attendees.push(req.user._id);
    await event.save();
    res.status(200).json({ message: "Joined successfully", event });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
