const config = require('./config')
const logger = require('./loggers').main.child({component: 'COLORIZE'})

// Based on https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Maps/Conventions
const topographyLevels = {
  18: {r: 245, g: 244, b: 242},
  17: {r: 224, g: 222, b: 216},
  16: {r: 202, g: 195, b: 184},
  15: {r: 186, g: 174, b: 154},
  14: {r: 172, g: 154, b: 124},
  13: {r: 170, g: 135, b: 83},
  12: {r: 185, g: 152, b: 90},
  11: {r: 195, g: 167, b: 107},
  10: {r: 202, g: 185, b: 130},
  9: {r: 211, g: 202, b: 157},
  8: {r: 222, g: 214, b: 163},
  7: {r: 232, g: 225, b: 182},
  6: {r: 239, g: 235, b: 192},
  5: {r: 225, g: 228, b: 181},
  4: {r: 209, g: 215, b: 171},
  3: {r: 189, g: 204, b: 150},
  2: {r: 168, g: 198, b: 143},
  1: {r: 148, g: 191, b: 139},
  0: {r: 172, g: 208, b: 165},

  '-1': {r:216, g: 242, b: 254},
  '-2': {r:198, g: 236, b: 255},
  '-3': {r:185, g: 227, b: 255},
  '-4': {r:172, g: 219, b: 251},
  '-5': {r:161, g: 210, b: 247},
  '-6': {r:150, g: 201, b: 240},
  '-7': {r:141, g: 193, b: 234},
  '-8': {r:132, g: 185, b: 227},
  '-9': {r:121, g: 178, b: 222},
  '-10': {r:113, g: 171, b: 216},
}

const BIOME = {
  BARE:                       Symbol('BARE'),
  GRASSLAND:                  Symbol('GRASSLAND'),
  SCORCHED:                   Symbol('SCORCHED'),
  SHRUBLAND:                  Symbol('SHRUBLAND'),
  SNOW:                       Symbol('SNOW'),
  SUBTROPICAL_DESERT:         Symbol('SUBTROPICAL_DESERT'),
  TAIGA:                      Symbol('TAIGA'),
  TEMPERATE_DECIDUOUS_FOREST: Symbol('TEMPERATE_DECIDUOUS_FOREST'),
  TEMPERATE_DESERT:           Symbol('TEMPERATE_DESERT'),
  TEMPERATE_RAINFOREST:       Symbol('TEMPERATE_RAINFOREST'),
  TROPICAL_RAINFOREST:        Symbol('TROPICAL_RAINFOREST'),
  TROPICAL_SEASONAL_FOREST:   Symbol('TROPICAL_SEASONAL_FOREST'),
  TUNDRA:                     Symbol('TUNDRA')
}

const BIOME_DIAGRAM = [[],[],[],[],[],[]]

BIOME_DIAGRAM[0][0] = BIOME.SUBTROPICAL_DESERT
BIOME_DIAGRAM[1][0] = BIOME.GRASSLAND
BIOME_DIAGRAM[2][0] = BIOME.TROPICAL_SEASONAL_FOREST
BIOME_DIAGRAM[3][0] = BIOME.TROPICAL_SEASONAL_FOREST
BIOME_DIAGRAM[4][0] = BIOME.TROPICAL_RAINFOREST
BIOME_DIAGRAM[5][0] = BIOME.TROPICAL_RAINFOREST

BIOME_DIAGRAM[0][1] = BIOME.TEMPERATE_DESERT
BIOME_DIAGRAM[1][1] = BIOME.GRASSLAND
BIOME_DIAGRAM[2][1] = BIOME.GRASSLAND
BIOME_DIAGRAM[3][1] = BIOME.TEMPERATE_DECIDUOUS_FOREST
BIOME_DIAGRAM[4][1] = BIOME.TEMPERATE_DECIDUOUS_FOREST
BIOME_DIAGRAM[5][1] = BIOME.TEMPERATE_RAINFOREST

BIOME_DIAGRAM[0][2] = BIOME.TEMPERATE_DESERT
BIOME_DIAGRAM[1][2] = BIOME.TEMPERATE_DESERT
BIOME_DIAGRAM[2][2] = BIOME.SHRUBLAND
BIOME_DIAGRAM[3][2] = BIOME.SHRUBLAND
BIOME_DIAGRAM[4][2] = BIOME.TAIGA
BIOME_DIAGRAM[5][2] = BIOME.TAIGA

BIOME_DIAGRAM[0][3] = BIOME.SCORCHED
BIOME_DIAGRAM[1][3] = BIOME.BARE
BIOME_DIAGRAM[2][3] = BIOME.TUNDRA
BIOME_DIAGRAM[3][3] = BIOME.SNOW
BIOME_DIAGRAM[4][3] = BIOME.SNOW
BIOME_DIAGRAM[5][3] = BIOME.SNOW

const BIOME_COLORS = {}

BIOME_COLORS[BIOME.BARE]                        = [187, 187, 187]
BIOME_COLORS[BIOME.GRASSLAND]                   = [196, 212, 170]
BIOME_COLORS[BIOME.SCORCHED]                    = [153, 153, 153]
BIOME_COLORS[BIOME.SHRUBLAND]                   = [196, 204, 187]
BIOME_COLORS[BIOME.SNOW]                        = [255, 255, 255]
BIOME_COLORS[BIOME.SUBTROPICAL_DESERT]          = [233, 221, 199]
BIOME_COLORS[BIOME.TAIGA]                       = [204, 212, 187]
BIOME_COLORS[BIOME.TEMPERATE_DECIDUOUS_FOREST]  = [180, 201, 169]
BIOME_COLORS[BIOME.TEMPERATE_DESERT]            = [228, 232, 202]
BIOME_COLORS[BIOME.TEMPERATE_RAINFOREST]        = [164, 196, 168]
BIOME_COLORS[BIOME.TROPICAL_RAINFOREST]         = [156, 187, 169]
BIOME_COLORS[BIOME.TROPICAL_SEASONAL_FOREST]    = [169, 204, 164]
BIOME_COLORS[BIOME.TUNDRA]                      = [221, 221, 187]


const height = (value) => {
  const level = value <= config.seaLevel
    ? -10 + (value * 10 / config.seaLevel)
    : (value - config.seaLevel) * 18 / config.landHeight
  
  return topographyLevels[Math.round(level)]
}

const biomes = (height, rainfall) => {
  let r, g, b

  if (height <= config.seaLevel) {
    r = 0
    g = 0
    b = Math.round(height * 127 / config.seaLevel)
  } else {
    const rainfallZone = Math.floor(rainfall)

    const elevation = height - config.seaLevel

    const elevationZone = config.elevationZones.reduceRight((previousValue, currentValue, index) => {
      return elevation <= currentValue ? index : previousValue
    }, 0)


    const biome =  BIOME_DIAGRAM[rainfallZone][elevationZone]

    const colors = BIOME_COLORS[biome]

    r = colors[0]
    g = colors[1]
    b = colors[2]
  }

  return {r, g, b}
}

module.exports = {
  height,
  biomes
}
