const config = require('../config')

// Based on https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Maps/Conventions
const TOPOGRAPHY_COLORS_LAND = {
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
  26: {r: 170, g: 135, b: 83},
  25: {r: 178, g: 144, b: 87},
  24: {r: 185, g: 152, b: 90},
  23: {r: 190, g: 160, b: 99},
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
}

const TOPOGRAPHY_COLORS_SEA = {
  0: {r: 216, g: 242, b: 254},
  1: {r: 207, g: 239, b: 255},
  2: {r: 198, g: 236, b: 255},
  3: {r: 192, g: 232, b: 255},
  4: {r: 185, g: 227, b: 255},
  5: {r: 179, g: 223, b: 253},
  6: {r: 172, g: 219, b: 251},
  7: {r: 167, g: 215, b: 249},
  8: {r: 161, g: 210, b: 247},
  9: {r: 156, g: 206, b: 244},
  10: {r: 150, g: 201, b: 240},
  11: {r: 146, g: 197, b: 237},
  12: {r: 141, g: 193, b: 234},
  13: {r: 137, g: 189, b: 231},
  14: {r: 132, g: 185, b: 227},
  15: {r: 127, g: 182, b: 225},
  16: {r: 121, g: 178, b: 222},
  17: {r: 117, g: 175, b: 219},
  18: {r: 113, g: 171, b: 216},
}

const height = (value) => {
  const level = value <= config.seaLevel
    ? Math.min(18, 18 - (value * 18 / config.seaLevel))
    : (value - config.seaLevel) * 36 / config.landHeight

  return value <= config.seaLevel
    ? TOPOGRAPHY_COLORS_SEA[Math.round(level)]
    : TOPOGRAPHY_COLORS_LAND[Math.round(level)]
}

module.exports = height
