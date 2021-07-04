const router = require("express").Router();

// request pass to api version v1
router.use("/v1", require("./api/v1/index"));

// request pass to api version v2
router.use("/v2", require("./api/v2/index"));

module.exports = router;
