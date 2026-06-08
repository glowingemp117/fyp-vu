const Draw = require("../models/Draw");
const ApiResponse = require("../utils/ApiResponse");

exports.getDraws = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, denomination, status, city } = req.query;
    const query = {};

    if (denomination) query.denomination = Number(denomination);
    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Draw.countDocuments(query);

    const draws = await Draw.find(query)
      .sort({ drawDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.paginated(res, draws, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestDraw = async (req, res, next) => {
  try {
    const draw = await Draw.find({ status: "completed" })
      .sort({
        createdAt: -1,
      })
      .limit(10);
    if (!draw || draw.length === 0) {
      return ApiResponse.notFound(res, "No completed draws found");
    }
    return ApiResponse.success(res, draw);
  } catch (error) {
    next(error);
  }
};

exports.getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return ApiResponse.notFound(res, "Draw not found");
    }
    return ApiResponse.success(res, draw);
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingDraws = async (req, res, next) => {
  try {
    const draws = await Draw.find({ status: "upcoming" }).sort({ drawDate: 1 });
    return ApiResponse.success(res, draws);
  } catch (error) {
    next(error);
  }
};

exports.getDrawSchedule = async (req, res, next) => {
  try {
    const draws = await Draw.find({
      drawDate: { $gte: new Date() },
    })
      .sort({ drawDate: 1 })
      .select("drawNumber denomination drawDate city status");

    return ApiResponse.success(res, draws);
  } catch (error) {
    next(error);
  }
};

exports.createDraw = async (req, res, next) => {
  try {
    const draw = await Draw.create(req.body);
    return ApiResponse.created(res, draw, "Draw created successfully");
  } catch (error) {
    next(error);
  }
};

exports.updateDrawResults = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return ApiResponse.notFound(res, "Draw not found");
    }

    draw.results = req.body.results;
    draw.status = "completed";
    draw.pdfUrl = req.body.pdfUrl || draw.pdfUrl;

    // Count total prizes
    const { first, second, third } = draw.results;
    draw.totalPrizes =
      (first?.winningNumbers?.length || 0) +
      (second?.winningNumbers?.length || 0) +
      (third?.winningNumbers?.length || 0);

    await draw.save();
    return ApiResponse.success(res, draw, "Draw results updated");
  } catch (error) {
    next(error);
  }
};

exports.searchDrawResults = async (req, res, next) => {
  try {
    const { bondNumber, denomination } = req.query;
    if (!bondNumber) {
      return ApiResponse.badRequest(res, "Bond number is required for search");
    }

    const query = { status: "completed" };
    if (denomination) query.denomination = Number(denomination);

    const draws = await Draw.find(query).sort({ drawDate: -1 });

    const matches = [];
    for (const draw of draws) {
      let prizeType = null;
      let prizeAmount = 0;

      if (draw.results?.first?.winningNumbers?.includes(bondNumber)) {
        prizeType = "first";
        prizeAmount = draw.results.first.prizeAmount;
      } else if (draw.results?.second?.winningNumbers?.includes(bondNumber)) {
        prizeType = "second";
        prizeAmount = draw.results.second.prizeAmount;
      } else if (draw.results?.third?.winningNumbers?.includes(bondNumber)) {
        prizeType = "third";
        prizeAmount = draw.results.third.prizeAmount;
      }

      if (prizeType) {
        matches.push({
          drawNumber: draw.drawNumber,
          drawDate: draw.drawDate,
          city: draw.city,
          denomination: draw.denomination,
          prizeType,
          prizeAmount,
        });
      }
    }

    return ApiResponse.success(res, {
      bondNumber,
      matches,
      totalMatches: matches.length,
    });
  } catch (error) {
    next(error);
  }
};
