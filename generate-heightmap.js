const config = require('./config')
const colorize = require('./colorize')
const Alea = require('alea')
const FastSimplexNoise = require('fast-simplex-noise');
const Canvas = require('canvas')
const ImageData = Canvas.ImageData

function setPixel (x, y, r, g, b, a) {
  if (!this.width) {
    this.width = Math.sqrt(this.length / 4)
  }
  const index = y * this.width + x
  
  this[4 * index    ] = r
  this[4 * index + 1] = g
  this[4 * index + 2] = b
  this[4 * index + 3] = a
}

const generateHeightMap = ({size, offset, seed, zoom}) => {
    
  const randomFunction = new Alea(seed)
  const zoomFactor = Math.pow(2, zoom)
  
  const landMassNoise = new FastSimplexNoise({
    frequency: 0.0001,
    min: 0,
    max: config.maxHeight,
    octaves: 2,
    persistence: 0.8,
    random: randomFunction
  })
  
  const featureNoise = new FastSimplexNoise({
    frequency: 0.001,
    min: -config.maxHeight/5,
    max: config.maxHeight/5,
    octaves: 16,
    persistence: 0.5,
    random: randomFunction
  }) 
     
  let pixels = new Uint8ClampedArray(size.x * size.y * 4)
  pixels.setPixel = setPixel
  
  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      const height = (
        landMassNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor) 
        + featureNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor)
      ) / 1.05
           
      const {r, g, b} = colorize(height)
      
      pixels.setPixel(x, y, r, g, b, 255)

    }
  }
  
  return pixels
}

const generateTile = (tileConfig) => {
  const pixels = generateHeightMap(tileConfig)
  const {size} = tileConfig
  
  const canvas = new Canvas(size.x, size.y)
  const ctx = canvas.getContext('2d')
    
  ctx.putImageData(new ImageData(pixels, size.x, size.y) , 0, 0)
  
  return canvas.pngStream()
}

module.exports = generateTile