// ---------- Icons (inline SVG strings, 24x24, stroke=currentColor) ----------
const ICONS = {
  cable:
    '<path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z"/><path d="M3 5V3"/><path d="M7 5V3"/><path d="M19 15a2 2 0 0 0-2 2v2h6v-2a2 2 0 0 0-2-2Z"/><path d="M17 21v-2"/><path d="M21 21v-2"/><path d="M22 9v1c0 1.1-.9 2-2 2H4c-1.1 0-2 .9-2 2v1"/>',
  conectores:
    '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
  herrajes:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  empalme:
    '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  pasivos:
    '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  activos:
    '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  herramientas:
    '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  catv:
    '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
};

function iconSvg(name, size) {
  size = size || 20;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    ICONS[name] +
    "</svg>"
  );
}

// ---------- Real product taxonomy (OpticTimes México distributor line) ----------
// Source: optictimes.mx (B2B portal, login-gated) + optictimes.la sister catalog + third-party
// indexing (QuimiNet). Pending: confirm with OpticTimes rep which of these EEPSA will actually
// stock in the physical store, plus official spec sheets, pricing and product photography.
const CATEGORIES = [
  { slug: "cable", name: "Cable de fibra óptica", hint: "Monomodo, multimodo, ADSS, drop", icon: "cable" },
  { slug: "conectores", name: "Conectores y jumpers", hint: "SC, LC, FC, patchcords", icon: "conectores" },
  { slug: "herrajes", name: "Herrajes de instalación", hint: "Retención ADSS / OPGW, abrazaderas", icon: "herrajes" },
  { slug: "empalme", name: "Cajas de empalme y NAP", hint: "Cierres herméticos, terminales", icon: "empalme" },
  { slug: "pasivos", name: "Pasivos de fibra", hint: "Splitters / divisores PLC", icon: "pasivos" },
  { slug: "activos", name: "Equipos GPON / GEPON", hint: "OLT, ONU/ONT, routers", icon: "activos" },
  { slug: "herramientas", name: "Herramientas y medición", hint: "Fusionadoras, OTDR, fuente de luz", icon: "herramientas" },
  { slug: "catv", name: "TV digital / CATV", hint: "Moduladores, STB, amplificadores", icon: "catv" },
];

// Secondary refinement (only shown for the "cable" category, where we have concrete attributes)
const cableTypes = [
  { value: "monomodo", label: "Monomodo (OS2)", hint: "Largas distancias" },
  { value: "multimodo", label: "Multimodo (OM4)", hint: "Redes internas" },
  { value: "armado", label: "Armado / blindado", hint: "Exteriores exigentes" },
  { value: "drop", label: "Cable Drop FTTH", hint: "Última milla" },
];
const connectors = [
  { value: "SC", label: "SC" },
  { value: "LC", label: "LC" },
  { value: "FC", label: "FC" },
];
const LENGTH_MIN = 50;
const LENGTH_MAX = 3000;

// Placeholder seed catalog. `price: null` is intentional: OpticTimes/EEPSA pricing is
// quote-based through a sales advisor, not a fixed online price — see PROJECT.md.
// `placeholder: true` flags data to be replaced once the real catalog + photos arrive.
const products = [
  { id: "ot-cable-os2", name: "OpticTimes CoreLine OS2", category: "cable", price: null, placeholder: true, compatibleCables: ["monomodo", "armado", "drop"], compatibleConnectors: ["SC", "LC", "FC"], maxLength: 3000, highlights: ["Baja atenuación 0.18 dB/km", "Cubierta LSZH", "Carrete de hasta 3 km"] },
  { id: "ot-cable-om4", name: "OpticTimes FlexLine OM4", category: "cable", price: null, placeholder: true, compatibleCables: ["multimodo"], compatibleConnectors: ["SC", "LC"], maxLength: 2000, highlights: ["10/40/100 Gbps", "Uso interior", "Bajo radio de curvatura"] },
  { id: "ot-cable-adss", name: "OpticTimes SkyLine ADSS", category: "cable", price: null, placeholder: true, compatibleCables: ["armado"], compatibleConnectors: ["FC", "SC"], maxLength: 3000, highlights: ["Autosoportado sin mensajero", "Resistente a UV", "Vanos de hasta 100 m"] },
  { id: "ot-cable-drop", name: "OpticTimes DropLine FTTH", category: "cable", price: null, placeholder: true, compatibleCables: ["drop"], compatibleConnectors: ["SC", "LC"], maxLength: 1000, highlights: ["Última milla", "Miembro de tensión FRP", "Fácil pelado"] },

  { id: "ot-conn-kit", name: "OpticTimes ConnectKit Pro", category: "conectores", price: null, placeholder: true, highlights: ["Pulido APC/UPC", "Inserción rápida", "Pack de 50 uds"] },
  { id: "ot-jumper-lc", name: "OpticTimes Jumper LC-SC", category: "conectores", price: null, placeholder: true, highlights: ["Dúplex/símplex", "Monomodo 9/125", "Longitudes a la medida"] },

  { id: "ot-herraje-adss", name: "OpticTimes Herraje ADSS", category: "herrajes", price: null, placeholder: true, highlights: ["Retención preformada", "Uso exterior", "Compatible con poste/torre"] },
  { id: "ot-abrazadera", name: "OpticTimes Abrazadera Universal", category: "herrajes", price: null, placeholder: true, highlights: ["Ajuste rápido", "Acero galvanizado", "Varias medidas de poste"] },

  { id: "ot-nap-16", name: "OpticTimes NAP Terminal 16", category: "empalme", price: null, placeholder: true, highlights: ["16 salidas drop", "IP65 exterior", "Bandeja de empalme integrada"] },
  { id: "ot-dome-48", name: "OpticTimes DomeSeal 48", category: "empalme", price: null, placeholder: true, highlights: ["IP68 exterior", "48 empalmes", "Sellado mecánico"] },

  { id: "ot-splitter-1x8", name: "OpticTimes Splitter PLC 1x8", category: "pasivos", price: null, placeholder: true, highlights: ["Inserción balanceada", "Formato blindado", "Conectorizado o bare fiber"] },
  { id: "ot-splitter-1x16", name: "OpticTimes Splitter PLC 1x16", category: "pasivos", price: null, placeholder: true, highlights: ["Para cajas NAP", "Baja pérdida de inserción", "Montaje en bandeja"] },

  { id: "ot-olt-gpon", name: "OpticTimes GPON OLT", category: "activos", price: null, placeholder: true, highlights: ["Múltiples puertos PON", "Gestión remota", "Uplink 10G"] },
  { id: "ot-ont-wifi", name: "OpticTimes ONT WiFi AC", category: "activos", price: null, placeholder: true, highlights: ["Router + ONT integrado", "WiFi doble banda", "4 puertos LAN"] },

  { id: "ot-fusionadora", name: "OpticTimes Fusionadora Core-Alignment", category: "herramientas", price: null, placeholder: true, highlights: ["Alineación por núcleo", "Pantalla táctil", "Batería para campo"] },
  { id: "ot-otdr", name: "OpticTimes OTDR Compacto", category: "herramientas", price: null, placeholder: true, highlights: ["Certificación de enlaces", "Detección de fallas", "Pantalla de alto contraste"] },

  { id: "ot-modulador", name: "OpticTimes Modulador HDMI a RF", category: "catv", price: null, placeholder: true, highlights: ["Salida ISDB-T", "Configuración por app", "Uso residencial/hotelero"] },
  { id: "ot-edfa", name: "OpticTimes Amplificador EDFA", category: "catv", price: null, placeholder: true, highlights: ["Refuerzo de señal óptica", "Múltiples salidas", "Monitoreo de nivel"] },
];

function filterByCategory(categorySlug) {
  return products.filter((p) => p.category === categorySlug);
}

function filterCableProducts(cable, connector, length) {
  const pool = filterByCategory("cable");
  const matches = pool.filter(
    (p) =>
      p.compatibleCables.includes(cable) &&
      p.compatibleConnectors.includes(connector) &&
      p.maxLength >= length
  );
  if (matches.length > 0) return matches;
  return pool.filter((p) => p.compatibleCables.includes(cable));
}
