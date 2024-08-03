const Jwt = require("jsonwebtoken");
const { Secret_Key } = require("../configs/authConfig");
const constants = require("../utils/constants");
const UserService = require("../services/userService");
const response = require("../utils/response");
const {
  isValidEmailAddress,
  isValidPassword,
  isValidPhone
} = require("../utils/isValidInput");
const { messages } = require("../utils/constants");

exports.verifyToken = async (req, res, next) => {
  const token =
    req.headers["acces-token"] ||
    req.body.accesstoken ||
    req.params.accesstoken ||
    req.query.accesstoken;

  if (!token) {
    return res
      .status(400)
      .send(response.sendFailed("Bad Request! AuthToken not found"));
  }

  //If the token is provided, we need to verify it.
  Jwt.verify(token, Secret_Key, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized! Token Not matched",
        err: err,
      });
    }
    // extract the username from the token
    req.username = decoded.reqUserName; // decoded username from token
    req.userType = decoded.reqUserType; // decoded userType from token
    req.token = token; // setting req.token equals to token
  });

  next();
};

exports.isAdmin = async (req, res, next) => {
  const reqUserName = req.username;
  try {
    let queryToFindUser = { username: reqUserName };
    let user = await UserService.findOne(queryToFindUser);
    if (!user) {
      return res
        .status(400)
        .send(response.sendFailed("Bad Request! User not found"));
    }

    if (user.userType !== constants.userType.admin) {
      return res
        .status(400)
        .send(response.sendFailed("UnAuthorized! ADMIN priviledges required"));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }

  next();
};

exports.logincheck = async (req, res, next) => {
  let reqUserName =
    req.body.username || req.params.username || req.query.username;
  let reqEmail = req.body.email || req.params.email || req.query.email;
  let reqPassword =
    req.body.password || req.params.password || req.query.password;

  if (!reqUserName && !reqEmail) {
    return res
      .status(400)
      .send(response.sendFailed("Both username and email not present"));
  }
  if (!reqPassword) {
    return res.status(400).send(response.sendFailed("password not present"));
  }

  next();
};

exports.signupCheck = async (req, res, next) => {
  const reqUserName = req.body.username || req.query.username;
  const reqEmail = req.body.email || req.query.email;
  const reqPassword = req.body.password || req.query.password;
  const reqDOB = req.body.dob || req.query.dob;
  const reqPhone = req.body.phone || req.query.phone;
  const reqFullName = req.body.fullName || req.query.fullName;

  if (!reqUserName || reqUserName.length < 3)
    return res
      .status(400)
      .send(
        response.sendFailed(
          "Provide Valid username. username must be 3 letters or more"
        )
      );

  if (!reqEmail || !isValidEmailAddress(reqEmail))
    return res.status(400).send(response.sendFailed("Provide Valid Email"));

  if (!reqDOB)
    return res.status(400).send(response.sendFailed("Provide date of birth"));

  if (!reqPassword || !isValidPassword(reqPassword))
    return res
      .status(400)
      .send(
        response.sendFailed("Provide Valid Password. Must be atleast 8 letters")
      );

  if (!reqPhone || !isValidPhone(reqPhone))
    return res
      .status(400)
      .send(
        response.sendFailed("Provide Valid Phone. Must be atleast 8 letters ")
      );

  if (!reqFullName)
    return res.status(400).send(response.sendFailed("Name is required"));

  const queryToFindUser = {
    $or: [{ username: reqUserName }, { email: reqEmail }],
  };
  try {
    const user = await UserService.find(queryToFindUser);
    console.log(user);
    if (user.length > 0) {
      return res
        .status(400)
        .send(response.sendFailed("User Or Email already exists"));
    }
  } catch (err) {
    return res.status(500).send(response.sendError(err));
  }
  next();
};
