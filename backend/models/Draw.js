const mongoose = require('mongoose');
const { BOND_DENOMINATIONS } = require('../config/constants');

const drawSchema = new mongoose.Schema(
  {
    drawNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    denomination: {
      type: Number,
      required: true,
      enum: BOND_DENOMINATIONS,
    },
    drawDate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed'],
      default: 'upcoming',
    },
    results: {
      first: {
        prizeAmount: Number,
        winningNumbers: [String],
      },
      second: {
        prizeAmount: Number,
        winningNumbers: [String],
      },
      third: {
        prizeAmount: Number,
        winningNumbers: [String],
      },
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    totalPrizes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

drawSchema.index({ denomination: 1, drawDate: -1 });
drawSchema.index({ status: 1 });

module.exports = mongoose.model('Draw', drawSchema);
