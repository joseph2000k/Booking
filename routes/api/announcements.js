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
      const newAnnouncement = new Announcement({
        text: req.body.text,
        office: req.office.id,
      });

      const announcement = await newAnnouncement.save();
      res.json(announcement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
