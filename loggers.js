const bunyan = require('bunyan')
const uuid = require('uuid').v4

const mainLogger = bunyan.createLogger({name: 'MAPGEN'})

const requestLogger = mainLogger.child({component: 'REQUEST'})

const logRequestMiddleware = (res, req, next) => {
  const startTime = process.hrtime()
  
  req.uuid = uuid()
  
  requestLogger.info(req.uuid.substr(0,8), {method: req.method, path: req.path})
  console.log(req)
  res.on('finish', function responseSent() {
      const diff = process.hrtime(time);
      req.log.info(req.uuid.substr(0,8), 'response sent', {uuid: req.uuid, duration: diff[0] * 1e3 + diff[1] * 1e-6});
    });
  next()
}

module.exports = {
  main: mainLogger,
  logRequestMiddleware
}