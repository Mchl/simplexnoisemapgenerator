const bunyan = require('bunyan')
const uuid = require('uuid').v4

const mainLogger = bunyan.createLogger({name: 'MAPGEN'})

const requestLogger = mainLogger.child({component: 'REQUEST'})

const logRequestMiddleware = (req, res, next) => {
  const startTime = process.hrtime()
  
  req.uuid = uuid()
  
  requestLogger.info(req.uuid.substr(0, 8), req.method, req.originalUrl)
  res.on('finish', function responseSent() {
    const diff = process.hrtime(startTime)
    const responseData = {
      duration: diff[0] * 1e3 + diff[1] * 1e-6,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage
    }

    if (res.statusCode < 400) {
      requestLogger.info(req.uuid.substr(0, 8), 'response sent', responseData)
    } else if (res.statusCode < 500) {
      requestLogger.warn(req.uuid.substr(0, 8), 'response sent', responseData)
    } else {
      requestLogger.error(req.uuid.substr(0, 8), 'response sent', responseData)
    }
  })
  next()
}

module.exports = {
  main: mainLogger,
  logRequestMiddleware
}