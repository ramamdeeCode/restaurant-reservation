const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobileNumber } = res.locals;
  const data = mobileNumber
    ? await service.searchList(mobileNumber)
    : await service.list(date);

  res.json({ data });
}

function getMobileNumberFromQuery(req, res, next) {
  const mobileNumber = req.query.mobile_number;
  if (mobileNumber) {
    res.locals.mobileNumber = mobileNumber;
  }
  next();
}

function getDateFromQuery(req, res, next) {
  let today = new Date();
  today = `${today.getFullYear().toString(10)}-${(today.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${today.getDate().toString(10).padStart(2, "0")}`;
  const date = req.query.date || today;
  res.locals.date = date;
  next();
}

module.exports = {
  list: [getMobileNumberFromQuery, getDateFromQuery, asyncErrorBoundary(list)],
};
