const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Office = require('../../models/Office');
const OfficeProfile = require('../../models/OfficeProfile');

//@route    GET api/officeprofile/me
//@desc     Get current office profile
//@access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const officeProfile = await OfficeProfile.findOne({
      office: req.office.id,
    }).populate('officeName');

    if (!officeProfile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this office' });
    }

    res.json(officeProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
