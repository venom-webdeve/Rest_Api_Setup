const router = require("express").Router();


// "/api/v2/"
router.get("/", (req,res)=> res.send({status:true,message:"Everything is all right.",error_msg:null,data:[]}));

// "/api/v2/user"
router.use("/user", require("./user"));

module.exports = router;
