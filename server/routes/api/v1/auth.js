const router = require("express").Router();
const AUTH = require("../../../controllers/auth.controller");

router.post("/register", AUTH.register);
router.post("/login", AUTH.login);
// router.post("/forgot", AUTH.forgot);
// router.get("/resetlink", AUTH.validPasswordToken);
// router.post("/resetPassword", AUTH.newPassword);

module.exports = router;