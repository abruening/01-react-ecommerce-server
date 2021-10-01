const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

//MIDDLEWARE

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// route
//app.use("/api", authRoutes);
readdirSync("./routes").map((r) => {
  app.use("/api", require("./routes/" + r));
});

// port
const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`server running port ${port},`));
