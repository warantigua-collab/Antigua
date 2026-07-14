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
      tabPlaces: "Places",
      tabPassport: "Passport",
      resetPassport: "Reset passport",
      resetConfirm: "Reset your passport? All stamps saved on this device will be deleted.",
      footer: "All names and positions come from the screenshots you sent. Send me photos, videos, reviews, or position corrections for any place and I'll update the map.",
      modalClose: "Close",
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
      tabPlaces: "Lugares",
      tabPassport: "Pasaporte",
      resetPassport: "Reiniciar pasaporte",
      resetConfirm: "¿Reiniciar tu pasaporte? Se borrarán todos los sellos guardados en este dispositivo.",
      footer: "Todos los nombres y posiciones vienen de las capturas que enviaste. Envíame fotos, videos, reseñas o correcciones de posición para cada lugar y actualizo el mapa.",
      modalClose: "Cerrar",
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
    { id:"cerro-san-cristobal", name:"Cerro San Cristóbal", cats:["restaurant"], x:26, y:39,
      desc:{ en:"Restaurant on the tight hairpin bend of the main road, right next to Restaurante Antigua Mágica.",
             es:"Restaurante en la curva cerrada (herradura) del camino principal, junto a Restaurante Antigua Mágica." }, reviews:[] },
    { id:"restaurante-antigua-magica", name:"Restaurante Antigua Mágica", cats:["restaurant"], x:29, y:41,
      desc:{ en:"Restaurant right beside Cerro San Cristóbal, on the same bend of the road.",
             es:"Restaurante justo al lado de Cerro San Cristóbal, en la misma curva del camino." }, reviews:[] },
    { id:"vertigo-antigua", name:"Vértigo Antigua — Mirador Extremo", cats:["viewpoint"], x:38, y:50,
      desc:{ en:"Extreme viewpoint on the road, next to La Pilita.",
             es:"Mirador extremo sobre el camino, junto a La Pilita." }, reviews:[] },
    { id:"la-pilita", name:"La Pilita", cats:["wellness"], x:42, y:52,
      desc:{ en:"Wellness spot just past Vértigo Antigua, on the same bend of the road.",
             es:"Punto de bienestar justo después de Vértigo Antigua, sobre la misma curva del camino." }, reviews:[] },
    { id:"plaza-san-cristobal-alto", name:"San Cristóbal El Alto (main plaza)", cats:["landmark"], x:43, y:69,
      desc:{ en:"The heart of the village — the main plaza where the church stands (marked with the pine-tree icon). Position estimated from road continuity; confirm if it needs adjusting.",
             es:"El centro del pueblo — la plaza principal donde está la iglesia (marcada con el ícono de pino). Posición estimada por continuidad del camino; confírmala si necesita ajuste." }, reviews:[] },
    { id:"casa-san-sebastian", name:"Casa San Sebastián", cats:["lodging"], x:40, y:70,
      desc:{ en:"Lodging right next to the village's main plaza.",
             es:"Alojamiento justo junto a la plaza principal del pueblo." }, reviews:[] },
    { id:"tienda-abuelitos", name:"Tienda Abuelitos Coca y Miguel", cats:["service","restaurant"], x:44, y:63,
      desc:{ en:"Souvenir shop and restaurant, near the main plaza.",
             es:"Tienda de recuerdos y también restaurante, cerca de la plaza principal." }, reviews:[] },
    { id:"el-temazcal", name:"El Temazcal", cats:["wellness"], x:43, y:76,
      desc:{ en:"Nursery / temazcal near the main plaza, at the spot that showed as an unnamed camera icon on the map.",
             es:"Vivero / temazcal cerca de la plaza principal, en el punto que en el mapa aparecía como el ícono de cámara sin nombre." }, reviews:[] },
    { id:"la-pilona", name:"La Pilona", cats:["wellness"], x:49, y:75,
      desc:{ en:"Wellness spot on the road, east of the main plaza.",
             es:"Punto de bienestar sobre el camino, al este de la plaza principal." }, reviews:[] },
    { id:"tierra-y-lava", name:"Tierra & Lava", cats:["lodging"], x:69, y:71,
      desc:{ en:"Lodging on the road bend toward the east side of the map, next to Sky Dancer Villa.",
             es:"Alojamiento en la curva del camino hacia el este del mapa, junto a Sky Dancer Villa." }, reviews:[] },
    { id:"sky-dancer-villa", name:"Sky Dancer Villa", cats:["lodging"], x:73, y:74,
      desc:{ en:"Lodging next to Tierra & Lava, on the same bend of the road.",
             es:"Alojamiento junto a Tierra & Lava, sobre la misma curva del camino." }, reviews:[] },
    { id:"campanario-de-panchoy", name:"Campanario de Panchoy", cats:["lodging","nature"], x:95, y:90,
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

     Note: HEIC/HEIF photos (the default format on newer iPhones)
     are skipped, because most browsers can't display HEIC directly
     — convert those to .jpg before adding them (Preview on Mac,
     or "Photos" > Export on iPhone/Mac, or any online converter).
  --------------------------------------------------------- */
  var GITHUB_OWNER = "warantigua-collab";
  var GITHUB_REPO = "Antigua";
  var GITHUB_BRANCH = "main";
  var VALID_PHOTO_EXT = /\.(jpe?g|png|webp|gif)$/i;
  var MAX_PHOTOS_PER_PLACE = 6;
  var photoCache = {}; // placeId -> array of download URLs (avoids re-fetching per open)

  function fetchPlacePhotos(placeId, callback){
    if(photoCache[placeId]){ callback(photoCache[placeId]); return; }
    var url = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO
      + "/contents/images/" + encodeURIComponent(placeId) + "?ref=" + GITHUB_BRANCH;

    fetch(url, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(data){
        var urls = (Array.isArray(data) ? data : [])
          .filter(function(f){ return f.type === "file" && VALID_PHOTO_EXT.test(f.name); })
          .sort(function(a,b){ return a.name.localeCompare(b.name, undefined, { numeric:true }); })
          .slice(0, MAX_PHOTOS_PER_PLACE)
          .map(function(f){ return f.download_url; });
        photoCache[placeId] = urls;
        callback(urls);
      })
      .catch(function(){ callback([]); });
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
    +   '<filter id="paper" x="-20%" y="-20%" width="140%" height="140%">'
    +     '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" result="noise"/>'
    +     '<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.21  0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0.06 0"/>'
    +   '</filter>'
    +   '<radialGradient id="vignette" cx="50%" cy="45%" r="78%">'
    +     '<stop offset="60%" stop-color="#e8d9b5" stop-opacity="0"/>'
    +     '<stop offset="100%" stop-color="#5b4636" stop-opacity="0.38"/>'
    +   '</radialGradient>'
    + '</defs>'
    + '<rect x="0" y="0" width="1000" height="620" fill="#e8d9b5"/>'
    + '<rect x="0" y="0" width="1000" height="620" filter="url(#paper)"/>'
    + contourGroup()
    + forestPatches()
    /* El Bajo street grid — the actual small block pattern at the
       northwest corner of your reference screenshot */
    + '<g stroke="#8a7550" stroke-width="3" fill="none" opacity="0.55" stroke-linecap="round">'
    +   '<path d="M0,35 H185 M0,62 H165 M0,90 H145 M28,9 V108 M65,9 V115 M102,18 V108 M138,27 V98"/>'
    + '</g>'
    /* MAIN ROUTE — densely traced waypoints following the real road
       shape in your overview screenshot: exits San Cristóbal El Bajo
       (top-left), zigzags past Santa Ana/Los Nísperos, tight hairpin
       right at Cerro San Cristóbal, bends through Vértigo/La Pilita,
       threads the plaza, then runs the long stretch southeast to
       Tierra & Lava, Sky Dancer Villa, and finally Campanario de
       Panchoy — the end of San Cristóbal El Alto. */
    + roadPath("200,68 220,93 260,112 240,130 280,146 260,161 280,174 260,180 240,198 270,217 250,229 260,242", 7)
    /* tight hairpin loop exactly at Cerro San Cristóbal */
    + roadPath("260,242 230,254 210,267 220,282 250,288 280,282 290,267 260,260 250,273 250,298", 7)
    /* Sitio Santa Clara through Vértigo / La Pilita */
    + roadPath("250,298 290,304 330,307 360,310 380,310 400,316 420,322 440,329", 6)
    /* through the plaza cluster */
    + roadPath("440,329 430,360 430,391 430,409 430,428 400,434 430,446 430,471 460,465 490,465 520,459", 6)
    /* long southeast stretch to Tierra&Lava / Sky Dancer / Campanario (the end of the village) */
    + roadPath("520,459 580,453 630,446 690,440 730,459 800,484 870,515 950,558", 6)
    /* upper branch off the El Bajo road toward Finca El Pilar / La Máquina / Mirador / Birding Antigua */
    + roadPath("200,68 260,50 310,25 310,9 340,19 360,34 400,37 460,31 520,37 580,43 630,50 700,62 780,74 840,87 890,99", 5)
    /* sub-branch up to El Mirador del Abuelo */
    + roadPath("360,34 380,62 400,93 430,133", 4)
    /* branch down toward the lower settlement (unlabeled for now — road kept for geographic context) */
    + roadPath("250,298 200,335 160,372 130,409 100,446 80,484", 5)
    + '<g stroke="#8a7550" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round">'
    +   '<path d="M20,505 L95,478 L175,510 M45,540 L130,510 M70,565 L155,530"/>'
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

  function renderPins(){
    mapContainer.querySelectorAll(".pin").forEach(function(p){ p.remove(); });
    var term = searchTerm.trim().toLowerCase();

    PLACES.forEach(function(place){
      var matchesFilter = (activeFilter === "all") || (place.cats.indexOf(activeFilter) !== -1);
      var matchesSearch = !term || place.name.toLowerCase().indexOf(term) !== -1;
      var visible = matchesFilter && matchesSearch;
      var primaryColor = CATS[place.cats[0]].color;
      var catLabels = place.cats.map(catLabel).join(" · ");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pin" + (visible ? "" : " faded");
      btn.style.left = place.x + "%";
      btn.style.top = place.y + "%";
      btn.setAttribute("aria-label", place.name + " — " + catLabels + (stamped[place.id] ? t("stampedSuffix") : ""));
      btn.innerHTML = pinSVG(primaryColor);

      if(stamped[place.id]){
        var badge = document.createElement("span");
        badge.className = "stamped-badge";
        badge.textContent = "✓";
        btn.appendChild(badge);
      }

      btn.addEventListener("click", function(){ openModal(place.id); });
      mapContainer.appendChild(btn);
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
        + '<span class="info">'
        +   '<strong>'+escapeHTML(place.name)+'</strong>'
        +   '<small>'+catLabels+'</small>'
        +   (stamped[place.id] ? '<div class="stamped-check">'+t("stampedCheck")+'</div>' : '')
        + '</span>';
      row.addEventListener("click", function(){ openModal(place.id); });
      list.appendChild(row);
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
    fetchPlacePhotos(place.id, function(urls){
      if(activePlaceId !== place.id) return; // modal moved on before this resolved
      var wrap = document.getElementById("galleryWrap");
      if(!wrap) return;
      if(urls.length === 0){
        wrap.innerHTML = '<div class="frame" style="background:linear-gradient(135deg,'+primaryColor+',#2b2015)">'
          + t("photoPending")(1) + '</div>';
        return;
      }
      wrap.innerHTML = urls.map(function(u){
        return '<a class="frame photo-frame" href="'+u+'" target="_blank" rel="noopener" '
          + 'style="background-image:url(\''+u+'\')" aria-label="Open photo full size"></a>';
      }).join("");
    });

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
    document.getElementById("resetPassport").textContent = t("resetPassport");
    document.getElementById("txt-footer").textContent = t("footer");
    document.getElementById("modalClose").setAttribute("aria-label", t("modalClose"));
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
    mapContainer.insertAdjacentHTML("afterbegin", buildTerrainSVG());
    applyStaticStrings();
    renderLegend();
    renderFilterChips();
    renderPins();
    renderPlaceList();
    renderPassport();
  }

  init();

})();
