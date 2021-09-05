const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Admin = require('../../models/Admin');
const Room = require('../../models/Room');
const OfficeProfile = require('../../models/OfficeProfile');

//@route POST api/admin
//@desc Create admin
//@access Private
router.post(
  '/',
  [
    auth,
    check('name', 'name is required').notEmpty(),
    check('level', 'admin role level is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, office, level } = req.body;

    try {
      const officeProfile = await OfficeProfile.findById(req.office.id);

      newRoom = new Admin({
        name,
        office,
        level,
      });

      const room = await newRoom.save();

      res.json(room);
    } catch (err) {
      console.err(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
