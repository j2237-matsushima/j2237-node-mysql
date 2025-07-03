// Update with your config settings.
const environment = "development";
const config = require("../knexfile.js")[environment];
const knex = require("knex")(config);

module.exports = knex;
