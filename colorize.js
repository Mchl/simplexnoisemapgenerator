const config = require('./config')

const colorize = (value) => {
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

module.exports = colorize