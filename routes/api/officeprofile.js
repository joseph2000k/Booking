const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Office = require("../../models/Office");
const OfficeProfile = require("../../models/OfficeProfile");

//@route    GET api/officeprofile/me
//@desc     Get current office profile
//@access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const officeProfile = await OfficeProfile.findOne({
      office: req.office.id,
    }).populate("office", ["officeName"]);

    if (!officeProfile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this office" });
    }

    res.json(officeProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/officeprofile/
//@desc     Create of update office profile
//@access   Private
router.post("/", auth, async (req, res) => {
  const { headofOffice, location } = req.body;

  const profileFields = {};
  profileFields.office = req.office.id;

  if (headofOffice) profileFields.headofOffice = headofOffice;
  if (location) profileFields.location = location;

  try {
    let officeProfile = await OfficeProfile.findOne({ office: req.office.id });

    if (officeProfile) {
      //update
      officeProfile = await OfficeProfile.findOneAndUpdate(
        { office: req.office.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(officeProfile);
    }

    //create
    officeProfile = new OfficeProfile(profileFields);

    await officeProfile.save();
    res.json(officeProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/officeprofile/contactperson
//@desc     Add office contact person
//@access   Private
router.put(
  "/contactperson",
  [
    auth,
    check("name", "Contact name is required").not().isEmpty(),
    check("contactDetails1", "Contact detail is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contactDetails1, contactDetails2 } = req.body;

    const newContactPerson = {
      name,
      contactDetails1,
      contactDetails2,
    };

    try {
      const officeProfile = await OfficeProfile.findOne({
        office: req.office.id,
      });

      officeProfile.contactPerson.unshift(newContactPerson);

      await officeProfile.save();
      res.json(officeProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/officeprofile/contactperson/:contact_id
//@desc     Delete contact from office profile
//@access   Private

router.delete("/contactperson/:contact_id", auth, async (req, res) => {
  try {
    const officeProfile = await OfficeProfile.findOne({
      office: req.office.id,
    });

    //Get remove index
    const removeIndex = officeProfile.contactPerson
      .map((item) => item.id)
      .indexOf(req.params.contact_id);

    officeProfile.contactPerson.splice(removeIndex, 1);
    await officeProfile.save();
    res.json(officeProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/officeprofile/contacts/
//@desc     Get contact persons
//@access   Private
router.get("/contactperson", auth, async (req, res) => {
  try {
    const officeProfile = await OfficeProfile.findOne({
      office: req.office.id,
    });
    res.json(officeProfile.contactPerson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
