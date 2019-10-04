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

const map = L.map('mapid', {
  center: [lat, lng],
  crs: L.CRS.Simple,
  zoom,
  minZoom: 0,
  maxZoom: 18,
  zoomControl: true
});


L.tileLayer(`${window.location.origin}${window.location.pathname}heightmap/{seed}/{z}/{x}/{y}.png`, {
  seed,
  zoomOffset: -6
}).addTo(map);

map.on('moveend', () => {
  const mapCenter = map.getCenter()


  const newurl = `${window.location.origin}${window.location.pathname}?seed=${seed}&lat=${mapCenter.lat}&lng=${mapCenter.lng}&zoom=${map.getZoom()}`
  window.history.pushState({path:newurl},'',newurl);
})


const newurl = `${window.location.origin}${window.location.pathname}?seed=${seed}&lat=${lat}&lng=${lng}&zoom=${zoom}`
window.history.pushState({path:newurl},'',newurl);