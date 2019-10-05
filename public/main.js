const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.L = L

let lat = getParameterByName('lat') || 0
let lng = getParameterByName('lng') || 0
const seed = getParameterByName('seed') || Math.random()
const zoom = getParameterByName('zoom') || 3

const CustomCrs = L.Util.extend({}, L.CRS.Simple, {
  // Just so that the scale isn't ridiculous
  distance: (latlng1, latlng2) => 1E4 * L.CRS.Simple.distance(latlng1, latlng2)
});

const map = L.map('mapid', {
  center: [lat, lng],
  crs: CustomCrs,
  zoom,
  minZoom: 0,
  maxZoom: 18,
  zoomControl: true
});

const createLayer = config => ({
  [config.name]: L.tileLayer(`${window.location.origin}${window.location.pathname}tiles/${config.tiletype}/{seed}/{z}/{x}/{y}.png`, {
    seed,
    zoomOffset: -6
  })
})

const layersConfig = [
  {
    name: 'Height map',
    tiletype: 'heightmap',
    default: true
  },
  {
    name: 'Biomes',
    tiletype: 'biomes'
  }
]

const layers = layersConfig.reduce((layers, config) => ({...layers, ...createLayer(config)}), {})
const defaultLayerName = layersConfig.find(({default: def}) => def).name

layers[defaultLayerName].addTo(map)

L.control.layers(layers).addTo(map)

L.control.scale().addTo(map)


map.on('moveend', () => {
  const mapCenter = map.getCenter()

  const newurl = `${window.location.origin}${window.location.pathname}?seed=${seed}&lat=${mapCenter.lat}&lng=${mapCenter.lng}&zoom=${map.getZoom()}`
  window.history.pushState({path:newurl},'',newurl);
})


const newurl = `${window.location.origin}${window.location.pathname}?seed=${seed}&lat=${lat}&lng=${lng}&zoom=${zoom}`
window.history.pushState({path:newurl},'',newurl);
