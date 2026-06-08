const router = require('express').Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { validateAddBond, validateCheckBond } = require('../validators/bondValidator');
const {
  addBond,
  getMyBonds,
  checkBond,
  autoCheckBonds,
  deleteBond,
  getBondStats,
} = require('../controllers/bondController');

router.use(protect);
router.post('/', validate(validateAddBond), addBond);
router.get('/', getMyBonds);
router.get('/stats', getBondStats);
router.post('/check', validate(validateCheckBond), checkBond);
router.post('/auto-check', autoCheckBonds);
router.delete('/:id', deleteBond);

module.exports = router;
