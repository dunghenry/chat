const express = require('express');
const router = express.Router();
const SiteController = require('../controllers/siteController');
router.get('/', SiteController.getHomePage);
module.exports = router;
