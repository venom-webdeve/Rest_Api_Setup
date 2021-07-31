const db = require("../models");

const UserModal = db.user;

module.exports = {
    getAllUsers: async(req,res)=>{
        const users = await UserModal.find({ isDeleted:false});
        if (!users) {
            return res.status(300).json({ status: 300, message: "No record found" });
          }
          return res.status(200).json({
            status: 200, message: "user list",data: users,
          });

    },
    getUserById: async(req,res)=>{
        const userId = req.params.id;
        const users = await UserModal.findById({_id:userId});
        if (!users) {
            return res.status(300).json({ status: 300, message: "No record found" });
          }
          return res.status(200).json({
            status: 200, message: "user by id.",data: users,
          });
    },

    updateUserById: async(req,res)=>{
        const userId = req.params.id;
        const input = req.body;
        const userData = {
        fullName: input.fullName,
        email: input.email.toLowerCase(),
         };
    const user = await UserModal.findByIdAndUpdate({"_id":userId},userData,{new:true});
    if (!user) {
        return res.status(300).json({ status: 300, message: "No user found", });
    }
    return res.status(200).json({
        status: 200, message: "user list updated by id", data:user,
      });

    },
    userDeletedById: async(req,res)=>{
        const userId = req.params.id;
        const user = await UserModal.findByIdAndRemove(userId);
        if (!user) {
         return res.status(300).json({ status: 300, message: "No user found", });
     }
     return res.status(200).json({
         status: 200, message: "user deleted of id",
       });
    },
}