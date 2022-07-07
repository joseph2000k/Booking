const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Announcement = require("../../models/Announcement");
const Office = require("../../models/Office");

//@route   POST api/announcements
//@desc    Create an announcement
//@access  Private
router.post(
  "/",
  [auth, [check("text", "Text is Required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const office = await Office.findById(req.office.id).select("-password");

      if (office.role !== "admin" && office.role !== "manager") {
        return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
      }

      const newAnnouncement = new Announcement({
        text: req.body.text,
        office: req.office.id,
        officeName: office.officeName,
      });

      const announcement = await newAnnouncement.save();
      res.json(announcement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route GET api/announcements
//@desc  Get all announcements
//@access Private
router.get("/", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
