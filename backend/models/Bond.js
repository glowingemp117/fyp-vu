const mongoose = require('mongoose');
const { BOND_DENOMINATIONS } = require('../config/constants');

const bondSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bondNumber: {
      type: String,
      required: [true, 'Bond number is required'],
      trim: true,
      maxlength: [7, 'Bond number cannot exceed 7 digits'],
    },
    denomination: {
      type: Number,
      required: [true, 'Denomination is required'],
      enum: {
        values: BOND_DENOMINATIONS,
        message: 'Invalid denomination',
      },
    },
    nickname: {
      type: String,
      trim: true,
      default: '',
    },
    isWinner: {
      type: Boolean,
      default: false,
    },
    winDetails: {
      drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw' },
      prizeType: { type: String, enum: ['first', 'second', 'third', ''] },
      prizeAmount: Number,
      drawDate: Date,
    },
    lastCheckedDraw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique bond per user
bondSchema.index({ user: 1, bondNumber: 1, denomination: 1 }, { unique: true });

module.exports = mongoose.model('Bond', bondSchema);
