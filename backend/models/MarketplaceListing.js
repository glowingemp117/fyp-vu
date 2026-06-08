const mongoose = require('mongoose');
const { BOND_DENOMINATIONS } = require('../config/constants');

const listingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bondNumber: {
      type: String,
      required: true,
      trim: true,
    },
    denomination: {
      type: Number,
      required: true,
      enum: BOND_DENOMINATIONS,
    },
    askingPrice: {
      type: Number,
      required: true,
      min: [1, 'Price must be greater than 0'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'cancelled'],
      default: 'active',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ status: 1, denomination: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MarketplaceListing', listingSchema);
