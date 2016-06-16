const config = require('./config')
const logger = require('./loggers').main.child({component: 'COLORIZE'})

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
  let r, g, b    
      
  if (value <= config.seaLevel) {
    r = 0
    g = 0
    b = Math.round(value * 127 / config.seaLevel)
  } else {
    r = Math.round((value - config.seaLevel) * 255 / config.landHeight)
    g = Math.round((config.maxHeight - value) * 192 / config.landHeight)
    b = 0
  }
  
  return {r, g, b}
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