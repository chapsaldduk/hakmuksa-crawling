const maria = require("mysql");

const conn = maria.createConnection({
  host: "localhost",
  port: 3306,
  user: "",
  password: "",
  database: "",
});
module.exports = conn;

console.log("test");
