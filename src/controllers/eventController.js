const Event = require("../models/eventModel");
const response = require("../utils/response");
const EventService = require("../services/eventService");

//Controller Logics

const addEvent = async (req, res) => {
  let queryObjectToBeAddedToDb = {
    username: req.username,
    eventName: req.body.eventName,
    eventDate: req.body.eventDate,
    eventDescription: req.body.eventDescription,
  };

  try {
    const event = await EventService.create(queryObjectToBeAddedToDb);
    console.log(event);
    return res
      .status(201)
      .send(response.sendSuccess("Event Added Succesfully", event));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};



//find Event
const getEvent = async (req, res) => {
  // const username = req.params.username;
  let queryObjectToFind = {};
  // let query = [];

  for (let key in req.body) {
    if (key === "username" || key === "eventDate") {
      //This conditon will ensure that regex doesnt work on username and other users cant get differernt users data
      queryObjectToFind[key] = req.body[key];
      // let qq = {};
      // qq[key] = req.body[key];
      // query.push(qq);
    } else {
      // let qq = {};
      // qq[key] = { $regex: req.body[key], $options: "i" };
      // query.push(qq);
      queryObjectToFind[key] = { $regex: req.body[key], $options: "i" };
    }
  }

  // queryObjectToFind = { $or: query };

  for (let key in req.query) {
    queryObjectToFind[key] = { $regex: req.query[key], $options: "i" };
  }

  try {
    const events = await EventService.find(queryObjectToFind);
    if (events.length === 0)
      return res.status(400).send(response.sendFailed("No Events Found"));
    return res.status(200).send(response.sendSuccess("Events Found", events));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//GEt all  the events
const getAllEvent = async (req, res) => {
  let queryObjectToFind = {};

  try {
    const events = await EventService.find(queryObjectToFind);
    if (events.length === 0)
      return res.status(400).send(response.sendFailed("No Events Found"));
    return res.status(200).send(response.sendSuccess("Events Found", events));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Find an event by id
const getAnEventById = async (req, res) => {
  let reqEventId = req.body.id || req.query.id || req.params.id;
  let queryObjectToFind = { _id: reqEventId };

  try {
    const event = await EventService.findById(queryObjectToFind);
    if (!event)
      return res.status(400).send(response.sendFailed("No Events Found"));
    return res.status(200).send(response.sendSuccess("Event Found", event));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Find an event by id
const searchEvent = async (req, res) => {
  console.log("search");
  const searchPattern = req.params.keyword || req.query.keyword;
  const queryObjectToFind = {
    $or: [
      { eventName: { $regex: searchPattern, $options: "i" } },
      { eventDescription: { $regex: searchPattern, $options: "i" } },
    ],
  };

  try {
    const events = await EventService.find(queryObjectToFind);
    if (events.length === 0)
      return res.status(400).send(response.sendFailed("No Event Found"));
    return res.status(200).send(response.sendSuccess("Event Found", events));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//delete by id
const removeEvent = async (req, res) => {
  let reqEventId = req.body.id || req.query.id || req.params.id;
  let queryObjectToFind = { _id: reqEventId };

  try {
    const event = await EventService.deleteById(queryObjectToFind);
    if (!event)
      return res.status(400).send(response.sendFailed("Event doesn't Exist"));

    return res.status(200).send(response.sendSuccess("Event Deleted", event));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};


//Update event and its people list
const updateEvent = async (req, res) => {
  let reqEventId = req.body.id || req.query.id || req.params.id;
  let queryObjectToFind = { _id: reqEventId };

  try {
    const event = await EventService.findById(queryObjectToFind);
    if (!event) {
      return res.status(400).send(response.sendFailed("Event doesn't Exist"));
    }

    event.eventName = req.body.eventName || event.eventName;
    event.eventDate = req.body.eventDate || event.eventDate;
    event.eventDescription =
      req.body.eventDescription || event.eventDescription;
    const updatedEvent = await event.save();
    return res
      .status(200)
      .send(response.sendSuccess("Event details updated", updatedEvent));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//add people in an event
const addPeopleInEvent = async (req, res) => {
  let reqEventId = req.body.id || req.params.id || req.query.id;
  let QueryToFind = {
    _id: reqEventId,
  };
  //   console.log(Query);
  try {
    const event = await EventService.findById(QueryToFind);
    if (!event) {
      return res.status(400).send(response.sendFailed("Event doesn't Exist"));
    }
    req.body.persons.forEach((person) => {
      event.persons.push({
        name: person.name,
        phone: person.phone,
        address: person.address,
      });
    });

    const updatedEvent = await event.save();
    // console.log(updatedEvent);
    return res
      .status(200)
      .send(response.sendSuccess("People added to event", updatedEvent));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//remove people in an event
const removePersonFromEvent = async (req, res) => {
  let reqpersonId = req.body.pid || req.params.pid || req.query.pid;

  let Query = {
    "persons._id": reqpersonId,
  }; 
  let update = {
    $pull: { persons: { _id: reqpersonId } },
  };

  try {
    const event = await EventService.update(Query, update);
    console.log(event);
    if (!event) {
      return res.status(400).send(response.sendFailed("Event doesn't Exist"));
    }
    const updatedEvent = await event.save();
    // console.log(updatedEvent);
    return res
      .status(200)
      .send(response.sendSuccess("Person removed from event", updatedEvent));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

//Update people info in an event
const updatePeopleInfoInEvent = async (req, res) => {
  let reqpersonId = req.body.pid || req.params.pid || req.query.pid;
  let Query = {
    "persons._id": reqpersonId,
  };
  let update = {
    $set: {
      "persons.$.name": req.body.name,
      "persons.$.phone": req.body.phone,
      "persons.$.address": req.body.address,
    },
  };

  try {
    const updatedEvent = await EventService.update(Query, update);
    if (!updatedEvent) {
      return res.status(400).send(response.sendFailed("Event doesn't Exist"));
    }
    return res
      .status(200)
      .send(response.sendSuccess("People added to event", updatedEvent));
  } catch (err) {
    console.log(err);
    return res.status(500).send(response.sendError(err));
  }
};

module.exports = {
  addEvent,
  getEvent,
  getAllEvent,
  getAnEventById,
  searchEvent,
  updateEvent,
  removeEvent,
  addPeopleInEvent,
  removePersonFromEvent,
  updatePeopleInfoInEvent,
};
