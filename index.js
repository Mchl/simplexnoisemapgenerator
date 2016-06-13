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

const generateHeightMap = ({size, offset, seed, zoom}) => {
    
  const randomFunction = new Alea(seed)
  const zoomFactor = Math.pow(2, zoom)
  
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
  
  const canvas = new Canvas(size.x, size.y)
  const ctx = canvas.getContext('2d');
  const stream = canvas.pngStream()
   
  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      const heightValue = (
        height.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor) 
        + heightNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor)
        ) / 1.05
           
      let {r, g, b} = colorize(heightValue)
            
      setPixel(ctx, x, y, r, g, b, 1)
    }
  }
  
  return stream
}

app.use(express.static('public'))

app.get('/heightmap/:seed/:zoom/:offsetX/:offsetY.png', (req, res) => {
 
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
  
  generateHeightMap(mapConfig).pipe(res)
})

app.listen(3000, () => {})