const bcrypt = require("bcryptjs");
const db = require("../models");

const UserModal = db.user;

module.exports = {
  getAllUser: async (req, res) => {
    const users = await UserModal.find({ isDeleted: false });
    if (!users) {
      return res.status(300).json({ status: 300, message: "No record found", error: true });
    }
    return res.status(200).json({
      status: 200, message: "user list", error: false, data: users,
    });
  },
  getUserById: async (req, res) => {
    console.log("--:: POST Request :: for :: LOGIN method ::--");
    const userId = req.params.id;
    const users = await UserModal.findById({ _id: userId });

    if (!users) {
      return res.status(300).json({ status: 300, message: "No record found", error: true });
    }
    return res.status(200).json({
      status: 200, message: "user by id.", error: false, data: users,
    });
  },
  changePassword: async (req, res) => {
    console.log("--:: POST Request :: for :: changePassword method ::--");
    const input = req.body;

    if (input.email === undefined || input.email === "") {
      return res.status(300).json({ status: 300, message: "email is required" });
    } if (input.newPassword === undefined || input.newPassword === "") {
      return res.status(300).json({ status: 300, message: "newPassword is required" });
    }

    const user = await UserModal.findOne({ email: input.email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ status: 400, message: "Email does not exist" });
    }

    const params = {
      email: input.email.toLowerCase(),
      password: bcrypt.hashSync(req.body.password.toString(), 10),
    };
    console.log(":: before :: update ::");
    const saveUser = await UserModal.updateOne({ _id: user.id }, params);

    return res.status(200).json({ status: 200, message: "Password changed successfully", saveUser });
  },
};
