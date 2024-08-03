const ObjectId = require('mongoose').Types.ObjectId;
const response = require('../utils/response');

exports.checkValidId = (req, res, next) => {
    
    const id = req.body.id || req.query.id || req.params.id || req.body.pid || req.query.pid || req.params.pid;

    if (ObjectId.isValid(id)) {
        next();
    } else {
         return res.status(400).send(response.sendFailed("Invalid MongooseID"));
    }
}