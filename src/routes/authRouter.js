const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const Validate = require("../middlewares/Validations");
//Middleware specific to this router
// router.use();

//Routes for login and signup
router.post("/signup", Validate.signupCheck, AuthController.signup);
router.post("/signin", Validate.logincheck, AuthController.signin);

module.exports = router;
