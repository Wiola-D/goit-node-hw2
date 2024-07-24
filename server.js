const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const { DB_HOST: urlDb } = process.env;

const connection = mongoose.connect(urlDb);

const startServer = async () => {
  try {
    await connection;
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server started on http://localhost:3000");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
