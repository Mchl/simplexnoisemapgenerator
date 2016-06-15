const config = require('./config')
const colorize = require('./colorize')
const Alea = require('alea')
const FastSimplexNoise = require('fast-simplex-noise');
const Canvas = require('canvas')

const generateHeightMap = ({size, offset, seed, zoom}) => {
    
  const randomFunction = new Alea(seed)
  const zoomFactor = Math.pow(2, zoom)
  
  const height = new FastSimplexNoise({
    frequency: 0.0001,
    min: 0,
    max: config.maxHeight,
    octaves: 2,
    persistence: 0.8,
    random: randomFunction
  })
  
  const heightNoise = new FastSimplexNoise({
    frequency: 0.001,
    min: -config.maxHeight/5,
    max: config.maxHeight/5,
    octaves: 16,
    persistence: 0.5,
    random: randomFunction
  })
  
  const canvas = new Canvas(size.x, size.y)
  const ctx = canvas.getContext('2d');
  const stream = canvas.pngStream()
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
   
  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      const heightValue = (
        height.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor) 
        + heightNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor)
        ) / 1.05
           
      let {r, g, b} = colorize(heightValue)
      const index = 4 * (y * size.x + x)
      pixels.data[index] = r
      pixels.data[index+1] = g
      pixels.data[index+2] = b
      pixels.data[index+3] = 255
    }
  }
  ctx.putImageData(pixels, 0, 0)
  
  return stream
}

module.exports = generateHeightMap