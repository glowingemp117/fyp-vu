import * as Yup from 'yup';

const DENOMINATIONS = [100, 200, 750, 1500, 7500, 15000, 25000, 40000];

export const addBondSchema = Yup.object().shape({
  bondNumber: Yup.string()
    .matches(/^\d{6}$/, 'Bond number must be exactly 6 digits')
    .required('Bond number is required'),
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Please select a valid denomination')
    .required('Denomination is required'),
  nickname: Yup.string()
    .max(30, 'Nickname cannot exceed 30 characters')
    .optional(),
});

export const checkBondSchema = Yup.object().shape({
  bondNumber: Yup.string()
    .matches(/^\d{6}$/, 'Bond number must be exactly 6 digits')
    .required('Bond number is required'),
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Please select a valid denomination')
    .optional(),
});

export const createListingSchema = Yup.object().shape({
  bondNumber: Yup.string()
    .matches(/^\d{6}$/, 'Bond number must be exactly 6 digits')
    .required('Bond number is required'),
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Please select a valid denomination')
    .required('Denomination is required'),
  askingPrice: Yup.number()
    .min(1, 'Price must be greater than 0')
    .required('Asking price is required'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  city: Yup.string().optional(),
  contactPhone: Yup.string()
    .matches(/^03[0-9]{9}$/, 'Enter valid phone number')
    .optional(),
});
