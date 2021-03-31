const mongoose = require("mongoose");

let db = null;
const loadDatabase = async () => {
  if (db) return db;
  // Connect to the MongoDB Memory Server for testing
  if (process.env.NODE_ENV == "test") {
    await mongoose.connect(
      global.__MONGO_URI__,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
    db = mongoose.connection;
    return db;
  } else {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER}.mongo.cosmos.azure.com:${process.env.DB_PORT}/${process.env.DB_NAME}?ssl=true&retrywrites=false`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        auth: {
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        },
      }
    );
    db = mongoose.connection;
    return db;
  }
};

module.exports = { loadDatabase };
