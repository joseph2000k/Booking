const express = require('express');
const router = express.Router();


//@route    GET api/meeting
//@desc     Test route
//@access   Public
router.get('/', (req, res) => res.send('meeting route'));

module.exports = router;