const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

/**
 *
 * @param {object} Model - model we going to work with, e.g. User, Task
 * @param {array} filterOptions - array of options we goign to build filter object
 * and perform req.user._id on
 * @param {object} populateOptions - options and fields we are going to populate
 */

exports.getAll = (Model, filterOptions = [], populateOptions) =>
  catchAsync(async (req, res, next) => {
    // initial filter
    const filter = {};

    if (filterOptions.length) {
      for (let option of filterOptions) filter[option] = req.user._id;
    }

    const total = await Model.find(filter).count();
    // try to figure out logic
    // total is total amount of docs
    // if there no req.query.page or req.query.limit
    // calculate fresh urls to next and prev pages
    console.log(total);
    // else if there req.query.page or req.query.limit
    // starting from ehre calculate urls to next and prew pages
    // last next page in all cases must be null

    // build query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    if (populateOptions) query = features.query.populate(populateOptions);

    // execute query string
    const documents = await features.query;

    // check query stats
    // const stats = await features.query.explain();

    // send response
    res.status(200).json({
      status: "success",
      result: documents.length,
      data: documents,
    });
  });
