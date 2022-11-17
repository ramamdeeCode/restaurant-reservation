const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

// list tables that are not occupied (reservation_id is null)
async function listFree(req, res) {
  // const capacity = res.locals.capacity;  //filters list of tables by capacity. This functionality breaks testing but I want to implement it for portfolio.
  const data = await service.listFree(/* capacity */);
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function getCapacity(req, res, next) {
  const capacity = req.query.capacity || 99999;
  res.locals.capacity = capacity;
  next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  listFree: [getCapacity, asyncErrorBoundary(listFree)],
  create: [asyncErrorBoundary(create)],
};
