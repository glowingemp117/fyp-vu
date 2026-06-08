const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getMyProfile,
  updateProfile,
  updateFcmToken,
} = require('../controllers/userController');

router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.put('/fcm-token', updateFcmToken);

module.exports = router;
