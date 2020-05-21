const express = require('express');
const router = express.Router();

//controller req
const { renderIndex } = require('../controllers/index.controllers');

router.get('/', renderIndex);



module.exports = router;