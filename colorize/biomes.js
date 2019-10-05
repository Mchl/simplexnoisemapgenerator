const config = require('../config')
const heightmap = require('./heightmap')

const Biomes = {
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

BIOME_DIAGRAM[0][0] = Biomes.SUBTROPICAL_DESERT
BIOME_DIAGRAM[1][0] = Biomes.GRASSLAND
BIOME_DIAGRAM[2][0] = Biomes.TROPICAL_SEASONAL_FOREST
BIOME_DIAGRAM[3][0] = Biomes.TROPICAL_SEASONAL_FOREST
BIOME_DIAGRAM[4][0] = Biomes.TROPICAL_RAINFOREST
BIOME_DIAGRAM[5][0] = Biomes.TROPICAL_RAINFOREST

BIOME_DIAGRAM[0][1] = Biomes.TEMPERATE_DESERT
BIOME_DIAGRAM[1][1] = Biomes.GRASSLAND
BIOME_DIAGRAM[2][1] = Biomes.GRASSLAND
BIOME_DIAGRAM[3][1] = Biomes.TEMPERATE_DECIDUOUS_FOREST
BIOME_DIAGRAM[4][1] = Biomes.TEMPERATE_DECIDUOUS_FOREST
BIOME_DIAGRAM[5][1] = Biomes.TEMPERATE_RAINFOREST

BIOME_DIAGRAM[0][2] = Biomes.TEMPERATE_DESERT
BIOME_DIAGRAM[1][2] = Biomes.TEMPERATE_DESERT
BIOME_DIAGRAM[2][2] = Biomes.SHRUBLAND
BIOME_DIAGRAM[3][2] = Biomes.SHRUBLAND
BIOME_DIAGRAM[4][2] = Biomes.TAIGA
BIOME_DIAGRAM[5][2] = Biomes.TAIGA

BIOME_DIAGRAM[0][3] = Biomes.SCORCHED
BIOME_DIAGRAM[1][3] = Biomes.BARE
BIOME_DIAGRAM[2][3] = Biomes.TUNDRA
BIOME_DIAGRAM[3][3] = Biomes.SNOW
BIOME_DIAGRAM[4][3] = Biomes.SNOW
BIOME_DIAGRAM[5][3] = Biomes.SNOW

const BIOME_COLORS = {}

BIOME_COLORS[Biomes.BARE]                        = [187, 187, 187]
BIOME_COLORS[Biomes.GRASSLAND]                   = [196, 212, 170]
BIOME_COLORS[Biomes.SCORCHED]                    = [153, 153, 153]
BIOME_COLORS[Biomes.SHRUBLAND]                   = [196, 204, 187]
BIOME_COLORS[Biomes.SNOW]                        = [255, 255, 255]
BIOME_COLORS[Biomes.SUBTROPICAL_DESERT]          = [233, 221, 199]
BIOME_COLORS[Biomes.TAIGA]                       = [204, 212, 187]
BIOME_COLORS[Biomes.TEMPERATE_DECIDUOUS_FOREST]  = [180, 201, 169]
BIOME_COLORS[Biomes.TEMPERATE_DESERT]            = [228, 232, 202]
BIOME_COLORS[Biomes.TEMPERATE_RAINFOREST]        = [164, 196, 168]
BIOME_COLORS[Biomes.TROPICAL_RAINFOREST]         = [156, 187, 169]
BIOME_COLORS[Biomes.TROPICAL_SEASONAL_FOREST]    = [169, 204, 164]
BIOME_COLORS[Biomes.TUNDRA]                      = [221, 221, 187]

const biomes = (height, rainfall) => {
  let r, g, b

  if (height <= config.seaLevel) {
    const rgb = heightmap(height)
    r = rgb.r
    g = rgb.g
    b = rgb.b
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

module.exports = biomes
