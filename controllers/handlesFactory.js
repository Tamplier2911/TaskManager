const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const sanitizeFields = require("../utils/sanitizeFields");

/**
 * @function getOne - gets one element by req.params.id
 * @param {object} Model - model we going to work with, e.g. User, Task
 * @param {object} populateOptions - options and fields we are going to populate
 */

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // search for model by id, use populateOptions if there are some
    let doc = await Model.findById(req.params.id).populate(
      populateOptions || ""
    );

    // if no document found return error
    if (!doc)
      return next(new AppError("No documents found with that ID.", 404));

    // else return document
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

/**
 * @function createOne - attempts to create element using req.body
 * @param {object} Model - model we going to work with, e.g. User, Task
 * @param {array} allowedFields - fields that we going to filter out of body
 * @param {array} fieldsToReturn - fields that we want to filter before returning
 */

exports.createOne = (Model, allowedFields = [], fieldsToReturn) =>
  catchAsync(async (req, res, next) => {
    // sanitize body
    const sanitizedBody = sanitizeFields(req.body, allowedFields);

    // attempt to create element with sanitized body
    const doc = await Model.create(sanitizedBody);

    // if no document created return an error
    if (!doc)
      return next(
        new AppError("Creation process failed, please try again.", 404)
      );

    let filteredFields;
    if (fieldsToReturn) filteredFields = sanitizeFields(doc, fieldsToReturn);

    // else return created document
    res.status(201).json({
      status: "success",
      data: filteredFields || doc,
    });
  });

/**
 * @function updateOne - attempts to update element using req.body
 * @param {object} Model - model we going to work with, e.g. User, Task
 * @param {array} allowedFields - fields that we going to filter out of body
 */

exports.updateOne = (Model, allowedFields = []) =>
  catchAsync(async (req, res) => {
    // sanitize fields
    const sanitizedBody = sanitizeFields(req.body, allowedFields);

    // attempt to update doc with sanitized body
    const doc = await Model.findByIdAndUpdate(req.params.id, sanitizedBody, {
      new: true,
      runValidators: true,
    });

    // if no document were updated - return error
    if (!doc) return next(new AppError("No document found with that ID.", 404));

    // else return updated object
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

/**
 * @function deleteOne - attempts to delete element using req.params.id
 * @param {object} Model - model we going to work with, e.g. User, Task
 */

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID.", 404));

    res.status(204).json({
      status: "success",
      message: null,
    });
  });

/**
 * @function getAll - fetching all objects applying required filters on them
 * @param {object} Model - model we going to work with, e.g. User, Task
 * @param {array} filterOptions - array of arrays pairs to build our filter object
 * @param {object} populateOptions - options and fields we are going to populate
 */

exports.getAll = (Model, filterOptions = [], populateOptions) =>
  catchAsync(async (req, res, next) => {
    // initial filter
    const filter = {};

    if (filterOptions.length)
      for (let option of filterOptions) filter[option[0]] = req[option[1]]._id;

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
