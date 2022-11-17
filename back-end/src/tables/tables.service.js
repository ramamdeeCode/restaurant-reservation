const knex = require("../db/connection");

async function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// list tables that are not occupied
async function listFree(/* minCapacity */) {
  //filters list of tables by capacity. This functionality breaks testing but I want to implement it for portfolio.
  return (
    knex("tables")
      .select("*")
      .where({ reservation_id: null })
      // .andWhere("capacity", ">=", minCapacity)   filters list of tables by capacity. This functionality breaks testing but I want to implement it for portfolio.
      .orderBy("table_name")
  );
}

async function create(table) {
  return knex("table")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function read(table_id) {
  return knex("table").select("*").where({ table_id }).first();
}

module.exports = {
  list,
  listFree,
  create,
  read,
};
