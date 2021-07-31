const bcrypt = require("bcryptjs");
const db = require("../models");

const UserModal = db.user;

module.exports = {
    register: async(req,res)=>{
        const input = req.body;
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (input.fullName === undefined || input.fullName === "") {
            return res.status(300).json({ status: 300, message: "userName is required" });
        } if (input.email === undefined || input.email === "") {
            return res.status(300).json({ status: 300, message: "email is required" });
        }
        if (!regex.test(input.email.trim())) {
            return res.status(300).json({ status: 300, message: "email is not valid" });
        } if (input.password === undefined || input.password === "") {
            return res.status(300).json({ status: 300, message: "password is required" });
        }
        //checking user is already exist or not
        const emailExist = await UserModal.findOne({
            email: input.email.toLowerCase(),
          });
          if (emailExist) {
            return res.status(300).json({ status: 300, message: "email-id already exist" });
          }
          const userData = {
            fullName: input.fullName,
            email: input.email.toLowerCase(),
            password: bcrypt.hashSync(req.body.password.toString(), 10),
          };
          const saveUserData= await UserModal.create(userData);
          return res.status(200).json({
            status: 200, message: "User created successfully", data:saveUserData,
          });
    },
    login: async(req,res)=>{
        const input = req.body;
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // if (input.fullName === undefined || input.fullName === "") {
        //     return res.status(300).json({ status: 300, message: "userName is required" });
       // } 
        if (input.email === undefined || input.email === "") {
            return res.status(300).json({ status: 300, message: "email is required" });
        }
        if (!regex.test(input.email.trim())) {
            return res.status(300).json({ status: 300, message: "email is not valid" });
        } if (input.password === undefined || input.password === "") {
            return res.status(300).json({ status: 300, message: "password is required" });
        }
    
        const user = await UserModal.findOne({
            email: input.email.toLowerCase(),
          });
          if (!user) {
            return res.status(300).json({ status: 300, message: "Invalid user" });
          }
          if (bcrypt.compareSync(input.password.toString(), user.password)) {
            return res.status(200).json({ status: 200, message: "Successfully login", data: user });
          }
          return res.json({ success: 300, message: "passwords do not match" });
    },
}