const express = require("express");
const router = express.Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const Office = require("../../models/Office");
//@route    POST api/offices
//@desc     Register office
//@access   Public
router.post(
  "/",
  [
    check("officeName", "Office Name is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { officeName, password, role, rooms } = req.body;

    try {
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

      const payload = {
        office: {
          id: office.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
