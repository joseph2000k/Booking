const express = require("express");
const router = express.Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Office = require("../../models/Office");
const Meeting = require("../../models/Meeting");
const OfficeProfile = require("../../models/OfficeProfile");
//@route    POST api/offices
//@desc     Register office
//@access   Private
router.post(
  "/",
  [
    check("officeName", "Office Name is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { officeName, password, role, rooms } = req.body;

    try {
      const user = await Office.findById(req.office.id);

      if (user.role !== "admin") {
        return res.status(400).json({ errors: [{ msg: "Not Authorized" }] });
      }

      let office = await Office.findOne({ officeName });

      if (office) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Office already exists" }] });
      }

      office = new Office({
        officeName,
        password,
        role,
        rooms,
      });

      const salt = await bcrypt.genSalt(10);

      office.password = await bcrypt.hash(password, salt);

      await office.save();

      const payload = await Office.find().select("-password");
      res.json(payload);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   GET api/offices
//@desc    Get all offices
//@access  Private
router.get("/", auth, async (req, res) => {
  try {
    const offices = await Office.find().sort({ date: -1 }).select("-password");
    res.json(offices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/offices/:id
//@desc  Delete an office
//@access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    const user = await Office.findById(req.office.id);

    if (user.role !== "admin") {
      return res.status(400).json({ errors: [{ msg: "Not Authorized" }] });
    }

    if (!office) {
      return res.status(404).json({ msg: "Office not found" });
    }

    await office.remove();
    await Meeting.deleteMany({ office: req.params.id });
    await OfficeProfile.findOneAndRemove({ office: req.params.id });

    res.json({ msg: "Office removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Office not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
