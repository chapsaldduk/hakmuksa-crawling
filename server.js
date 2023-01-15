import express from "express";
import router from "router";
import sangji from "./sangji/sangji.js";
const app = express();

const port = 8080;

app.listen(port, function () {
  console.log("listening on 8080");
});

app.get("/", function (req, res) {
  res.send("hello server");
  console.log(`${port} server!`);
});

app.get("/sangji", async function (req, res) {
  res.send("Sangji University Meal Schedule");
  const result = sangji.hak;
  console.log(result);
  res.json(result);
});
