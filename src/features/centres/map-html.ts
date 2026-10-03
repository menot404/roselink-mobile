import type { Coords } from "@/lib/geo";
import type { Scheme } from "@/theme/colors";

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "fixe" | "mobile";
};

type Options = {
  points: MapPoint[];
  user: Coords | null;
  fallback: Coords;
  scheme: Scheme;
};

/** Couleurs de la carte : ajustez ces valeurs pour affiner le rendu sur votre téléphone */
const THEMES = {
  light: {
    tiles: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    background: "#FDE2EC",
    surface: "#FFFFFF",
    tint: "#E8467C",
    tintOpacity: 0.16,
    blend: "multiply",
    pin: "#D6336C",
    pinMobile: "#8A1E46",
    user: "#B02558",
    control: "#D6336C",
  },
  dark: {
    tiles: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    background: "#1A0F15",
    surface: "#271821",
    tint: "#FF7AA8",
    tintOpacity: 0.12,
    blend: "screen",
    pin: "#FF7AA8",
    pinMobile: "#FFC2D8",
    user: "#FF7AA8",
    control: "#FF7AA8",
  },
} as const;

export function buildMapHtml({ points, user, fallback, scheme }: Options): string {
  const theme = THEMES[scheme];
  const data = JSON.stringify({ points, user, fallback, theme }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: ${theme.background}; }
  .leaflet-container { background: ${theme.background}; font-family: -apple-system, system-ui, Roboto, sans-serif; }
  .pin { background: none; border: none; }
  .tint { mix-blend-mode: ${theme.blend}; }
  .leaflet-bar { border: none !important; border-radius: 14px !important; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.25) !important; }
  .leaflet-bar a { width: 40px; height: 40px; line-height: 40px; background: ${theme.surface}; color: ${theme.control}; border-bottom: 1px solid rgba(128,128,128,.25); }
  .leaflet-control-attribution { font-size: 9px; background: ${theme.surface} !important; color: #888 !important; opacity: .85; }
  .leaflet-control-attribution a { color: ${theme.control} !important; }
  .me { position: relative; }
  .me .dot { position: absolute; left: 4px; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: ${theme.user}; border: 3px solid #fff; box-sizing: content-box; margin: -3px; }
  .me .pulse { position: absolute; left: -4px; top: -4px; width: 30px; height: 30px; border-radius: 50%; background: ${theme.user}; opacity: .25; animation: pulse 2s ease-out infinite; }
  @keyframes pulse { 0% { transform: scale(.5); opacity: .5; } 100% { transform: scale(1.4); opacity: 0; } }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function () {
  function post(message) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }
  if (typeof L === 'undefined') { post({ type: 'offline' }); return; }

  var DATA = ${data};
  var theme = DATA.theme;

  var map = L.map('map', { zoomControl: false, attributionControl: true })
    .setView([DATA.fallback.lat, DATA.fallback.lng], 12);
  map.attributionControl.setPrefix(false);
  L.control.zoom({ position: 'topright' }).addTo(map);

  var loaded = 0, failed = 0, offlineSent = false;
  var tiles = L.tileLayer(theme.tiles, {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '© OpenStreetMap · © CARTO'
  });
  tiles.on('tileload', function () { loaded++; });
  tiles.on('tileerror', function () {
    failed++;
    if (loaded === 0 && failed >= 3 && !offlineSent) { offlineSent = true; post({ type: 'offline' }); }
  });
  tiles.addTo(map);

  L.rectangle([[-85, -180], [85, 180]], {
    stroke: false,
    fillColor: theme.tint,
    fillOpacity: theme.tintOpacity,
    interactive: false,
    className: 'tint'
  }).addTo(map);

  function pinIcon(point, selected) {
    var color = point.type === 'mobile' ? theme.pinMobile : theme.pin;
    var w = selected ? 36 : 28, h = selected ? 48 : 38;
    var svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))">' +
      '<path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22C24 5.4 18.6 0 12 0z" fill="' + color + '" stroke="#fff" stroke-width="1.5"/>' +
      '<path d="M12 6.5v11M6.5 12h11" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>';
    return L.divIcon({ className: 'pin', html: svg, iconSize: [w, h], iconAnchor: [w / 2, h] });
  }

  var markers = {};
  var selected = null;
  var bounds = [];

  DATA.points.forEach(function (point) {
    var marker = L.marker([point.lat, point.lng], {
      icon: pinIcon(point, false),
      title: point.name,
      keyboard: false
    }).addTo(map);
    marker.on('click', function () { post({ type: 'select', id: point.id }); });
    markers[point.id] = { marker: marker, point: point };
    bounds.push([point.lat, point.lng]);
  });

  if (DATA.user) {
    L.marker([DATA.user.lat, DATA.user.lng], {
      icon: L.divIcon({ className: 'me', html: '<span class="pulse"></span><span class="dot"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
      interactive: false,
      keyboard: false
    }).addTo(map);
    bounds.push([DATA.user.lat, DATA.user.lng]);
  }

  function flyToOffset(lat, lng, zoom) {
    var size = map.getSize();
    var target = map.project([lat, lng], zoom).add([0, size.y * 0.18]);
    map.flyTo(map.unproject(target, zoom), zoom, { duration: 0.6 });
  }

  function select(id) {
    if (selected && markers[selected]) {
      markers[selected].marker.setIcon(pinIcon(markers[selected].point, false));
      markers[selected].marker.setZIndexOffset(0);
    }
    selected = id;
    if (id && markers[id]) {
      var entry = markers[id];
      entry.marker.setIcon(pinIcon(entry.point, true));
      entry.marker.setZIndexOffset(1000);
      flyToOffset(entry.point.lat, entry.point.lng, Math.max(map.getZoom(), 14));
    }
  }

  window.focusCenter = function (id) { select(id); };
  window.clearSelection = function () { select(null); };
  window.centerOnUser = function () {
    if (DATA.user) map.flyTo([DATA.user.lat, DATA.user.lng], 15, { duration: 0.6 });
  };

  map.on('click', function () { post({ type: 'clear' }); });
  window.addEventListener('resize', function () { map.invalidateSize(); });

  if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  else if (bounds.length === 1) map.setView(bounds[0], 14);
})();
</script>
</body>
</html>`;
}