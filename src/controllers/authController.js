const response = require("../utils/response");
const UserService = require("../services/userService");
const bcrypt = require("bcrypt");
const AuthJWT = require("jsonwebtoken");
const { Secret_Key } = require("../configs/authConfig");

//Controller Logics

const signup = async (req, res) => {
  let queryObjectToBeAddedToDb = {
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    dob: req.body.dob,
    phone: req.body.phone,
  };

  try {
    const User = await UserService.create(queryObjectToBeAddedToDb);
    return res
      .status(201)
      .send(response.sendSuccess("SignUp Successful", User));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};




//Handle SignIn

const signin = async (req, res) => {
  const reqUserName = req.body.username || req.query.username;
  const reqEmail = req.body.email || req.query.email;
  const reqPassword = req.body.password || req.query.password;

  let queryObjectToFind = {
    $or: [{ username: reqUserName }, { email: reqEmail }],
  };

  try {
    const user = await UserService.findOne(queryObjectToFind);

    if (!user) {
      return res
        .status(400)
        .send(response.sendFailed("SignIn Failed, User doesn't Exist"));
    }

    const isPasswordMatched = bcrypt.compareSync(reqPassword, user.password);

    if (!isPasswordMatched) {
      return res
        .status(400)
        .send(response.sendFailed("SignIn Failed, password doesn't match"));
    }
    //SignIn successful Now (credentials matched)

    const reqUserType= user.userType;
    const token = AuthJWT.sign({ reqUserName, reqUserType }, Secret_Key, {
      expiresIn: 600000,
    });

    return res
      .status(200)
      .send(response.sendSigninSuccess("SignIn Successful", user, token));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

module.exports = {
  signup,
  signin,
};
