const router = require("express").Router();

// const { verifyJwtToken } = require("../../../middlewares/jwt_auth");
const USER = require("../../../controllers/user.controller");

router.get("/",  USER.getAllUsers);
router.get("/:id", USER.getUserById);
router.put("/update/:id",USER.updateUserById);
router.delete("/delete/:id",USER.userDeletedById);
// router.get("/changepassword", verifyJwtToken, USER.changePassword);

// router.post('/resetPassword', AUTH.resetPassword );

module.exports = router;