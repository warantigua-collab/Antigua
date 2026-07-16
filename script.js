(function(){
  "use strict";

  /* ---------------------------------------------------------
     LANGUAGE
  --------------------------------------------------------- */
  var LANG = "en"; // default — most visitors are from the US/Europe

  var STRINGS = {
    en: {
      eyebrow: "Sacatepéquez · Guatemala",
      subtitle: "This map is hand-traced from the real layout of the village — every curve, every bend in the road, and every pin follows your original reference photos, drawn in a treasure-map style. Explore it and stamp your digital passport as you visit each place — no account needed.",
      searchPlaceholder: "Search for a viewpoint, restaurant, trail…",
      searchAria: "Search places on the map",
      filtersAria: "Filter by category",
      mapFrameAria: "Illustrated map of San Cristóbal El Alto",
      mapCaption: "Hand-illustrated map, traced over the real position and shape of the streets from your reference screenshots — not a GPS-scale map.<br>The main plaza cluster (church, Casa San Sebastián, Ermita, Tienda Abuelitos, EORM, Delicias en lo Alto, El Temazcal, La Pilona) wasn't labeled in your wide overview shot, so its position here is an estimate based on road continuity — confirm or correct it.",
      sidebarAria: "List of places and traveler's passport",
      mainViewAria: "Switch between the places list and the map",
      viewPlacesTab: "📋 Places",
      viewMapTab: "🗺 Map",
      tabPlaces: "Places",
      tabPassport: "Passport",
      resetPassport: "Reset passport",
      resetConfirm: "Reset your passport? All stamps saved on this device will be deleted.",
      footer: "All names and positions come from the screenshots you sent. Send me photos, videos, reviews, or position corrections for any place and I'll update the map.",
      modalClose: "Close",
      zoomInAria: "Zoom in",
      zoomOutAria: "Zoom out",
      zoomResetAria: "Reset map view",
      coordsNote: "Position traced from reference map",
      photoPending: function(n){ return "Photo " + n + " — pending<br>(upload your image here)"; },
      videoNote: "🎬 Space reserved for a short video — add a link or clip when available.",
      descriptionTitle: "Description",
      reviewsTitle: "Reviews",
      noReviews: "No reviews yet for this place — send them anytime.",
      stampBtn: "🖋 Stamp my passport",
      stampedBtn: "✓ Already stamped — remove stamp",
      stampHint: "Your progress is saved only on this device (localStorage).",
      undiscovered: "Undiscovered",
      allChip: "All",
      stampedSuffix: " (stamped)",
      stampedCheck: "✓ Stamped in your passport",
      emptySearch: "No place matches your search. Try another term or clear the filter.",
      progressPill: function(count,total){ return count + " / " + total + " stamped"; },
      passportSummary: function(count,total){ return count + " of " + total + " places discovered"; }
    },
    es: {
      eyebrow: "Sacatepéquez · Guatemala",
      subtitle: "Este mapa está trazado a mano a partir del mapa real del pueblo — cada curva, cada quiebre del camino y la posición de cada sitio siguen tu captura original, con el estilo de un mapa del tesoro. Explóralo y sella tu pasaporte digital conforme visites cada lugar — sin necesidad de crear cuenta.",
      searchPlaceholder: "Buscar un mirador, restaurante, sendero…",
      searchAria: "Buscar lugares en el mapa",
      filtersAria: "Filtrar por categoría",
      mapFrameAria: "Mapa ilustrado de San Cristóbal El Alto",
      mapCaption: "Mapa ilustrado a mano, trazado sobre la posición y forma real de las calles de tu captura de referencia — no es un mapa a escala GPS.<br>El grupo de la plaza principal (iglesia, Casa San Sebastián, Ermita, Tienda Abuelitos, EORM, Delicias en lo Alto, El Temazcal, La Pilona) no aparecía etiquetado en tu vista general, así que su posición aquí es una estimación de continuidad del camino — confírmala o corrígela.",
      sidebarAria: "Lista de lugares y pasaporte del viajero",
      mainViewAria: "Cambiar entre la lista de lugares y el mapa",
      viewPlacesTab: "📋 Lugares",
      viewMapTab: "🗺 Mapa",
      tabPlaces: "Lugares",
      tabPassport: "Pasaporte",
      resetPassport: "Reiniciar pasaporte",
      resetConfirm: "¿Reiniciar tu pasaporte? Se borrarán todos los sellos guardados en este dispositivo.",
      footer: "Todos los nombres y posiciones vienen de las capturas que enviaste. Envíame fotos, videos, reseñas o correcciones de posición para cada lugar y actualizo el mapa.",
      modalClose: "Cerrar",
      zoomInAria: "Acercar",
      zoomOutAria: "Alejar",
      zoomResetAria: "Restablecer vista del mapa",
      coordsNote: "Posición trazada del mapa de referencia",
      photoPending: function(n){ return "Foto " + n + " — pendiente<br>(sube tu imagen aquí)"; },
      videoNote: "🎬 Espacio reservado para video corto — añade un enlace o clip cuando esté disponible.",
      descriptionTitle: "Descripción",
      reviewsTitle: "Reseñas",
      noReviews: "Aún no hay reseñas para este lugar — envíamelas cuando quieras.",
      stampBtn: "🖋 Sellar en mi pasaporte",
      stampedBtn: "✓ Ya sellado — quitar sello",
      stampHint: "Tu progreso se guarda solo en este dispositivo (localStorage).",
      undiscovered: "Sin descubrir",
      allChip: "Todos",
      stampedSuffix: " (sellado)",
      stampedCheck: "✓ Sellado en tu pasaporte",
      emptySearch: "Ningún lugar coincide con tu búsqueda. Prueba otro término o quita el filtro.",
      progressPill: function(count,total){ return count + " / " + total + " sellados"; },
      passportSummary: function(count,total){ return count + " de " + total + " lugares descubiertos"; }
    }
  };
  function t(key){ return STRINGS[LANG][key]; }

  /* ---------------------------------------------------------
     CATEGORIES — matched to the icon styles visible in the
     user's real Google Maps screenshots (fork/knife = restaurant,
     camera = viewpoint, crown = wellness/spa, tree = nature,
     cross = landmark/church, H = health service, house = lodging)
  --------------------------------------------------------- */
  var CATS = {
    viewpoint:  { label: { en:"Viewpoint",        es:"Mirador" },         color: "#1f4e4a", glyph: "📷" },
    restaurant: { label: { en:"Restaurant",       es:"Restaurante" },     color: "#c9a227", glyph: "🍽" },
    cafe:       { label: { en:"Café",             es:"Café" },            color: "#a8461c", glyph: "☕" },
    lodging:    { label: { en:"Lodging",          es:"Alojamiento" },     color: "#6b4a35", glyph: "🏠" },
    landmark:   { label: { en:"Landmark",         es:"Sitio histórico" }, color: "#8f2f22", glyph: "⛪" },
    nature:     { label: { en:"Nature / Finca",   es:"Naturaleza" },      color: "#3f6b3a", glyph: "🌲" },
    wellness:   { label: { en:"Wellness",         es:"Bienestar" },       color: "#8a5a9e", glyph: "👑" },
    service:    { label: { en:"Shop & Services",  es:"Servicio" },        color: "#2f6f95", glyph: "🛎" }
  };
  function catLabel(catKey){ return CATS[catKey].label[LANG]; }

  /* ---------------------------------------------------------
     PLACES — every name, icon type, and relative position below
     was traced directly from the screenshots you sent (1 overview
     + 5 close-ups). x/y are percentages over the map's 1000x620
     illustrated canvas, positioned to match your screenshots as
     closely as a hand-drawn map allows. `cats` is an array since
     some places belong to more than one category (e.g. a place
     that's both a restaurant and a souvenir shop). The first
     entry in `cats` sets the pin's color. Send corrections any time.
  --------------------------------------------------------- */
  var PLACES = [
    { id:"cerro-san-cristobal", name:"Cerro San Cristóbal", cats:["restaurant"], x:27, y:49,
      desc:{ en:"Restaurant on the tight hairpin bend of the main road, right next to Restaurante Antigua Mágica.",
             es:"Restaurante en la curva cerrada (herradura) del camino principal, junto a Restaurante Antigua Mágica." }, reviews:[] },
    { id:"restaurante-antigua-magica", name:"Restaurante Antigua Mágica", cats:["restaurant"], x:24, y:52,
      desc:{ en:"Restaurant right beside Cerro San Cristóbal, on the same bend of the road.",
             es:"Restaurante justo al lado de Cerro San Cristóbal, en la misma curva del camino." }, reviews:[] },
    { id:"vertigo-antigua", name:"Vértigo Antigua — Mirador Extremo", cats:["viewpoint"], x:38, y:61,
      desc:{ en:"Extreme viewpoint on the road, next to La Pilita.",
             es:"Mirador extremo sobre el camino, junto a La Pilita." }, reviews:[] },
    { id:"la-pilita", name:"La Pilita", cats:["wellness"], x:41, y:62,
      desc:{ en:"Wellness spot just past Vértigo Antigua, on the same bend of the road.",
             es:"Punto de bienestar justo después de Vértigo Antigua, sobre la misma curva del camino." }, reviews:[] },
    { id:"plaza-san-cristobal-alto", name:"San Cristóbal El Alto (main plaza)", cats:["landmark"], x:47, y:66,
      desc:{ en:"The heart of the village — the main plaza where the church stands (marked with the pine-tree icon). Position estimated from road continuity; confirm if it needs adjusting.",
             es:"El centro del pueblo — la plaza principal donde está la iglesia (marcada con el ícono de pino). Posición estimada por continuidad del camino; confírmala si necesita ajuste." }, reviews:[] },
    { id:"casa-san-sebastian", name:"Casa San Sebastián", cats:["lodging"], x:45, y:67,
      desc:{ en:"Lodging right next to the village's main plaza.",
             es:"Alojamiento justo junto a la plaza principal del pueblo." }, reviews:[] },
    { id:"tienda-abuelitos", name:"Tienda Abuelitos Coca y Miguel", cats:["service","restaurant"], x:48, y:64,
      desc:{ en:"Souvenir shop and restaurant, near the main plaza.",
             es:"Tienda de recuerdos y también restaurante, cerca de la plaza principal." }, reviews:[] },
    { id:"el-temazcal", name:"El Temazcal", cats:["wellness"], x:47, y:69,
      desc:{ en:"Nursery / temazcal near the main plaza, at the spot that showed as an unnamed camera icon on the map.",
             es:"Vivero / temazcal cerca de la plaza principal, en el punto que en el mapa aparecía como el ícono de cámara sin nombre." }, reviews:[] },
    { id:"la-pilona", name:"La Pilona", cats:["wellness"], x:51, y:68,
      desc:{ en:"Wellness spot on the road, east of the main plaza.",
             es:"Punto de bienestar sobre el camino, al este de la plaza principal." }, reviews:[] },
    { id:"tierra-y-lava", name:"Tierra & Lava", cats:["lodging"], x:68, y:82,
      desc:{ en:"Lodging on the road bend toward the east side of the map, next to Sky Dancer Villa.",
             es:"Alojamiento en la curva del camino hacia el este del mapa, junto a Sky Dancer Villa." }, reviews:[] },
    { id:"sky-dancer-villa", name:"Sky Dancer Villa", cats:["lodging"], x:72, y:83,
      desc:{ en:"Lodging next to Tierra & Lava, on the same bend of the road.",
             es:"Alojamiento junto a Tierra & Lava, sobre la misma curva del camino." }, reviews:[] },
    { id:"campanario-de-panchoy", name:"Campanario de Panchoy", cats:["lodging","nature"], x:96, y:94,
      desc:{ en:"A finca (farm estate) and Airbnb-style lodging — the farthest point of the route, the end of San Cristóbal El Alto.",
             es:"Finca y alojamiento tipo Airbnb — el punto más lejano del recorrido, el final de San Cristóbal El Alto." }, reviews:[] }
  ];

  /* ---------------------------------------------------------
     PHOTOS — reads whatever image files actually exist in each
     images/<place-id>/ folder straight from the GitHub repo, via
     the GitHub API. No renaming required: drop in photos with any
     filename (Cerro San Cristobal_1.png, IMG_4821.jpg, whatever
     your phone/camera calls it) and they'll show up automatically.

     Update GITHUB_OWNER / GITHUB_REPO / GITHUB_BRANCH below to
     match your repo if you fork or rename it.

     Actual photo bytes are served through jsDelivr's CDN (a free,
     public mirror of any GitHub repo) instead of GitHub's raw file
     server — jsDelivr is edge-cached and noticeably faster,
     especially once a photo has been viewed once by anyone.

     (We tried also routing photos through a live-resizing proxy for
     smaller thumbnails, but it added more round-trip latency than it
     saved in bytes and made things slower overall — removed.)

     To actually speed up first-time loads, the site now prefetches a
     place's photos in the background the moment you hover or focus
     its pin or its row in the sidebar list — by the time you click,
     the download is often already underway or finished.

     Note: HEIC/HEIF photos (the default format on newer iPhones)
     are skipped, because most browsers can't display HEIC directly
     — convert those to .jpg before adding them (Preview on Mac,
     or "Photos" > Export on iPhone/Mac, or any online converter).

     For best load speed, keep source photos under ~1600px on the
     longest side / ~500KB — that's still the single biggest lever,
     since no amount of caching or prefetching shrinks the files
     themselves.
  --------------------------------------------------------- */
  var GITHUB_OWNER = "warantigua-collab";
  var GITHUB_REPO = "Antigua";
  var GITHUB_BRANCH = "main";
  var VALID_PHOTO_EXT = /\.(jpe?g|png|webp|gif)$/i;
  var MAX_PHOTOS_PER_PLACE = 6;
  var photoCache = {}; // placeId -> array of CDN URLs (avoids re-fetching per open)
  var prefetchedImages = []; // keeps Image() objects alive so the browser doesn't drop the in-flight/cached request

  function jsdelivrUrl(path){
    return "https://cdn.jsdelivr.net/gh/" + GITHUB_OWNER + "/" + GITHUB_REPO
      + "@" + GITHUB_BRANCH + "/" + path.split("/").map(encodeURIComponent).join("/");
  }

  /* DEFAULT PHOTO — a file named exactly "default.<ext>" inside a place's
     images/<place-id>/ folder is a fast path that completely bypasses the
     GitHub Contents API listing call below: the URL is built directly by
     naming convention, so the browser can start requesting it the instant
     a row/modal renders, with zero network round-trips spent discovering
     what's there first. Since the extension isn't known in advance, an
     <img> tries each candidate in turn via onerror and stops at the first
     one that actually exists — cheap, since a jsDelivr 404 is fast, and
     still far faster than a GitHub API round trip. Optional: places
     without a default.* file just keep using the full listing below. */
  var DEFAULT_PHOTO_EXTS = ["jpg","jpeg","png","webp","gif"];

  function defaultThumbCandidates(placeId){
    return DEFAULT_PHOTO_EXTS.map(function(ext){ return jsdelivrUrl("images/" + placeId + "/default." + ext); });
  }

  /* Tries each candidate URL on imgEl in order (via onerror fallthrough)
     until one loads; calls onFail if none of them exist. */
  function loadFirstWorkingImage(imgEl, candidates, onLoad, onFail){
    var i = 0;
    imgEl.onload = function(){ if(onLoad) onLoad(imgEl.src); };
    imgEl.onerror = function(){
      if(i >= candidates.length){ if(onFail) onFail(); return; }
      imgEl.src = candidates[i++];
    };
    imgEl.onerror();
  }

  /* Full listing results are also cached in localStorage (not just in
     memory) for an hour, so a page reload — or a second visitor on the
     same network/IP — doesn't re-spend GitHub's 60-requests/hour
     unauthenticated rate limit on folders we already looked up. */
  var PHOTO_LIST_CACHE_KEY = "sancristobal_photo_list_cache_v1";
  var PHOTO_LIST_TTL_MS = 60 * 60 * 1000;

  function loadPhotoListCache(){
    try{ var raw = window.localStorage.getItem(PHOTO_LIST_CACHE_KEY); return raw ? JSON.parse(raw) : {}; }
    catch(e){ return {}; }
  }
  function savePhotoListCache(cache){
    try{ window.localStorage.setItem(PHOTO_LIST_CACHE_KEY, JSON.stringify(cache)); }
    catch(e){ /* localStorage unavailable — fail silently, same as passport storage */ }
  }

  function fetchPlacePhotos(placeId, callback){
    if(photoCache[placeId]){ callback(photoCache[placeId]); return; }

    var stored = loadPhotoListCache();
    var entry = stored[placeId];
    if(entry && (Date.now() - entry.t) < PHOTO_LIST_TTL_MS){
      photoCache[placeId] = entry.urls;
      callback(entry.urls);
      return;
    }

    var url = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO
      + "/contents/images/" + encodeURIComponent(placeId) + "?ref=" + GITHUB_BRANCH;

    fetch(url, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(data){
        var urls = (Array.isArray(data) ? data : [])
          .filter(function(f){ return f.type === "file" && VALID_PHOTO_EXT.test(f.name); })
          .sort(function(a,b){ return a.name.localeCompare(b.name, undefined, { numeric:true }); })
          .slice(0, MAX_PHOTOS_PER_PLACE)
          .map(function(f){ return jsdelivrUrl(f.path); });
        photoCache[placeId] = urls;
        var cache = loadPhotoListCache();
        cache[placeId] = { urls: urls, t: Date.now() };
        savePhotoListCache(cache);
        callback(urls);
      })
      .catch(function(){ callback([]); });
  }

  var prefetchedPlaceIds = {}; // avoids re-triggering the same prefetch on repeated hovers

  /* Starts downloading a place's photos in the background as soon as the
     person hovers or keyboard-focuses its pin or its row in the sidebar
     list — well before they actually click. By the time the modal opens,
     the browser often already has the bytes (or is well into fetching
     them), which is what actually saves time, rather than adding a resize
     step that itself costs a round trip. */
  function prefetchPlacePhotos(placeId){
    if(prefetchedPlaceIds[placeId]) return;
    prefetchedPlaceIds[placeId] = true;
    fetchPlacePhotos(placeId, function(urls){
      urls.forEach(function(u){
        var img = new Image();
        img.src = u;
        prefetchedImages.push(img); // keep a reference so it isn't garbage-collected mid-download
      });
    });
  }

  var STORAGE_KEY = "sancristobal_passport_v3";

  var stamped = loadStamped();
  var activeFilter = "all";
  var searchTerm = "";
  var activePlaceId = null;



  function loadStamped(){
    try{ var raw = window.localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; }
    catch(e){ return {}; }
  }
  function saveStamped(){
    try{ window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped)); }
    catch(e){ /* localStorage unavailable (private mode etc.) — fail silently */ }
  }
  function escapeHTML(str){ var div = document.createElement("div"); div.textContent = str; return div.innerHTML; }

  /* ---------------------------------------------------------
     TERRAIN + ROADS — hand-traced to follow the real shape of
     the village's road network from the reference screenshots:
     the El Bajo street grid (top-left), the zigzag climb, the
     hairpin at Cerro San Cristóbal, the bend at Vértigo/La Pilita,
     the plaza cluster, the road out to Tierra&Lava/Sky Dancer
     Villa/Campanario, and the lower settlement's own street grid.
  --------------------------------------------------------- */
  function buildTerrainSVG(){
    return ''
    + '<svg class="terrain" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<defs>'
    +   '<radialGradient id="vignette" cx="50%" cy="45%" r="78%">'
    +     '<stop offset="60%" stop-color="#e8d9b5" stop-opacity="0"/>'
    +     '<stop offset="100%" stop-color="#5b4636" stop-opacity="0.38"/>'
    +   '</radialGradient>'
    + '</defs>'
    + '<rect x="0" y="0" width="1000" height="620" fill="#e8d9b5"/>'
    + contourGroup()
    + forestPatches()
    /* El Bajo street grid — the actual small block pattern at the
       northwest corner of your reference screenshot */
    + '<g stroke="#8a7550" stroke-width="3" fill="none" opacity="0.55" stroke-linecap="round">'
    +   '<path d="M0,35 H185 M0,62 H165 M0,90 H145 M28,9 V108 M65,9 V115 M102,18 V108 M138,27 V98"/>'
    + '</g>'
    /* MAIN ROUTE — re-traced against the actual Google Maps driving
       route: a small loop out of San Cristóbal El Bajo, zigzag
       switchbacks down past Santa Ana/Los Nísperos, a tight hairpin
       right at Cerro San Cristóbal, curving through Sitio Santa Clara
       into Vértigo Antigua, then one long diagonal past the plaza
       cluster to Tierra & Lava, Sky Dancer Villa, and finally
       Campanario de Panchoy — the end of San Cristóbal El Alto. */
    + roadPath("187,48 130,40 90,52 88,95 133,128", 6)
    /* zigzag switchbacks past Santa Ana / Los Nísperos */
    + roadPath("133,128 205,158 155,192 230,222 178,253 269,306", 6)
    /* tight hairpin loop exactly at Cerro San Cristóbal */
    + roadPath("269,306 248,320 265,335 271,353", 7)
    /* Sitio Santa Clara curving right into Vértigo Antigua */
    + roadPath("271,353 300,362 340,371 383,379", 6)
    /* long diagonal past the plaza cluster toward Tierra & Lava */
    + roadPath("383,379 460,386 547,396 600,414 620,434 650,470 678,507", 6)
    /* Sky Dancer Villa, then the final stretch to Campanario de Panchoy */
    + roadPath("678,507 700,511 720,513 760,520 800,531 860,555 930,580 965,586", 6)
    /* upper branch off the El Bajo road toward Finca El Pilar / La Máquina / Mirador / Birding Antigua */
    + roadPath("133,128 220,108 300,93 352,87 378,97 400,100 470,108 550,116 634,128 720,140 800,152 878,168", 5)
    /* sub-branch up to El Mirador del Abuelo */
    + roadPath("378,97 395,150 410,180 422,205", 4)
    /* branch down toward the lower settlement (unlabeled for now — road kept for geographic context) */
    + roadPath("271,353 220,420 180,480 150,520 120,559 84,603", 5)
    + '<g stroke="#8a7550" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round">'
    +   '<path d="M120,559 L196,566 M150,520 L366,577 M84,603 L160,608"/>'
    + '</g>'
    + treeCluster(160,40) + treeCluster(870,170) + treeCluster(130,500)
    + treeCluster(60,555) + treeCluster(950,530) + treeCluster(700,110)
    + compassRose(910,80)
    + '<text x="500" y="600" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" fill="#5b4636" opacity="0.55">SAN CRISTÓBAL EL BAJO → SAN CRISTÓBAL EL ALTO</text>'
    + '<rect x="0" y="0" width="1000" height="620" fill="url(#vignette)"/>'
    + '</svg>';
  }

  function roadPath(pointsStr, width){
    var pts = pointsStr.split(" ");
    var d = "M " + pts[0] + " L " + pts.slice(1).join(" L ");
    return '<path d="'+d+'" fill="none" stroke="#5b4636" stroke-width="'+width+'" '
      + 'stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>';
  }

  function contourGroup(){
    var paths = [
      "M 40,140 C 220,95 380,130 520,95 C 660,60 820,105 980,70",
      "M 20,475 C 220,520 380,495 520,530 C 660,560 820,530 985,555",
      "M 10,540 C 200,585 360,555 520,585 C 680,610 830,585 990,605"
    ];
    var out = '<g fill="none" stroke="#5b4636" stroke-width="1.5" opacity="0.25">';
    paths.forEach(function(d){ out += '<path d="'+d+'"/>'; });
    out += '</g>';
    return out;
  }

  function forestPatches(){
    var blobs = [
      "M 600,25 C 700,8 820,35 900,80 C 950,115 900,160 800,150 C 700,140 550,95 600,25 Z",
      "M 700,440 C 800,415 900,450 950,505 C 980,550 920,585 850,575 C 780,565 650,505 700,440 Z"
    ];
    var out = '<g fill="#c7d9b0" opacity="0.35">';
    blobs.forEach(function(d){ out += '<path d="'+d+'"/>'; });
    out += '</g>';
    return out;
  }

  function treeCluster(cx,cy){
    var out = '<g opacity="0.55" fill="#3f6b3a">';
    var offsets = [[-14,4,10],[0,-6,13],[14,2,9]];
    offsets.forEach(function(o){
      var x = cx+o[0], y = cy+o[1], s = o[2];
      out += '<path d="M '+x+','+(y-s)+' L '+(x-s*0.6)+','+(y+s*0.5)+' L '+(x+s*0.6)+','+(y+s*0.5)+' Z"/>';
      out += '<rect x="'+(x-1.5)+'" y="'+(y+s*0.5)+'" width="3" height="'+(s*0.4)+'" fill="#5b4636"/>';
    });
    out += '</g>';
    return out;
  }

  function compassRose(cx,cy){
    return ''
    + '<g transform="translate('+cx+','+cy+')" opacity="0.85">'
    + '<circle r="46" fill="none" stroke="#5b4636" stroke-width="1.5"/>'
    + '<circle r="34" fill="none" stroke="#5b4636" stroke-width="1"/>'
    + '<path d="M0,-46 L8,-8 L0,0 L-8,-8 Z" fill="#a8461c"/>'
    + '<path d="M0,46 L8,8 L0,0 L-8,8 Z" fill="#5b4636"/>'
    + '<path d="M-46,0 L-8,8 L0,0 L-8,-8 Z" fill="#5b4636"/>'
    + '<path d="M46,0 L8,8 L0,0 L8,-8 Z" fill="#5b4636"/>'
    + '<text x="0" y="-54" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" fill="#5b4636">N</text>'
    + '</g>';
  }

  /* ---------------------------------------------------------
     PINS
  --------------------------------------------------------- */
  var mapContainer = document.getElementById("mapContainer");

  function pinSVG(color){
    return '<svg viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M17 43 C 6 27 1 20 1 13 C1 5.8 8.3 1 17 1 C25.7 1 33 5.8 33 13 C33 20 28 27 17 43 Z" fill="'+color+'" stroke="#2b2015" stroke-width="1.5"/>'
      + '<circle cx="17" cy="14" r="6.2" fill="#e8d9b5"/>'
      + '</svg>';
  }

  /* ---------------------------------------------------------
     LEAFLET MAP — the hand-illustrated SVG becomes a custom
     image layer (L.CRS.Simple, no street tiles/geocoding), and
     pins become Leaflet markers instead of absolutely-positioned
     buttons. Leaflet owns all pan/zoom/pinch gesture handling
     natively — see MAP_W/MAP_H and placeLatLng() for how a
     place's x/y % converts to a Leaflet latlng (note the y-axis
     flip: Leaflet's latitude increases upward, image y increases
     downward).
  --------------------------------------------------------- */
  var MAP_W = 1000, MAP_H = 620;
  var mapBounds = [[0,0],[MAP_H, MAP_W]];
  var leafletMap = null;
  var markers = {}; // placeId -> L.Marker

  function placeLatLng(place){
    var px = (place.x / 100) * MAP_W;
    var py = (place.y / 100) * MAP_H;
    return [MAP_H - py, px];
  }

  function initLeafletMap(){
    var svgDataUri = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(buildTerrainSVG())));

    leafletMap = L.map(mapContainer, {
      crs: L.CRS.Simple,
      zoomSnap: 0.25,
      attributionControl: false,
      zoomControl: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
      fadeAnimation: false
    });
    L.imageOverlay(svgDataUri, mapBounds).addTo(leafletMap);
    leafletMap.setMaxBounds(mapBounds);

    /* CRS.Simple's zoom 0 means "1 map unit = 1 pixel" — on a small
       container (e.g. the short mobile map-frame), the whole 1000x620
       image doesn't fit at zoom 0, let alone anything below it. The
       zoom level that actually fits the current container size varies
       with that size, so it's computed on the fly (getBoundsZoom)
       instead of a fixed minZoom, and recomputed whenever the
       container itself resizes (orientation change, breakpoint
       reflow, window resize). */
    function applyFitZoomRange(){
      // un-clamp getBoundsZoom() below on BOTH ends so it can report the true fit level —
      // a stale maxZoom from a previous call (e.g. one made while this container was
      // display:none and measured as 0x0) would otherwise cap the new computation too
      leafletMap.setMinZoom(-10);
      leafletMap.setMaxZoom(10);
      var fitZoom = leafletMap.getBoundsZoom(mapBounds);
      leafletMap.setMinZoom(fitZoom);
      leafletMap.setMaxZoom(fitZoom + 2.5);
    }
    leafletMap._applyFitZoomRange = applyFitZoomRange; // exposed for activateMainView() — the desktop
      // map/places toggle defaults to the map-frame hidden (display:none), and Leaflet measures a
      // hidden container as 0x0, so minZoom/fitBounds computed at init are garbage; this lets the
      // toggle's click handler redo them once the container is actually visible and correctly sized.
    applyFitZoomRange();
    leafletMap.fitBounds(mapBounds);

    L.control.zoom({
      position: "topright",
      zoomInTitle: t("zoomInAria"),
      zoomOutTitle: t("zoomOutAria")
    }).addTo(leafletMap);

    var ResetControl = L.Control.extend({
      options: { position: "topright" },
      onAdd: function(){
        var btn = L.DomUtil.create("button", "leaflet-bar reset-view-btn");
        btn.type = "button";
        btn.innerHTML = "&#8634;";
        btn.title = t("zoomResetAria");
        btn.setAttribute("aria-label", t("zoomResetAria"));
        L.DomEvent.on(btn, "click", function(e){
          L.DomEvent.stop(e);
          applyFitZoomRange();
          leafletMap.fitBounds(mapBounds);
        });
        return btn;
      }
    });
    leafletMap.resetControl = new ResetControl();
    leafletMap.addControl(leafletMap.resetControl);

    var resizeObserver = new ResizeObserver(function(){
      leafletMap.invalidateSize();
      applyFitZoomRange();
    });
    resizeObserver.observe(mapContainer);
  }

  function pinIcon(place, visible){
    var primaryColor = CATS[place.cats[0]].color;
    var badge = stamped[place.id] ? '<span class="stamped-badge">✓</span>' : "";
    var html = '<button type="button" class="pin' + (visible ? "" : " faded") + '">' + pinSVG(primaryColor) + badge + "</button>";
    return L.divIcon({ className: "pin-icon-wrap", html: html, iconSize: [28,36], iconAnchor: [14,36] });
  }

  function renderPins(){
    var term = searchTerm.trim().toLowerCase();

    PLACES.forEach(function(place){
      var matchesFilter = (activeFilter === "all") || (place.cats.indexOf(activeFilter) !== -1);
      var matchesSearch = !term || place.name.toLowerCase().indexOf(term) !== -1;
      var visible = matchesFilter && matchesSearch;
      var catLabels = place.cats.map(catLabel).join(" · ");
      var label = place.name + " — " + catLabels + (stamped[place.id] ? t("stampedSuffix") : "");

      var marker = markers[place.id];
      if(!marker){
        marker = L.marker(placeLatLng(place), { icon: pinIcon(place, visible), keyboard: true }).addTo(leafletMap);
        marker.on("click", function(){ openModal(place.id); });
        marker.on("mouseover", function(){ prefetchPlacePhotos(place.id); });
        markers[place.id] = marker;
      } else {
        marker.setIcon(pinIcon(place, visible));
      }

      var el = marker.getElement();
      if(el){
        el.setAttribute("aria-label", label);
        el.style.pointerEvents = visible ? "" : "none";
        var innerBtn = el.querySelector(".pin");
        if(innerBtn){
          innerBtn.setAttribute("aria-label", label);
          innerBtn.addEventListener("focus", function(){ prefetchPlacePhotos(place.id); });
        }
      }
    });
  }

  function renderLegend(){
    var legend = document.getElementById("legendRow");
    var html = "";
    Object.keys(CATS).forEach(function(key){
      if(!PLACES.some(function(p){ return p.cats.indexOf(key) !== -1; })) return;
      var c = CATS[key];
      html += '<span><i style="background:'+c.color+'"></i>'+catLabel(key)+'</span>';
    });
    legend.innerHTML = html;
  }

  function renderFilterChips(){
    var wrap = document.getElementById("filterChips");
    var usedCats = Object.keys(CATS).filter(function(k){
      return PLACES.some(function(p){ return p.cats.indexOf(k) !== -1; });
    });
    var all = [{key:"all", label:t("allChip")}].concat(
      usedCats.map(function(k){ return {key:k, label: catLabel(k)}; })
    );
    wrap.innerHTML = "";
    all.forEach(function(f){
      var btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.textContent = f.label;
      btn.setAttribute("aria-pressed", String(activeFilter === f.key));
      btn.addEventListener("click", function(){
        activeFilter = f.key;
        renderFilterChips();
        renderPins();
        renderPlaceList();
      });
      wrap.appendChild(btn);
    });
  }

  /* Place-list thumbnail (mobile) — a single static image, not a rotation:
     tries images/<place-id>/default.<ext> directly (see
     defaultThumbCandidates() above) with no listing API call involved at
     all, so it starts loading the instant the row renders and can't be
     affected by GitHub's rate limit. Places without a default.* file keep
     showing the category-glyph fallback. */
  function rowThumbFallback(place){
    var color = CATS[place.cats[0]].color;
    return '<div class="row-thumb-fallback" style="background:linear-gradient(135deg,'+color+',#2b2015)">'
      + CATS[place.cats[0]].glyph + '</div>';
  }

  function renderPlaceList(){
    var list = document.getElementById("placeList");
    var term = searchTerm.trim().toLowerCase();
    var items = PLACES.filter(function(p){
      var matchesFilter = (activeFilter === "all") || (p.cats.indexOf(activeFilter) !== -1);
      var matchesSearch = !term || p.name.toLowerCase().indexOf(term) !== -1;
      return matchesFilter && matchesSearch;
    });

    if(items.length === 0){
      list.innerHTML = '<p class="empty-note">'+t("emptySearch")+'</p>';
      return;
    }

    list.innerHTML = "";
    items.forEach(function(place){
      var row = document.createElement("button");
      row.type = "button";
      row.className = "place-row";
      var catLabels = place.cats.map(catLabel).join(" · ");
      row.innerHTML = ''
        + '<span class="swatch" style="background:'+CATS[place.cats[0]].color+'"></span>'
        + '<span class="row-thumb" style="border-color:'+CATS[place.cats[0]].color+'">'
        +   rowThumbFallback(place)
        +   '<img alt="">'
        + '</span>'
        + '<span class="info">'
        +   '<strong>'+escapeHTML(place.name)+'</strong>'
        +   '<small>'+catLabels+'</small>'
        +   (stamped[place.id] ? '<div class="stamped-check">'+t("stampedCheck")+'</div>' : '')
        + '</span>';
      row.addEventListener("click", function(){ openModal(place.id); });
      row.addEventListener("mouseenter", function(){ prefetchPlacePhotos(place.id); });
      row.addEventListener("focus", function(){ prefetchPlacePhotos(place.id); });
      list.appendChild(row);

      var thumbWrap = row.querySelector(".row-thumb");
      var thumbImg = thumbWrap.querySelector("img");
      loadFirstWorkingImage(thumbImg, defaultThumbCandidates(place.id), function(){
        thumbWrap.classList.add("has-photo");
      }, null); // onFail: no default.* found — fallback glyph just stays showing
    });
  }

  function renderPassport(){
    var grid = document.getElementById("passportGrid");
    grid.innerHTML = "";
    PLACES.forEach(function(place){
      var done = !!stamped[place.id];
      var slot = document.createElement("div");
      slot.className = "stamp-slot" + (done ? " done" : "");
      slot.innerHTML = '<span class="glyph">'+(done ? CATS[place.cats[0]].glyph : "?")+'</span>'
        + '<span>'+(done ? escapeHTML(place.name) : t("undiscovered"))+'</span>';
      grid.appendChild(slot);
    });

    var total = PLACES.length;
    var count = Object.keys(stamped).filter(function(id){
      return PLACES.some(function(p){ return p.id === id; }) && stamped[id];
    }).length;

    document.getElementById("passportSummary").textContent = t("passportSummary")(count, total);
    document.getElementById("progressPill").textContent = t("progressPill")(count, total);
  }

  var backdrop = document.getElementById("modalBackdrop");
  var lastFocused = null;

  function starString(n){ return "★".repeat(n) + "☆".repeat(5-n); }

  function openModal(placeId){
    var place = PLACES.filter(function(p){ return p.id === placeId; })[0];
    if(!place) return;
    activePlaceId = placeId;

    var badgeEl = document.getElementById("modalBadge");
    badgeEl.innerHTML = place.cats.map(function(c){
      return '<span class="badge" style="background:'+CATS[c].color+'">'+CATS[c].glyph+' '+catLabel(c)+'</span>';
    }).join("");
    document.getElementById("modalTitle").textContent = place.name;
    document.getElementById("modalCoords").textContent = t("coordsNote");

    var primaryColor = CATS[place.cats[0]].color;
    var loadingFrame = '<div class="frame" id="galFrame" style="background:linear-gradient(135deg,'+primaryColor+',#2b2015)">'
      + t("photoPending")(1)
      + '</div>';

    var reviewsHTML = place.reviews.length
      ? place.reviews.map(function(r){
          return '<div class="review"><div class="stars">'+starString(r.stars)+'</div>'
            + '<div class="who">'+escapeHTML(r.who)+'</div><p>'+escapeHTML(r.text)+'</p></div>';
        }).join("")
      : '<p class="empty-note" style="text-align:left;padding:6px 0;">'+t("noReviews")+'</p>';

    var isStamped = !!stamped[place.id];

    document.getElementById("modalBody").innerHTML = ''
      + '<div class="gallery" id="galleryWrap">'+loadingFrame+'</div>'
      + '<div class="video-note">'+t("videoNote")+'</div>'
      + '<h3 class="modal-section-title">'+t("descriptionTitle")+'</h3>'
      + '<p class="desc">'+escapeHTML(place.desc[LANG])+'</p>'
      + '<h3 class="modal-section-title">'+t("reviewsTitle")+'</h3>'
      + reviewsHTML
      + '<div class="stamp-action">'
      +   '<button class="stamp-btn" id="stampBtn" data-stamped="'+isStamped+'">'
      +     (isStamped ? t("stampedBtn") : t("stampBtn"))
      +   '</button>'
      +   '<span class="stamp-hint">'+t("stampHint")+'</span>'
      + '</div>';

    document.getElementById("stampBtn").addEventListener("click", function(){ toggleStamp(place.id); });

    /* ask GitHub what's actually in images/<place-id>/ and render
       whatever real photos it finds — any filename works */
    var gallerySettled = false;
    fetchPlacePhotos(place.id, function(urls){
      if(activePlaceId !== place.id) return; // modal moved on before this resolved
      gallerySettled = true;
      var wrap = document.getElementById("galleryWrap");
      if(!wrap) return;
      if(urls.length === 0){
        wrap.innerHTML = '<div class="frame" style="background:linear-gradient(135deg,'+primaryColor+',#2b2015)">'
          + t("photoPending")(1) + '</div>';
        return;
      }
      wrap.innerHTML = urls.map(function(u, i){
        return '<button type="button" class="frame photo-frame" data-idx="'+i+'" '
          + 'style="background-image:url(\''+u+'\')" aria-label="View photo '+(i+1)+' larger"></button>';
      }).join("");
      wrap.querySelectorAll(".photo-frame").forEach(function(btn){
        btn.addEventListener("click", function(){
          openLightbox(urls, parseInt(btn.getAttribute("data-idx"), 10));
        });
      });
    });

    /* Meanwhile, try showing images/<place-id>/default.<ext> immediately
       (no API call, see defaultThumbCandidates()) so the modal doesn't
       just sit on the placeholder for as long as the full listing above
       takes to round-trip. Gets clobbered by the real gallery once that
       resolves — gallerySettled guards against the reverse race, where
       the listing (e.g. served from the localStorage cache) resolves
       first and this stale preview would otherwise overwrite it. */
    var previewImg = new Image();
    loadFirstWorkingImage(previewImg, defaultThumbCandidates(place.id), function(previewUrl){
      if(gallerySettled || activePlaceId !== place.id) return;
      var wrap = document.getElementById("galleryWrap");
      if(!wrap) return;
      wrap.innerHTML = '<button type="button" class="frame photo-frame" data-idx="0" '
        + 'style="background-image:url(\''+previewUrl+'\')" aria-label="View photo 1 larger"></button>';
      wrap.querySelector(".photo-frame").addEventListener("click", function(){
        openLightbox([previewUrl], 0);
      });
    }, null);

    lastFocused = document.activeElement;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }

  function closeModal(){
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    activePlaceId = null;
    if(lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function toggleStamp(placeId){
    if(stamped[placeId]){ delete stamped[placeId]; } else { stamped[placeId] = true; }
    saveStamped();
    renderPins();
    renderPlaceList();
    renderPassport();
    if(activePlaceId === placeId) openModal(placeId);
  }

  document.getElementById("modalClose").addEventListener("click", closeModal);
  backdrop.addEventListener("click", function(e){ if(e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
  });

  /* ---------------------------------------------------------
     LIGHTBOX — bigger in-page photo viewer with prev/next,
     replacing the old "open photo in a new tab" behavior.
  --------------------------------------------------------- */
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var lightboxUrls = [];
  var lightboxIndex = 0;
  var lightboxLastFocused = null;

  function showLightboxImage(){
    lightboxImg.src = lightboxUrls[lightboxIndex];
    lightboxCounter.textContent = (lightboxIndex + 1) + " / " + lightboxUrls.length;
  }

  function openLightbox(urls, startIndex){
    if(!urls || urls.length === 0) return;
    lightboxUrls = urls;
    lightboxIndex = startIndex || 0;
    showLightboxImage();
    lightboxLastFocused = document.activeElement;
    lightboxBackdrop.classList.add("open");
    document.getElementById("lightboxClose").focus();
  }

  function closeLightbox(){
    lightboxBackdrop.classList.remove("open");
    lightboxImg.src = "";
    if(lightboxLastFocused && typeof lightboxLastFocused.focus === "function") lightboxLastFocused.focus();
  }

  function lightboxNav(delta){
    lightboxIndex = (lightboxIndex + delta + lightboxUrls.length) % lightboxUrls.length;
    showLightboxImage();
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", function(){ lightboxNav(-1); });
  document.getElementById("lightboxNext").addEventListener("click", function(){ lightboxNav(1); });
  lightboxBackdrop.addEventListener("click", function(e){
    if(e.target === lightboxBackdrop) closeLightbox();
  });
  document.addEventListener("keydown", function(e){
    if(!lightboxBackdrop.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") lightboxNav(-1);
    if(e.key === "ArrowRight") lightboxNav(1);
  });

  document.getElementById("searchInput").addEventListener("input", function(e){
    searchTerm = e.target.value || "";
    renderPins();
    renderPlaceList();
  });

  var tabList = document.getElementById("tab-list");
  var tabPassport = document.getElementById("tab-passport");
  var panelList = document.getElementById("panel-list");
  var panelPassport = document.getElementById("panel-passport");

  function activateTab(which){
    var listActive = which === "list";
    tabList.setAttribute("aria-selected", String(listActive));
    tabPassport.setAttribute("aria-selected", String(!listActive));
    panelList.hidden = !listActive;
    panelPassport.hidden = listActive;
  }
  tabList.addEventListener("click", function(){ activateTab("list"); });
  tabPassport.addEventListener("click", function(){ activateTab("passport"); });

  /* ---------------------------------------------------------
     MAIN VIEW TOGGLE (desktop only) — Places vs. Map, defaulting
     to Places. Mobile ignores this entirely: both panels stay
     stacked (list first) regardless of view-places/view-map,
     since those classes only have any effect above the sidebar-
     reorder breakpoint in style.css.
  --------------------------------------------------------- */
  var tabViewPlaces = document.getElementById("tab-view-places");
  var tabViewMap = document.getElementById("tab-view-map");
  var mainGrid = document.getElementById("mainGrid");

  function activateMainView(which){
    var placesActive = which === "places";
    tabViewPlaces.setAttribute("aria-selected", String(placesActive));
    tabViewMap.setAttribute("aria-selected", String(!placesActive));
    mainGrid.classList.toggle("view-places", placesActive);
    mainGrid.classList.toggle("view-map", !placesActive);
    if(!placesActive && leafletMap){
      leafletMap.invalidateSize();
      leafletMap._applyFitZoomRange();
      leafletMap.fitBounds(mapBounds);
    }
  }
  tabViewPlaces.addEventListener("click", function(){ activateMainView("places"); });
  tabViewMap.addEventListener("click", function(){ activateMainView("map"); });

  document.getElementById("resetPassport").addEventListener("click", function(){
    if(window.confirm(t("resetConfirm"))){
      stamped = {};
      saveStamped();
      renderPins();
      renderPlaceList();
      renderPassport();
    }
  });

  /* ---------------------------------------------------------
     LANGUAGE TOGGLE — defaults to English; re-renders every
     translatable piece of UI without reloading the page.
  --------------------------------------------------------- */
  function applyStaticStrings(){
    document.documentElement.lang = LANG;
    document.getElementById("txt-eyebrow").textContent = t("eyebrow");
    document.getElementById("txt-subtitle").textContent = t("subtitle");
    document.getElementById("searchInput").placeholder = t("searchPlaceholder");
    document.getElementById("searchInput").setAttribute("aria-label", t("searchAria"));
    document.getElementById("filterChips").setAttribute("aria-label", t("filtersAria"));
    document.querySelector(".map-frame").setAttribute("aria-label", t("mapFrameAria"));
    document.getElementById("txt-map-caption").innerHTML = t("mapCaption");
    document.querySelector(".sidebar").setAttribute("aria-label", t("sidebarAria"));
    tabList.textContent = t("tabPlaces");
    tabPassport.textContent = t("tabPassport");
    document.getElementById("mainViewToggle").setAttribute("aria-label", t("mainViewAria"));
    tabViewPlaces.textContent = t("viewPlacesTab");
    tabViewMap.textContent = t("viewMapTab");
    document.getElementById("resetPassport").textContent = t("resetPassport");
    document.getElementById("txt-footer").textContent = t("footer");
    document.getElementById("modalClose").setAttribute("aria-label", t("modalClose"));
    if(leafletMap){
      var zoomInEl = mapContainer.querySelector(".leaflet-control-zoom-in");
      var zoomOutEl = mapContainer.querySelector(".leaflet-control-zoom-out");
      if(zoomInEl){ zoomInEl.title = t("zoomInAria"); zoomInEl.setAttribute("aria-label", t("zoomInAria")); }
      if(zoomOutEl){ zoomOutEl.title = t("zoomOutAria"); zoomOutEl.setAttribute("aria-label", t("zoomOutAria")); }
      var resetEl = leafletMap.resetControl.getContainer();
      resetEl.title = t("zoomResetAria");
      resetEl.setAttribute("aria-label", t("zoomResetAria"));
    }
  }

  function setLang(lang){
    if(lang === LANG) return;
    LANG = lang;
    document.querySelectorAll("#langToggle button").forEach(function(b){
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    applyStaticStrings();
    renderLegend();
    renderFilterChips();
    renderPins();
    renderPlaceList();
    renderPassport();
    if(activePlaceId) openModal(activePlaceId);
  }

  document.querySelectorAll("#langToggle button").forEach(function(btn){
    btn.addEventListener("click", function(){ setLang(btn.getAttribute("data-lang")); });
  });

  function init(){
    initLeafletMap();
    applyStaticStrings();
    renderLegend();
    renderFilterChips();
    renderPins();
    renderPlaceList();
    renderPassport();
  }

  init();

})();
