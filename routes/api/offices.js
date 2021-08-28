const express = require('express');
const router = express.Router();


//@route    GET api/offices
//@desc     Test route
//@access   Public
router.get('/', (req, res) => res.send('Office route'));

module.exports = router;