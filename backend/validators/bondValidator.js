const { BOND_DENOMINATIONS } = require('../config/constants');

const validateAddBond = (body) => {
  const errors = [];
  const { bondNumber, denomination } = body;

  if (!bondNumber || !/^\d{6}$/.test(bondNumber)) {
    errors.push({ field: 'bondNumber', message: 'Bond number must be exactly 6 digits' });
  }
  if (!denomination || !BOND_DENOMINATIONS.includes(Number(denomination))) {
    errors.push({ field: 'denomination', message: `Denomination must be one of: ${BOND_DENOMINATIONS.join(', ')}` });
  }

  return errors;
};

const validateCheckBond = (body) => {
  const errors = [];
  const { bondNumber, denomination } = body;

  if (!bondNumber || !/^\d{6}$/.test(bondNumber)) {
    errors.push({ field: 'bondNumber', message: 'Bond number must be exactly 6 digits' });
  }
  if (denomination && !BOND_DENOMINATIONS.includes(Number(denomination))) {
    errors.push({ field: 'denomination', message: 'Invalid denomination' });
  }

  return errors;
};

module.exports = { validateAddBond, validateCheckBond };
