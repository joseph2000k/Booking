const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Admin = require("../../models/Admin");
const Room = require("../../models/Room");
const OfficeProfile = require("../../models/OfficeProfile");
const authAdmin = require("../../middleware/authAdmin");
const bcrypt = require("bcryptjs");

//@route POST api/admin
//@desc Create admin
//@access Private/only level 1 admin can access
router.post(
  "/",
  [
    authAdmin,
    check("name", "name is required").notEmpty(),
    check("level", "admin role level is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with a 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, office, level, email, password, rooms } = req.body;

    try {
      if (req.admin.level !== 1) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const assignRoom = await Room.findById(rooms);

      const newAdmin = new Admin({
        name,
        office,
        level,
        password,
        email,
      });

      assignRoom.admins.push(newAdmin._id);

      //TODO:  verify room
      //newAdmin.rooms.unshift(rooms);

      const salt = await bcrypt.genSalt(10);

      newAdmin.password = await bcrypt.hash(password, salt);

      await newAdmin.save();

      assignRoom.save();

      res.json(newAdmin);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  POST api/admin
//@desc   Assign a room
//@access Private

module.exports = router;
