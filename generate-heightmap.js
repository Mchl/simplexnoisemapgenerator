const config = require('./config')
const colorize = require('./colorize')
const Alea = require('alea')
const FastSimplexNoise = require('fast-simplex-noise');
const {createCanvas, createImageData} = require('canvas')
const Bezier = require('bezier-js')

function setPixel (x, y, r, g, b, a) {
  if (!this.width) {
    this.width = Math.sqrt(this.length / 4)
  }
  const index = y * this.width + x

  this[4 * index + 0] = r
  this[4 * index + 1] = g
  this[4 * index + 2] = b
  this[4 * index + 3] = a
}

const landmassProfileCurve =
  [
    ...new Bezier({x:0, y:0}, {x:0.4, y:0.15}, {x:0.45, y:0.5}, {x:0.5, y:0.5}).getLUT(500),
    ...new Bezier({x:0.5, y:0.5}, {x:0.5, y:0.7}, {x:1, y:0.7}, {x:1, y:1}).getLUT(500)
  ]

const landmassProfile = h =>
  config.landMassProfileEnabled
    ? landmassProfileCurve.find(({x}) => x >= h).y
    : h

const generateHeightMap = ({size, offset, seed, zoom, tiletype}) => {

  const randomFunction = new Alea(seed)
  const zoomFactor = Math.pow(2, zoom)

  const landMassNoise = new FastSimplexNoise({
    frequency: 0.0001,
    min: 0,
    max: 1,
    octaves: 2,
    persistence: 0.8,
    random: randomFunction
  })

  const featureNoise = new FastSimplexNoise({
    frequency: 0.0005,
    min: -config.maxHeight * 0.2,
    max: config.maxHeight * 0.2,
    octaves: 16,
    persistence: 0.5,
    random: randomFunction
  })

  const rainfallNoise = new FastSimplexNoise({
    frequency: 0.0001,
    min: 0,
    max: 6,
    octaves: 16,
    persistence: 0.8,
    random: randomFunction
  })

  let pixels = new Uint8ClampedArray(size.x * size.y * 4)
  pixels.setPixel = setPixel

  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      const height = (
        config.maxHeight * landmassProfile(landMassNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor))
        + featureNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor)
      ) / 1.2

      let rgb = {}

      switch(tiletype) {
        case 'heightmap':
          rgb = colorize.heightmap(height)
          break
        case 'biomes': {
          const rainfall = rainfallNoise.in2D((x + offset.x) * zoomFactor, (y + offset.y) * zoomFactor)
          rgb = colorize.biomes(height, rainfall)
          break;
        }
      }
      pixels.setPixel(x, y, ...Object.values(rgb), 255)

    }
  }

  return pixels
}

const generateTile = (tileConfig) => {
  const pixels = generateHeightMap(tileConfig)
  const {size} = tileConfig

  const canvas = createCanvas(size.x, size.y)
  const ctx = canvas.getContext('2d', {alpha: false})

  ctx.putImageData(createImageData(pixels, size.x, size.y) , 0, 0)

  return canvas.createPNGStream()
}

module.exports = generateTile
