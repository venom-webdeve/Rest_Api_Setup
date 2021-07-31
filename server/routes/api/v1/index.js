const router = require("express").Router();

// '/api/v1/auth'
router.use("/auth", require("./auth"));

// '/api/v1/user'
router.use("/user", require("./user"));

module.exports = router;