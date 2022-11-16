const knex = require("../db/connection");

async function list(date) {
  return knex("reservation")
    .select("*")
    .where({ status: "booked", reservation_date: date })
    .orWhere({ status: "seated", reservation_date: date })
    .orderBy("reservation_time");
}

// list of reservations that match search criteria (phone number)
async function searchList(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  searchList,
};