const response = require("../utils/response");
const UserService = require("../services/userService");
const bcrypt = require("bcrypt");

//find User for ADMIN
const getUser = async (req, res) => {
  let queryObjectToFind = {};

  for (let key in req.body) {
    if(key === "accesstoken") continue;
    //This conditon will ensure that regex doesnt work on username and other users cant get differernt users data
    queryObjectToFind[key] = req.body[key];
  }

  for (let key in req.query) {
    if(key === "accesstoken") continue;
    queryObjectToFind[key] = req.body[key];
  }

  try {
    const Users = await UserService.find(queryObjectToFind);
    if (Users.length === 0)
      return res.status(400).send(response.sendFailed("No Users Found"));
    return res.status(200).send(response.sendSuccess("Users Found", Users));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};



//Find a User 
const getUserByUsernameOrEmail = async (req, res) => {
  const reqUsername = req.body.username || req.query.username;
  const reqEmail = req.body.username || req.query.username;
  let queryObjectToFind = {
    $or: [{ username: reqUsername }, { email: reqEmail }],
  };

  try {
    const User = await UserService.findOne(queryObjectToFind);
    if (!User)
      return res.status(400).send(response.sendFailed("No Users Found"));
    return res.status(200).send(response.sendSuccess("User Found", User));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Find an User by id For ADMIN onlu
const getUserById = async (req, res) => {
  let queryObjectToFind = {
    _id: req.params.id,
  };

  try {
    const User = await UserService.findById(queryObjectToFind);
    if (!User)
      return res.status(400).send(response.sendFailed("No Users Found"));
    return res.status(200).send(response.sendSuccess("User Found", User));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Find an User by name or username keywprd. Strictly for ADMIN only
const searchUser = async (req, res) => {
  const searchPattern = req.params.keyword || req.query.keyword;
  const queryObjectToFind = {
    $or: [
      { username: { $regex: searchPattern, $options: "i" } },
      { name: { $regex: searchPattern, $options: "i" } },
    ], 
  };

  try {
    const Users = await UserService.find(queryObjectToFind);
    if (Users.length === 0)
      return res.status(400).send(response.sendFailed("No User Found"));  
    return res.status(200).send(response.sendSuccess("User Found", Users));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};
 
//delete by username or email
const removeUser = async (req, res) => {
  const reqUsername = req.body.username || req.query.username;
  const reqEmail = req.body.email || req.query.email;
  let queryObjectToFind = {
    $or: [{ username: reqUsername }, { email: reqEmail }],
  };

  try {
    const User = await UserService.deleteOne(queryObjectToFind);
    if (!User)
      return res.status(400).send(response.sendFailed("User doesn't Exist"));

    return res.status(200).send(response.sendSuccess("User Deleted", User));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Update User by username or email
const updateUser = async (req, res) => {
  const reqUsername = req.body.username || req.query.username;
  const reqEmail = req.body.email || req.query.email;
  let queryObjectToFind = {
    $or: [{ username: reqUsername }, { email: reqEmail }],
  };
  try {
    // const currentUser = await UserService.findOne({ _id: req.username });
    const user = await UserService.findOne(queryObjectToFind);
    if (!user) {
      return res.status(400).send(response.sendFailed("User doesn't Exist"));
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.password = bcrypt.hashSync(req.body.password, 10) || user.password;
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob;
    user.phone = req.body.phone || user.phone;

    // if (currentUser.userType === "ADMIN") {
    //   user.userType = req.body.userType || user.userType;
    // }

    const updatedUser = await user.save();
    return res
      .status(200)
      .send(response.sendSuccess("User details updated", updatedUser));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

module.exports = {
  getUser,
  getUserById,
  getUserByUsernameOrEmail,
  updateUser,
  removeUser,
  searchUser,
};
