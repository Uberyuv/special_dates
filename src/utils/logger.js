const fs = require('fs');


const logger = (filepath, data)=>{

  function closeFd(fd) {
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  }

  fs.open(filepath, 'a', (err, fd) => {
    if (err) throw err;
  
    try {
      fs.appendFile(fd, data+"\n", 'utf8', (err) => {
        closeFd(fd);
        if (err) throw err;
      });
    } catch (err) {
      closeFd(fd);
      throw err;
    }
  });


}

exports.reqLogger = (req, res, next) => {

    const data = req.url +" "+ new Date();
    const filepath = './src/Logs/request_logs.txt'

    logger(filepath, data);
    // console.log(req, new Date());
    // console.log(req.body);
    // console.log(req.params);
    next();
};



exports.errorLogger = (err) => {

  const data = new Date() +" "+ err;
  const filepath = './src/Logs/error_logs.txt'
  logger(filepath, data);

};