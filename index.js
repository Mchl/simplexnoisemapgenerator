const express = require('express')
const app = express()

const generateTile = require('./generate-heightmap')
const loggers = require('./loggers')

app.use(express.static('public'))

app.use(loggers.logRequestMiddleware)

app.get('/heightmap/:seed/:zoom/:offsetX/:offsetY.png', (req, res, next) => {

  const mapConfig = {
    size: {
      x: 256,
      y: 256
    },
    zoom: -parseInt(req.params.zoom, 10),
    offset: {
      x: parseInt(req.params.offsetX, 10) * 256,
      y: parseInt(req.params.offsetY, 10) * 256
    },
    seed: parseFloat(req.params.seed, 10)
  }

  res.set('Content-Type', 'image/png');

  Promise.resolve(
    generateTile(mapConfig).pipe(res)
  ).catch(next)
})

app.use((err, req, res, next) => {
  const error = {
    message: err.message,
    stack: err.stack
  }
  req.logger.error({error}, 'Request error')
  res.status('500').send()
})

app.listen(3000, () => {})
