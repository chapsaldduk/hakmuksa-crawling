import express from "express";
// import router from "router";
// import sangji from "./sangji/sangji.js";
import data from "./sangji/hak/상지대학교 01월 16일 ~ 01월 20일 학식.js";

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
  console.log("Sangji University meal");
  res.json(data);
});
