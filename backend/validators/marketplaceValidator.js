const { BOND_DENOMINATIONS } = require('../config/constants');

const validateCreateListing = (body) => {
  const errors = [];
  const { bondNumber, denomination, askingPrice } = body;

  if (!bondNumber || !/^\d{6}$/.test(bondNumber)) {
    errors.push({ field: 'bondNumber', message: 'Bond number must be exactly 6 digits' });
  }
  if (!denomination || !BOND_DENOMINATIONS.includes(Number(denomination))) {
    errors.push({ field: 'denomination', message: 'Invalid denomination' });
  }
  if (!askingPrice || Number(askingPrice) <= 0) {
    errors.push({ field: 'askingPrice', message: 'Asking price must be greater than 0' });
  }

  return errors;
};

module.exports = { validateCreateListing };
