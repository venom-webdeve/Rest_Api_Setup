const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const normalize = require("normalize-url");
const { uuid } = require("uuidv4");
// const mailerHelper = require("../_helper/mailer");

const db = require("../models");

const UserModal = db.user;

module.exports = {
  register: async (req, res) => {
    const input = req.body;
    if (input.firstName === undefined || input.firstName === "") {
      return res.status(300).json({ status: 300, message: "firstName is required" });
    } if (input.lastName === undefined || input.lastName === "") {
      return res.status(300).json({ status: 300, message: "lastName is required" });
    } if (input.email === undefined || input.email === "") {
      return res.status(300).json({ status: 300, message: "email is required" });
    } if (input.password === undefined || input.password === "") {
      return res.status(300).json({ status: 300, message: "password is required" });
    }

    const userData = await UserModal.findOne({
      email: input.email.toLowerCase(),
    });

    if (userData) {
      return res.status(300).json({ status: 300, message: "email-id already exist" });
    }

    const avatar = normalize(gravatar.url(input.email, {
      s: "200",
      r: "pg",
      d: "mm",
    }), { forceHttps: true });

    const body = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      password: bcrypt.hashSync(req.body.password.toString(), 10),
      avatar,
    };

    const userSaveData = await UserModal.create(body);
    const token = userSaveData.generateJwt();
    return res.status(200).json({
      status: 200, message: "User created successfully", data: userSaveData, token,
    });
  },
  login: async (req, res) => {
    const input = req.body;
    if (input.email === undefined || input.email === "") {
      return res.status(300).json({ status: 300, message: "email is required" });
    } if (input.password === undefined || input.password === "") {
      return res.status(300).json({ status: 300, message: "password is required" });
    }

    const userData = await UserModal.findOne({
      email: input.email.toLowerCase(),
    });

    if (!userData) {
      return res.status(300).json({ status: 300, message: "Invalid user" });
    }

    if (bcrypt.compareSync(input.password.toString(), userData.password)) {
      return res.status(200).json({ status: 200, message: "Successfully login", data: userData });
    }
    return res.json({ success: 300, message: "passwords do not match" });
  },
  forgot: async (req, res) => {
    const input = req.body;

    if (input.email === undefined || input.email === "") {
      return res.status(300).json({ status: 300, message: "email is required" });
    }

    const user = await UserModal.findOne({ email: input.email });
    if (!user) {
      return res.status(300).json({ status: 300, message: "There's no account with the info that you provided." });
    }
    const linkid = uuid();
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const userParams = {
      passwordResetToken: linkid,
      passwordResetTokenExpiresAt: expireDate.toISOString(),
    };

    const response = await UserModal.updateOne({ _id: user.id }, userParams);
    // { ok: 1, nModified: 1, n: 1 }
    if (response && response.nModified === 1) {
      // mailerHelper.sendResetPasswordLink(req, user.email, linkid);
      return res.send({ status: 200, message: "Reset password link sent. Please check your mail box.", resetcode: linkid });
    }
    return res.send({ status: 300, message: "Something went wrong please try again later" });
  },
  validPasswordToken: async (req, res) => {
    const input = req.body;

    if (input.resettoken === undefined || input.resettoken === "") {
      return res.status(300).json({ status: 300, message: "Token is required" });
    }
    const user = await UserModal.findOne({ passwordResetToken: input.resettoken });

    if (user) {
      const expireDate = user.passwordResetTokenExpiresAt;
      const currentDate = new Date();
      if (currentDate.getTime() > new Date(expireDate).getTime()) {
        return res.status(300).send({ status: 300, message: "Reset password link is expired" });
      }
      return res.status(200).send({ status: 200, message: "Token verified successfully." });
    }
    return res.status(300).send({ status: 300, message: "Invalid token URL" });
  },
  newPassword: async (req, res) => {
    // const key = req.params.id;
    const input = req.body;

    if (input.resettoken === undefined || input.resettoken === "") {
      return res.status(300).json({ status: 300, message: "Invalid URL" });
    } if (input.newPassword === undefined || input.newPassword === "") {
      return res.status(300).json({ status: 300, message: "new password required" });
    }

    const user = await UserModal.findOne({ passwordResetToken: input.resettoken });

    if (user === undefined) {
      return res.status(300).send({ status: 300, message: "Invalid Token" });
    }
    const expireDate = user.passwordResetTokenExpiresAt;
    const currentDate = new Date();
    if (currentDate.getTime() > new Date(expireDate).getTime()) {
      return res.status(300).send({ status: 300, message: "Reset password link is expired" });
    }

    const params = {
      passwordResetToken: "",
      password: bcrypt.hashSync(input.newPassword.toString(), 10),
    };

    const userData = await UserModal.updateOne({ _id: user.id }, params);

    if (userData) return res.status(300).json({ status: 300, message: "Error occured" });
    return res.status(200).json({ status: 200, message: "Password changed successfully", userData });
  },

};
