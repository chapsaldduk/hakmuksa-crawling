import express from "express";
import { readFile } from "fs/promises";
// import router from "router";

const data = JSON.parse(
  await readFile(new URL("./sangji/hak/01.23~.json", import.meta.url))
);

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
