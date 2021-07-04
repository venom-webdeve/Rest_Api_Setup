const router = require("express").Router();

const { verifyJwtToken } = require("../../../middlewares/jwt_auth");
const USER = require("../../../controllers/user.controller");

router.get("/", verifyJwtToken, USER.getAllUser);
router.get("/:id", verifyJwtToken, USER.getUserById);
router.get("/changepassword", verifyJwtToken, USER.changePassword);

// router.post('/resetPassword', AUTH.resetPassword );

module.exports = router;
