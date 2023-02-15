import express from "express";
import { readFile } from "fs/promises";
import maria from "./database/mariadb.js";
maria.connect(); // db connect

const data = JSON.parse(
  await readFile(new URL("./sangji/hak/01.23~.json", import.meta.url))
);

const app = express();

const port = 8000;

app.listen(port, function () {
  console.log("listening on 8000");
});

app.get("/", function (req, res) {
  res.send("hello server");
  console.log(`${port} server!`);
});

app.get("/sangji", async function (req, res) {
  console.log("Sangji University meal");
  res.json(data);
});

// get All
app.get("/test", async function (req, res) {
  maria.query("select * from test", function (err, rows, fields) {
    if (!err) {
      console.log("success");
      res.send(rows);
    } else {
      console.log("connect error");
    }
  });
});

app.get("/insert", async function (req, res) {
  maria.query('insert into test values(10, "j")', function (err, rows, fields) {
    if (!err) {
      res.send("success");
      console.log("request success");
    } else {
      console.log("request error");
      res.send(err);
    }
  });
});
