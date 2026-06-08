require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const Draw = require("../models/Draw");

const sampleDraws = [
  {
    drawNumber: 1234567,
    denomination: 750,
    drawDate: new Date("2026-01-15"),
    city: "Rawalpindi",
    status: "completed",
    results: {
      first: { prizeAmount: 1500000, winningNumbers: ["234567"] },
      second: {
        prizeAmount: 500000,
        winningNumbers: ["345678", "456789", "567890"],
      },
      third: {
        prizeAmount: 9300,
        winningNumbers: [
          "111111",
          "222222",
          "333333",
          "444444",
          "555555",
          "666666",
          "777777",
          "888888",
          "999999",
          "123456",
        ],
      },
    },
  },
  {
    drawNumber: 1234568,
    denomination: 1500,
    drawDate: new Date("2026-02-15"),
    city: "Lahore",
    status: "completed",
    results: {
      first: { prizeAmount: 3000000, winningNumbers: ["654321"] },
      second: {
        prizeAmount: 1000000,
        winningNumbers: ["765432", "876543", "987654"],
      },
      third: {
        prizeAmount: 18600,
        winningNumbers: [
          "112233",
          "223344",
          "334455",
          "445566",
          "556677",
          "667788",
        ],
      },
    },
  },
  {
    drawNumber: 1234569,
    denomination: 750,
    drawDate: new Date("2026-04-15"),
    city: "Karachi",
    status: "upcoming",
    results: { first: {}, second: {}, third: {} },
  },
  {
    drawNumber: 1234560,
    denomination: 100,
    drawDate: new Date("2026-05-15"),
    city: "Peshawar",
    status: "upcoming",
    results: { first: {}, second: {}, third: {} },
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Draw.deleteMany({});
    await Draw.insertMany(sampleDraws);
    console.log("✅ Sample draws seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
