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

module.exports = {
  list: [asyncErrorBoundary(list)],
};
