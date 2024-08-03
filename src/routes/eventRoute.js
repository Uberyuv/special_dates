const express = require("express");
const router = express.Router();
const { checkValidId } = require("../middlewares/CheckValidMongooseId");

const EventController = require("../controllers/eventController");
// const Validate = require('../middlewares/Validations');
//Middleware
// router.use(Validate.verifyToken);

//Routrs for events model
/**
 * @params :id - mongooseId of an event;
 *   :pid - mongooseId of each person added in an event;
 *   :keyword - search keyword to find an event by any keyword present in  name or description    
 */

router.post("/", EventController.addEvent);

router.get("/", EventController.getEvent);
router.get("/all", EventController.getAllEvent); //For ADMIN only
router.get("/:id", checkValidId, EventController.getAnEventById);
router.get("/search/:keyword", EventController.searchEvent);

router.delete("/:id", checkValidId, EventController.removeEvent);

router.put("/:id", checkValidId, EventController.updateEvent);
router.put("/addpeople/:id", checkValidId, EventController.addPeopleInEvent);
router.put(
  "/removeperson/:pid", 
  checkValidId,
  EventController.removePersonFromEvent
);
router.put(
  "/updateperson/:pid",
  checkValidId,
  EventController.updatePeopleInfoInEvent
);

module.exports = router;
