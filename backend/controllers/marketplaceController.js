const MarketplaceListing = require("../models/MarketplaceListing");
const ApiResponse = require("../utils/ApiResponse");

exports.createListing = async (req, res, next) => {
  try {
    const {
      bondNumber,
      denomination,
      askingPrice,
      description,
      city,
      contactPhone,
    } = req.body;

    const listing = await MarketplaceListing.create({
      seller: req.user._id,
      bondNumber,
      denomination,
      askingPrice,
      description: description || "",
      city: city || "",
      contactPhone: contactPhone || req.user.phone || "",
    });

    return ApiResponse.created(res, listing, "Listing created successfully");
  } catch (error) {
    next(error);
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      denomination,
      city,
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query;
    const query = { status: "active" };

    if (denomination) query.denomination = Number(denomination);
    if (city) query.city = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      query.askingPrice = {};
      if (minPrice) query.askingPrice.$gte = Number(minPrice);
      if (maxPrice) query.askingPrice.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price_low") sortObj = { askingPrice: 1 };
    if (sort === "price_high") sortObj = { askingPrice: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await MarketplaceListing.countDocuments(query);

    const listings = await MarketplaceListing.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "name avatar city");

    return ApiResponse.paginated(res, listings, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await MarketplaceListing.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });
    return ApiResponse.success(res, listings);
  } catch (error) {
    next(error);
  }
};

exports.getListingById = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id).populate(
      "seller",
      "name avatar city phone",
    );

    if (!listing) {
      return ApiResponse.notFound(res, "Listing not found");
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    return ApiResponse.success(res, listing);
  } catch (error) {
    next(error);
  }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!listing) {
      return ApiResponse.notFound(res, "Listing not found");
    }

    const allowedUpdates = [
      "askingPrice",
      "description",
      "city",
      "contactPhone",
      "status",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    await listing.save();
    return ApiResponse.success(res, listing, "Listing updated");
  } catch (error) {
    next(error);
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!listing) {
      return ApiResponse.notFound(res, "Listing not found");
    }

    await listing.deleteOne();
    return ApiResponse.success(res, null, "Listing deleted");
  } catch (error) {
    next(error);
  }
};
