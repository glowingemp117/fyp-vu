const router = require('express').Router();
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { validateCreateListing } = require('../validators/marketplaceValidator');
const {
  createListing,
  getListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} = require('../controllers/marketplaceController');

router.get('/', optionalAuth, getListings);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', optionalAuth, getListingById);
router.post('/', protect, validate(validateCreateListing), createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
