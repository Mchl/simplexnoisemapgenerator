const express = require('express')
const app = express()
const Alea = require('alea')
const FastSimplexNoise = require('fast-simplex-noise');

const Canvas = require('canvas')

  const maxHeight = 10000
  const seaLevel = 4000

const setPixel = (ctx, x, y, r, g, b, a) => {
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`
  ctx.fillRect( x, y, 1, 1 )
}

const colorize = (value) => {
  let r, g, b    
      
  if (value <= seaLevel) {
    r = 0
    g = 0
    b = Math.round(value * 255 / maxHeight)
  } else if (value > 0) {
    r = Math.round(value * 255 / maxHeight)
    g = Math.round((maxHeight - value) * 255 / maxHeight)
    b = 0
  }
  
  return {r, g, b}
}

app.use(express.static('public'))

app.get('/heightmap', (req, res) => {
  console.log(req.query)
  
  const sizeX = parseInt(req.query.sizeX, 10)
  const sizeY = parseInt(req.query.sizeY, 10)
  const offsetX = parseInt(req.query.offsetX, 10)
  const offsetY = parseInt(req.query.offsetY, 10)
  const seed = parseFloat(req.query.seed, 10)
  
  const randomFunction = new Alea(seed)
    
  const height = new FastSimplexNoise({
    frequency: 0.0001,
    min: 0,
    max: maxHeight,
    octaves: 2,
    persistence: 0.8,
    random: randomFunction
  })
  
   
  const heightNoise = new FastSimplexNoise({
    frequency: 0.001,
    min: -maxHeight/5,
    max: maxHeight/5,
    octaves: 16,
    persistence: 0.5,
    random: randomFunction
  })

  
  const canvas = new Canvas(sizeX, sizeY)
  const ctx = canvas.getContext('2d');
  const stream = canvas.pngStream()
  
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      const heightValue = (height.in2D(x + offsetX, y + offsetY) + heightNoise.in2D(x + offsetX, y + offsetY)) / 1.05
      
      //let r = g = b = Math.round(heightValue * 255 / maxHeight)
      
      let {r, g, b} = colorize(heightValue)
            
      setPixel(ctx, x, y, r, g, b, 1)
    }
  }
  
  res.set('Content-Type', 'image/png');
  stream.pipe(res)
})

app.listen(3000, () => {})