const Event = require("../models/eventModel");

const create = (queryObjectToBeAddedToDb) => {
  const newEvent = Event.create(queryObjectToBeAddedToDb);
  return newEvent;
};

const find = (queryObjectToFind) => {
  const foundevents = Event.find(queryObjectToFind);
  return foundevents;
};

const findById = (queryObjectToFind) => {
  const foundEvent = Event.findOne(queryObjectToFind);
  return foundEvent;
};

const deleteById = (queryObjectToFind) => {
  const deletedEvent = Event.findByIdAndDelete(queryObjectToFind);
  return deletedEvent;
};

const update = (filter, updateQuery) => {
  const updatedEvent = Event.findOneAndUpdate(filter, updateQuery, {
    returnOriginal: false,
  });
  return updatedEvent;
};

module.exports = {
  create,
  find,
  findById,
  deleteById,
  update,
};
