const Bond = require('../models/Bond');
const Draw = require('../models/Draw');
const ApiResponse = require('../utils/ApiResponse');
const { PAGINATION } = require('../config/constants');

exports.addBond = async (req, res, next) => {
  try {
    const { bondNumber, denomination, nickname } = req.body;

    const existingBond = await Bond.findOne({
      user: req.user._id,
      bondNumber,
      denomination,
    });

    if (existingBond) {
      return ApiResponse.badRequest(res, 'This bond is already in your collection');
    }

    const bond = await Bond.create({
      user: req.user._id,
      bondNumber,
      denomination,
      nickname: nickname || '',
    });

    return ApiResponse.created(res, bond, 'Bond added successfully');
  } catch (error) {
    next(error);
  }
};

exports.getMyBonds = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, denomination, isWinner, search } = req.query;
    const query = { user: req.user._id };

    if (denomination) query.denomination = Number(denomination);
    if (isWinner !== undefined) query.isWinner = isWinner === 'true';
    if (search) query.bondNumber = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Bond.countDocuments(query);

    const bonds = await Bond.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('winDetails.drawId', 'drawNumber drawDate city');

    return ApiResponse.paginated(res, bonds, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

exports.checkBond = async (req, res, next) => {
  try {
    const { bondNumber, denomination, drawId } = req.body;

    const query = { status: 'completed' };
    if (denomination) query.denomination = Number(denomination);
    if (drawId) query._id = drawId;

    const draws = await Draw.find(query).sort({ drawDate: -1 }).limit(drawId ? 1 : 10);

    const results = [];
    for (const draw of draws) {
      let prizeType = null;
      let prizeAmount = 0;

      if (draw.results?.first?.winningNumbers?.includes(bondNumber)) {
        prizeType = 'first';
        prizeAmount = draw.results.first.prizeAmount;
      } else if (draw.results?.second?.winningNumbers?.includes(bondNumber)) {
        prizeType = 'second';
        prizeAmount = draw.results.second.prizeAmount;
      } else if (draw.results?.third?.winningNumbers?.includes(bondNumber)) {
        prizeType = 'third';
        prizeAmount = draw.results.third.prizeAmount;
      }

      if (prizeType) {
        results.push({
          draw: {
            id: draw._id,
            drawNumber: draw.drawNumber,
            drawDate: draw.drawDate,
            city: draw.city,
            denomination: draw.denomination,
          },
          prizeType,
          prizeAmount,
        });
      }
    }

    return ApiResponse.success(res, {
      bondNumber,
      denomination,
      isWinner: results.length > 0,
      results,
      checkedDraws: draws.length,
    }, results.length > 0 ? 'Congratulations! Your bond won!' : 'No prize found');
  } catch (error) {
    next(error);
  }
};

exports.autoCheckBonds = async (req, res, next) => {
  try {
    const bonds = await Bond.find({ user: req.user._id });
    if (bonds.length === 0) {
      return ApiResponse.success(res, { winners: [], checked: 0 }, 'No bonds to check');
    }

    const latestDraws = await Draw.find({ status: 'completed' }).sort({ drawDate: -1 }).limit(5);
    const winners = [];

    for (const bond of bonds) {
      for (const draw of latestDraws) {
        if (draw.denomination !== bond.denomination) continue;
        if (bond.lastCheckedDraw && bond.lastCheckedDraw.toString() === draw._id.toString()) continue;

        let prizeType = null;
        let prizeAmount = 0;

        if (draw.results?.first?.winningNumbers?.includes(bond.bondNumber)) {
          prizeType = 'first';
          prizeAmount = draw.results.first.prizeAmount;
        } else if (draw.results?.second?.winningNumbers?.includes(bond.bondNumber)) {
          prizeType = 'second';
          prizeAmount = draw.results.second.prizeAmount;
        } else if (draw.results?.third?.winningNumbers?.includes(bond.bondNumber)) {
          prizeType = 'third';
          prizeAmount = draw.results.third.prizeAmount;
        }

        if (prizeType) {
          bond.isWinner = true;
          bond.winDetails = {
            drawId: draw._id,
            prizeType,
            prizeAmount,
            drawDate: draw.drawDate,
          };
          winners.push({ bond: bond.toObject(), prizeType, prizeAmount });
        }

        bond.lastCheckedDraw = draw._id;
        await bond.save();
      }
    }

    return ApiResponse.success(res, {
      winners,
      checked: bonds.length,
      totalWinners: winners.length,
    }, winners.length > 0 ? `${winners.length} bond(s) won!` : 'No winners this time');
  } catch (error) {
    next(error);
  }
};

exports.deleteBond = async (req, res, next) => {
  try {
    const bond = await Bond.findOne({ _id: req.params.id, user: req.user._id });
    if (!bond) {
      return ApiResponse.notFound(res, 'Bond not found');
    }

    await bond.deleteOne();
    return ApiResponse.success(res, null, 'Bond deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getBondStats = async (req, res, next) => {
  try {
    const stats = await Bond.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalBonds: { $sum: 1 },
          totalValue: { $sum: '$denomination' },
          totalWinners: { $sum: { $cond: ['$isWinner', 1, 0] } },
          totalWinnings: {
            $sum: { $cond: ['$isWinner', '$winDetails.prizeAmount', 0] },
          },
        },
      },
    ]);

    const denominationBreakdown = await Bond.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$denomination',
          count: { $sum: 1 },
          winners: { $sum: { $cond: ['$isWinner', 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return ApiResponse.success(res, {
      summary: stats[0] || { totalBonds: 0, totalValue: 0, totalWinners: 0, totalWinnings: 0 },
      denominationBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
