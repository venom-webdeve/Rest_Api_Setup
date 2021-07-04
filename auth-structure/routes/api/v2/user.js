const router = require("express").Router();


// "/api/v2/user/"
router.get("/", (req,res)=> res.send({status:true,message:"Everything is all right. --user",error_msg:null,data:[]}));


module.exports = router;
