const maxHeight = 10000
const seaLevel = 5000
const landHeight = maxHeight - seaLevel
const elevationZones = [250, 1000, 2500, Number.MAX_SAFE_INTEGER]
const landMassProfileEnabled = true

module.exports = {
  maxHeight,
  seaLevel,
  landHeight,
  elevationZones,
  landMassProfileEnabled
}
