const express = require('express');
const router = express.Router();
const { getPlans, getFaqs } = require('../controllers/infoController');

// GET /api/plans
router.get('/plans', getPlans);

// GET /api/faqs
router.get('/faqs', getFaqs);

module.exports = router;
