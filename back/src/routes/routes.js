const express = require('express');
const authRoutes = require('./authRoutes.js');
const bookRouter = require('./bookRoutes.js');
const router = express.Router();


//Auth
router.use(authRoutes)
router.use(bookRouter)

module.exports = router;