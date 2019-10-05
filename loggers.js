const bunyan = require('bunyan')
const uuid = require('uuid').v4

const mainLogger = bunyan.createLogger({name: 'MAPGEN'})

const requestLogger = mainLogger.child({component: 'REQUEST'})

const logRequestMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint()

  req.uuid = uuid()
  req.logger = mainLogger.child({component: 'REQUEST', uuid: req.uuid.substr(0, 8)})

  req.logger.info({method: req.method, originalUrl: req.originalUrl}, 'Request received')
  res.on('finish', function responseSent() {
    const endTime = process.hrtime.bigint()
    const responseData = {
      duration: Number(endTime - startTime) / 1000000,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage
    }

    if (res.statusCode < 400) {
      req.logger.info(responseData, 'Response sent')
    } else if (res.statusCode < 500) {
      req.logger.warn(responseData, 'Response sent')
    } else {
      req.logger.error(responseData, 'Response sent')
    }
  })
  next()
}

module.exports = {
  main: mainLogger,
  logRequestMiddleware
}
