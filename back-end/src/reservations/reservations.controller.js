const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

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

async function create(req, res) {
  let reservation = req.body.data;
  reservation = { ...reservation, status: "booked" };
  const data = await service.create(reservation);
  res.status(201).json({ data });
}

function peopleIsPositiveInteger(req, res, next) {
  let { people } = req.body.data;

  if (people > 0 && Number.isInteger(people)) {
    return next();
  }
  return next({
    status: 400,
    message: `Invalid people field. People must be a positive integer greater than 0`,
  });
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "people",
  "reservation_date",
  "reservation_time",
  "mobile_number",
  "status",
  "created_at",
  "updated_at",
  "reservation_id",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "people",
  "reservation_date",
  "reservation_time",
  "mobile_number",
];

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

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
  create: [asyncErrorBoundary(create)],
};
