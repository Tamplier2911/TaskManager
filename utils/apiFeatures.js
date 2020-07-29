class APIFeatures {
  constructor(query, queryString) {
    // query is Model.find({}) call with certian filters
    this.query = query;
    // queryString - is a query we get from req.query
    this.queryString = queryString;
  }

  // filtering - filter by certain field
  // example get only completed tasks
  // {{URL}}/api/v1/tasks/userTask?isCompleted=true
  filter() {
    // spread all key value pairs to queryObj
    const queryObj = { ...this.queryString };

    // exclude fileds we do not cary about at filtering
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // stringify queryObj
    const queryObjStr = JSON.stringify(queryObj);
    // replace all gte, gt, lte, lt with $gte, $gt, $lte, $lt
    const filteredQueryObj = JSON.parse(
      queryObjStr.replace(/\b(gte|gt|lte|lt)\b/gi, (match) => `$${match}`)
    );

    // apply filters we just created to current query string
    this.query = this.query.find(filteredQueryObj);

    // return current object so we can keep chaining methods
    return this;
  }

  // sorting - sort by certain field
  // {{URL}}/api/v1/tasks/userTask?sort=createdAt,moreField
  sort() {
    // if we have sort property in our query string
    if (this.queryString.sort) {
      // split sort by comma and join by whitespace
      const sortBy = this.queryString.sort.split(",").join(" ");
      // apply query using sort method
      this.query = this.query.sort(sortBy);
      // else sort by creation date - latest created first
    } else this.query = this.query.sort("-createdAt");

    // return current object so we can keep chaining methods
    return this;
  }

  // limiting - prevent certain fields to be shown
  // {{URL}}/api/v1/tasks/userTask?fields=isCompleted
  limit() {
    // if we have fields property in our query string
    if (this.queryString.fields) {
      // split fields by comma and join by whitespace
      const fields = this.queryString.fields.split(",").join(" ");
      // apply query using select method
      this.query = this.query.select(fields);
      // else just by default remove __v from select
    } else this.query = this.query.select("-__v");

    // return current object so we can keep chaining methods
    return this;
  }

  // pagination - paginate requested content
  // {{URL}}/api/v1/tasks/userTask?page=1&limit=10
  // {{URL}}/api/v1/tasks/userTask?page=2&limit=10
  // {{URL}}/api/v1/tasks/userTask?page=3&limit=10
  paginate() {
    // page is equal to page form query string (converted to number) or 1
    const page = this.queryString.page * 1 || 1;

    // limit is equal to limit from query string (converted to stirng) or 10
    const limit = this.queryString.limit * 1 || 10;

    // skip how much elements we are skipping
    // 1st page (1 - 1) * 10 = 0; skip(0).limit(10); from 0 to 10;
    // 2nd page (2 - 1) * 10 = 10; skip(10).limit(10); from 11 to 20;
    // 3nd page (3 - 1) * 10 = 20; skip(20).limit(10); from 21 to 30;
    const skip = (page - 1) * limit;

    // apply query using skip and limit methods
    this.query = this.query.skip(skip).limit(limit);

    // return current object so we can keep chaining methods
    return this;
  }
}

module.exports = APIFeatures;
