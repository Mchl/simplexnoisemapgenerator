const config = require('./config')
const logger = require('./loggers').main.child({component: 'COLORIZE'})

// Based on https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Maps/Conventions
const topographyLevels = {
  36: {r: 245, g: 244, b: 242},
  35: {r: 235, g: 233, b: 229},
  34: {r: 224, g: 222, b: 216},
  33: {r: 213, g: 209, b: 200},
  32: {r: 202, g: 195, b: 184},
  31: {r: 194, g: 185, b: 169},
  30: {r: 186, g: 174, b: 154},
  29: {r: 179, g: 164, b: 139},
  28: {r: 172, g: 154, b: 124},
  27: {r: 171, g: 145, b: 104},
  26: {r: 170, g: 135, b: 83 },
  25: {r: 178, g: 144, b: 87 },
  24: {r: 185, g: 152, b: 90 },
  23: {r: 190, g: 160, b: 99 },
  22: {r: 195, g: 167, b: 107},
  21: {r: 199, g: 176, b: 119},
  20: {r: 202, g: 185, b: 130},
  19: {r: 207, g: 194, b: 144},
  18: {r: 211, g: 202, b: 157},
  17: {r: 217, g: 208, b: 160},
  16: {r: 222, g: 214, b: 163},
  15: {r: 227, g: 220, b: 173},
  14: {r: 232, g: 225, b: 182},
  13: {r: 236, g: 230, b: 187},
  12: {r: 239, g: 235, b: 192},
  11: {r: 232, g: 232, b: 187},
  10: {r: 225, g: 228, b: 181},
  9: {r: 217, g: 222, b: 176},
  8: {r: 209, g: 215, b: 171},
  7: {r: 199, g: 210, b: 161},
  6: {r: 189, g: 204, b: 150},
  5: {r: 179, g: 201, b: 147},
  4: {r: 168, g: 198, b: 143},
  3: {r: 158, g: 195, b: 141},
  2: {r: 148, g: 191, b: 139},
  1: {r: 160, g: 200, b: 152},
  0: {r: 172, g: 208, b: 165},

  '-1': {r: 216, g: 242, b: 254},
  '-2': {r: 207, g: 239, b: 255},
  '-3': {r: 198, g: 236, b: 255},
  '-4': {r: 192, g: 232, b: 255},
  '-5': {r: 185, g: 227, b: 255},
  '-6': {r: 179, g: 223, b: 253},
  '-7': {r: 172, g: 219, b: 251},
  '-8': {r: 167, g: 215, b: 249},
  '-9': {r: 161, g: 210, b: 247},
  '-10': {r: 156, g: 206, b: 244},
  '-11': {r: 150, g: 201, b: 240},
  '-12': {r: 146, g: 197, b: 237},
  '-13': {r: 141, g: 193, b: 234},
  '-14': {r: 137, g: 189, b: 231},
  '-15': {r: 132, g: 185, b: 227},
  '-16': {r: 127, g: 182, b: 225},
  '-17': {r: 121, g: 178, b: 222},
  '-18': {r: 117, g: 175, b: 219},
  '-19': {r: 113, g: 171, b: 216},
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
    ? -19 + (value * 19 / config.seaLevel)
    : (value - config.seaLevel) * 36 / config.landHeight

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
