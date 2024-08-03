const express = require("express");
const router = express.Router();
const { checkValidId } = require("../middlewares/CheckValidMongooseId");

const UserController = require("../controllers/userController");
const Validate = require('../middlewares/Validations');
//Middleware
router.use(Validate.verifyToken);

//Routrs for events model
/**
 * @params :id - mongooseId of an event;
 *   :pid - mongooseId of each person added in an event;
 *   :keyword - search keyword to find an event by any keyword present in  name or description    
 */


router.get("/", Validate.isAdmin,  UserController.getUser); 
router.get("/:id", checkValidId, Validate.isAdmin, UserController.getUserById);
router.get("/search/:keyword", Validate.isAdmin, UserController.searchUser);
 
router.delete("/", UserController.removeUser);

router.put("/", UserController.updateUser);

module.exports = router;
