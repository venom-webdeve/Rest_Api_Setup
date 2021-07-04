const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const appJson = require("./app_config.json");
const db = require("../models");

const USERMODEL = db.user;
const mongodbURL = process.env.MONGODB_URI;

/**
 * CONNECT DATABASE
 * */
exports.connectDataBase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: true,
    };
    const connection = await mongoose.connect(mongodbURL, options);
    if (connection) console.log("\x1b[32m%s\x1b[0m", "Database Connected Successfully...");
  } catch (err) {
    console.log("\x1b[31m%s\x1b[0m", "Error while connecting database\n");
    console.log(err);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * CREATE ADMIN
 * */
exports.createAdmin = async () => {
  const emails = appJson.admin_email;
  const defaultPass = appJson.admin_pwd;
  // create super Admin
  if (defaultPass && emails && emails.length > 1) {
    try {
      for (const record of emails) {
        const user = await USERMODEL.findOne({ email: record });
        if (!user) {
          const params = {
            firstName: "SUPER",
            lastName: "ADMIN",
            fullName: "SUPER ADMIN",
            email: record,
            password: bcrypt.hashSync(defaultPass.toString(), 10),
            role: "SUPER_ADMIN",
          };
          const userData = await USERMODEL.create(params);
          if (userData) {
            console.log("\x1b[31m%s\x1b[0m", "#################################################");
            console.log("\x1b[33m%s\x1b[0m", "SUCCESSFULLY CREATED SUPER ADMIN");
            console.log("\x1b[33m%s\x1b[0m", `USERID : ${record}\nPASSWORD : ${defaultPass}`);
            console.log("\x1b[31m%s\x1b[0m", "#################################################");
          } else {
            console.log("FAIL TO CREATE SUPER ADMIN");
          }
        }
      }
    } catch (e) {
      console.log("err..! error on creatingadmin :: ERROR :: ", e);
    }
  }
};
