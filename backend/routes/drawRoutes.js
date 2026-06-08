const router = require("express").Router();
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");
const {
  getDraws,
  getLatestDraw,
  getDrawById,
  getUpcomingDraws,
  getDrawSchedule,
  createDraw,
  updateDrawResults,
  searchDrawResults,
} = require("../controllers/drawController");

router.get("/", optionalAuth, getDraws);
router.get("/latest", getLatestDraw);
router.get("/upcoming", getUpcomingDraws);
router.get("/schedule", getDrawSchedule);
router.get("/search", searchDrawResults);
router.get("/:id", getDrawById);
router.post("/", protect, adminOnly, createDraw);
router.put("/:id/results", protect, adminOnly, updateDrawResults);

module.exports = router;
