const express = require("express");
const router = express.Router();

const {
    getAIRecommendation,
    getAITextRecommendation
} = require("../controllers/aiController");

router.post("/recommend", getAIRecommendation);
router.post("/recommend-text", getAITextRecommendation);

module.exports = router;
