# Nexi · Catálogo interactivo EEPSA — Documentación del proyecto

> Este archivo es la fuente de verdad del proyecto. Está pensado para que cualquier
> persona (o cualquier modelo/IA) que retome el trabajo tenga contexto completo sin
> depender del historial de chat. Actualízalo cuando cambien decisiones relevantes.

**Última actualización:** 2026-07-31

---

## 1. Visión y alcance del negocio

EEPSA es distribuidor físico de equipo de fibra óptica de la marca **OpticTimes** (proveedor
mexicano/multinacional, ver sección 3). El objetivo de este proyecto **no es una tienda en
línea**: es un catálogo interactivo que se comporta como un chatbot ("Nexi") para que el
cliente explore productos por categoría y arme una lista de interés.

Reglas de negocio fijadas por el cliente (no negociables salvo que se indique lo contrario):

- **Nexi no tiene IA real.** Es una interfaz de filtrado por categoría/atributos disfrazada de
  conversación (mensajes simulados, indicador de "escribiendo", respuestas guionadas). Da la
  apariencia de asistente inteligente sin serlo.
- **Filtro puro por categoría.** La mecánica central es elegir categoría de producto y, cuando
  aplica, refinar por atributos (tipo de cable, conector, longitud).
- **No hay pago ni compra en línea.** El flujo termina en una "solicitud" (lista de productos +
  datos de contacto) que se turna a un **agente de telemarketing** de EEPSA. Ese agente opera
  por llamada, correo y esta misma sección de la página — no por chat en vivo.
- **Sin roles ni login por ahora.** Autenticación/roles de usuario se evaluará a futuro, no es
  parte del alcance actual.
- El sitio se monta en un **subdominio** (`catalogo.eepsa.com.mx`) separado del repositorio del
  sitio principal (`www.eepsa.com.mx`, vive en otro repo). El único acoplamiento entre ambos es
  un link normal desde el sitio principal hacia el subdominio.

## 2. Estado actual (qué es real, qué es mock)

| Pieza | Estado |
|---|---|
| Frontend (chat, filtro por categoría, carrito, formulario) | **Construido**, funcional en el navegador |
| Datos de producto (nombres, specs, categorías) | **Placeholder** (`placeholder: true` en `js/data.js`), pendiente catálogo real de OpticTimes |
| Precios | **Intencionalmente ocultos.** Modelo es de cotización con asesor, no precio fijo online. Campo `price` existe en el schema pero se deja `null` |
| Fotos de producto | **No existen aún.** Se muestra un ícono de categoría como placeholder (ver sección 6) |
| Envío de la solicitud a ventas | **Mock de frontend.** El formulario simula un envío (`setTimeout`) y muestra confirmación, pero no llama a ningún backend real todavía. Ver sección 8 (backlog) |
| Backend / base de datos | **No existe todavía.** Ver sección 5 para el plan cuando haya datos reales |
| Roles / autenticación | Fuera de alcance por ahora |

## 3. Proveedor y taxonomía de productos

El proveedor es **OpticTimes México** (multinacional con operación en LatAm, ~10 años en el
sector, planta en Hangzhou, China). Investigado porque el cliente no tenía aún una lista de
categorías/productos definida.

- Sitio oficial: **optictimes.mx** — es una **plataforma B2B con login** (existe `optictimes.mx/login`,
  app "OptictimesMall"). El cliente (EEPSA) **no tiene cuenta todavía** en ese portal. No se pudo
  scrapear porque requiere sesión autenticada (y no corresponde automatizar un login ajeno).
- Taxonomía reconstruida indirectamente vía el catálogo hermano `optictimes.la` (categorías/subcategorías
  indexadas por buscador) + listado de productos indexado por QuimiNet para OpticTimes México.

**8 categorías reales usadas como base del catálogo** (`js/data.js` → `CATEGORIES`):

1. Cable de fibra óptica — monomodo, multimodo, ADSS, drop
2. Conectores y jumpers — SC, LC, FC, patchcords
3. Herrajes de instalación — retención ADSS/OPGW, abrazaderas
4. Cajas de empalme y NAP — cierres herméticos, terminales
5. Pasivos de fibra — splitters/divisores PLC
6. Equipos GPON/GEPON — OLT, ONU/ONT, routers
7. Herramientas y medición — fusionadoras, OTDR, fuente de luz
8. TV digital / CATV — moduladores, STB, amplificadores EDFA

**Pendiente de confirmar con el cliente:** de estas 8, ¿cuáles vende realmente la tienda física
de EEPSA? Es posible que el subconjunto real sea menor.

## 4. Cómo conseguir datos reales (imágenes + specs)

Pendiente, en este orden de preferencia:

1. **Pedir a OpticTimes México (como distribuidor autorizado)** hoja de specs + ZIP de fotos
   oficiales de producto. Es lo normal entre proveedor-distribuidor, no requiere scraping.
2. Si el cliente obtiene cuenta en el portal `optictimes.mx/mall`, revisar si tiene función de
   exportar catálogo — sería la fuente más limpia.
3. Fotos del sitio oficial de OpticTimes, solo si son fotos de producto pensadas para reventa
   (confirmar con el proveedor, no asumir).
4. Evitar scraping de terceros que no sean el fabricante — tema de derechos de imagen.
5. Mientras no haya fotos: el sitio usa **íconos de categoría** como placeholder (ver sección 6),
   no imágenes rotas ni inventadas.

## 5. Stack tecnológico

**Decisión: HTML/CSS/JS "vanilla" + Tailwind vía CDN, sin build step.**

Por qué (contexto que motivó la decisión, no la reevalúes sin este contexto):

- El sitio principal (`www.eepsa.com.mx`) vive en **otro repositorio** y este catálogo solo se
  le va a enlazar con un `<a href>` normal — no comparten código, componentes ni build.
  Introducir Next.js/React aquí no compraría nada (no hay reuso cross-repo) y sí sumaría Node/
  build tooling innecesario para lo que es, en esencia, una página estática.
- Prioridad explícita del cliente: **"montarlo de manera sencilla"** en un subdominio. Cero build
  = subir carpeta a Vercel/Netlify y listo.
- Cuando haya backend real (productos dinámicos, envío de pedido a ventas), la vía de menor
  fricción es **Supabase** (Postgres + Storage) consumido directo desde el JS del cliente, sin
  necesidad de servidor propio ni de migrar de stack. Ver sección 8.

**No usar** Next.js/React/Vue aquí a menos que cambie el requisito de "repos separados,
cero acoplamiento". Si en el futuro el catálogo se fusiona al repo del sitio principal, esta
decisión debe revisarse.

## 6. Sistema de diseño

### Marca

El color de marca **no es** un teal genérico de Tailwind — se extrajo por análisis de píxeles
del logo real (`EEPSAlogo.avif`, convertido a PNG con ffmpeg porque Pillow/PIL de este entorno
no decodifica AVIF):

| Token | Hex | Uso |
|---|---|---|
| `teal-500` (marca, `DEFAULT`) | `#38958D` | Color primario real de EEPSA (medido del logo) |
| `teal-600` | `#2F7F78` | Hover/estados activos |
| `teal-700` | `#256560` | Texto sobre fondos claros de marca, estados presionados |
| `teal-50` / `teal-100` | `#EEF7F6` / `#DCEFEC` | Fondos suaves, tags, tintes |
| Gris del logo | `#8A8C8B` | Solo decorativo (íconos, líneas) — **no usar como color de texto**, no pasa 4.5:1 de contraste. Para texto secundario se usa `ink-muted` (`#475569`, sí cumple AA) |
| `ink` (texto principal) | `#0F172A` | — |

Todo esto vive en el `tailwind.config` inline de `index.html` — es la única fuente de verdad de
color, no hardcodear hex sueltos en nuevos componentes.

### Tipografía

Pairing "Tech Startup" (elegido para sentir premium/tecnológico sin perder legibilidad):

- **Headings** (nombre de Nexi, nombres de producto, títulos): `Space Grotesk` — clase utilitaria `.font-heading`
- **Body** (texto de chat, formularios, párrafos): `DM Sans` — fuente `sans` por defecto de Tailwind

Ambas cargadas vía Google Fonts en `css/styles.css` (`@import`).

### Estilo visual

Base: **"AI-native UI"** (chrome mínimo, burbujas de chat, indicador de escritura, streaming-like
reveals) + toques de **glassmorphism** sutil (fondo con blobs radiales de color marca + tarjetas
`backdrop-blur`) para el efecto "se ve caro / hay producción" que pidió el cliente, sin caer en
estilos que no van con una marca B2B industrial (se descartó dark/cyberpunk/neón).

Detalles de producción implementados:

- Fondo ambiente con gradientes radiales tintados de marca (`.nexi-bg`), no blanco plano.
- Tarjeta de la app "flota" sobre ese fondo (`rounded-3xl`, `shadow-2xl`) en vez de ocupar toda
  la ventana — patrón típico de producto SaaS premium.
- Mensajes entran con animación sutil (`.nexi-msg-in`, respeta `prefers-reduced-motion`).
- Selector de conector (SC/LC/FC) es un segmented control con **pill deslizante** medido por
  geometría real del botón activo (no porcentaje fijo), para que calce exacto con el gap.
- Punto "en línea" de Nexi con pulso sutil (`.nexi-online-dot`).
- Placeholder de imagen de producto: en vez de una foto rota, cada tarjeta muestra el **ícono de
  su categoría** sobre un tile con gradiente de marca — se ve intencional, no como un error.

### Mascota (Nexy / Nexi)

- Fuente: `nexi.jpeg` — hoja de turnaround 3D ("NEXY", 5 vistas + wireframe + dimensiones para
  impresión 3D), no es un asset web listo.
- Se recortaron 2 variantes con Python/Pillow y se guardaron en `assets/`:
  - `assets/nexi-avatar.jpg` — headshot recortado (vista frontal, cabeza+hombro+pulgar arriba),
    usado como avatar circular en header y burbujas de chat.
  - `assets/nexi-full.jpg` — cuerpo completo (vista frontal), disponible para uso futuro (ej.
    estado vacío, pantalla de bienvenida más grande) pero no integrado aún en `index.html`.
- El avatar se monta sobre un círculo `bg-[#f3f4f6]` (gris casi blanco, medido del fondo real de
  la imagen) con anillo `ring-teal-500/30` — así el fondo gris claro de la imagen fuente no
  choca contra un círculo teal sólido. Cuando llegue un PNG con fondo transparente real, se
  puede simplificar quitando ese match de color.
- `EEPSAlogo.avif` (logo real de la empresa) se convirtió a `assets/eepsa-logo.png` para poder
  inspeccionarlo (extracción de color); **no está insertado en la UI todavía** — no se ha pedido
  usar el wordmark de EEPSA dentro del catálogo, solo se usó como fuente de la paleta.

## 7. Estructura del proyecto

```
CatalogoEepsa/
├── index.html          # Único punto de entrada. Markup + Tailwind config inline.
├── css/
│   └── styles.css       # Fuentes, fondo ambiente, glass, slider, animaciones, keyframes.
├── js/
│   ├── data.js          # Categorías, íconos SVG, catálogo placeholder, helpers de filtrado.
│   └── app.js           # Todo el estado e interacción: chat, filtros, carrito, formulario.
├── assets/
│   ├── nexi-avatar.jpg  # Mascota recortada (avatar circular).
│   ├── nexi-full.jpg    # Mascota recortada (cuerpo completo, sin usar aún).
│   └── eepsa-logo.png   # Logo convertido desde AVIF (referencia de color, no usado en UI).
├── nexi.jpeg            # Fuente original de la mascota (hoja de turnaround 3D). No tocar.
├── EEPSAlogo.avif       # Logo original de la empresa, formato fuente.
└── PROJECT.md           # Este archivo.
```

`nexi.html` (demo original de un solo archivo) fue reemplazado por esta estructura y ya no
existe en el repo — su contenido vive ahora repartido en `index.html` + `css/` + `js/`.

## 8. Flujo del chatbot (estado por estado)

1. **Saludo** (estático) — Nexi se presenta.
2. **Pregunta de categoría** (estática) + **grid de categorías** (`#category-card`) — las 8
   categorías reales como chips con ícono. Click = filtro primario por categoría.
3. Según la categoría:
   - **"cable"** → Nexi pregunta detalle → controles secundarios (tipo de cable, longitud con
     slider, conector con segmented control) → botón "Ver recomendaciones".
   - **cualquier otra categoría** → salta directo a resultados (no hay suficientes atributos
     reales todavía para sub-filtrar el resto de categorías; ver backlog).
4. **Indicador de escritura** (simulado, `setTimeout`) → **resultados** en carrusel horizontal,
   tarjeta por producto con ícono de categoría, highlights, badge "Cotización con asesor" y
   botón "Añadir a la solicitud".
5. **"Ajustar filtros de nuevo"** vuelve al paso 2 sin vaciar el carrito (para poder buscar en
   varias categorías y acumular productos de interés antes de enviar la solicitud).
6. **Carrito** (chip en el header, contador de artículos) abre una **hoja inferior** con:
   - Lista de productos agregados (con botón de quitar).
   - Aviso explícito: *"Esta solicitud no genera ningún cargo ni pago en línea..."*
   - Formulario: nombre y teléfono/WhatsApp (obligatorios), correo y comentario (opcionales).
   - Botón "Enviar solicitud a ventas".
7. **Confirmación** (mock): tras ~900ms simulados, muestra ícono de éxito + mensaje de que un
   asesor de EEPSA contactará en menos de 24h hábiles. Limpia el carrito.

## 9. Plan de despliegue

1. Conectar este repo a **Vercel o Netlify** (capa gratis alcanza). Cero configuración: es HTML
   estático, `index.html` en la raíz.
2. En **Namecheap**, crear registro **CNAME** `catalogo` → host que entregue Vercel/Netlify.
3. Verificar que `catalogo.eepsa.com.mx` resuelve y sirve el sitio con HTTPS (automático en
   ambos proveedores).
4. En el repo del sitio principal (`www.eepsa.com.mx`, repo aparte): agregar un link/botón
   normal `<a href="https://catalogo.eepsa.com.mx">`. No requiere ningún otro cambio ahí.

## 10. Backlog / próximos pasos

En orden aproximado de dependencia:

1. **Confirmar con EEPSA** qué categorías de las 8 va a vender realmente la tienda física.
2. **Conseguir catálogo real** de OpticTimes México (specs + fotos) — ver sección 4.
3. Reemplazar `js/data.js` (productos `placeholder: true`) con datos reales; decidir si products
   pasa a vivir en Supabase en vez de un archivo estático (recomendado en cuanto haya que
   actualizar catálogo sin tocar código).
4. **Backend real para la solicitud de venta**: hoy el submit del formulario es un mock de
   frontend (`js/app.js`, función dentro de `renderCartBody`, el `setTimeout` marcado con el
   comentario "front-end mock only"). Falta:
   - Insertar la solicitud en una tabla (Supabase) o
   - Disparar un correo al equipo de telemarketing (ej. vía Resend + una función serverless), o
   - Ambos.
5. **Filtros secundarios para las otras 7 categorías** (hoy solo "cable" tiene refinamiento por
   atributos) — depende de tener specs reales por categoría primero, para saber qué atributos
   tiene sentido filtrar (ej. GPON: puertos OLT vs ONU; splitters: relación 1x8/1x16; etc.).
6. Evaluar roles/autenticación — explícitamente fuera de alcance por ahora, revisar cuando el
   cliente lo pida.
7. Considerar integrar `assets/nexi-full.jpg` (cuerpo completo de la mascota) en algún estado
   vacío o pantalla de bienvenida más grande, si el diseño lo pide más adelante.

## 11. Decisiones registradas (bitácora corta)

- **2026-07-31** — Se descarta React/Next.js para este proyecto: repos separados del sitio
  principal, sin reuso de código posible, prioridad es simplicidad de despliegue. Se confirma
  vanilla HTML/JS/Tailwind CDN.
- **2026-07-31** — Se investiga proveedor OpticTimes; se descubre que el sitio México real es
  `optictimes.mx` (no `optictimes.la`, que es el catálogo LatAm hermano) y que es un portal B2B
  con login al que EEPSA no tiene cuenta todavía. Taxonomía de 8 categorías reconstruida vía
  fuentes indirectas (catálogo LatAm + indexado de QuimiNet), pendiente de validar con el
  proveedor directamente.
- **2026-07-31** — Se decide no mostrar precios numéricos inventados: el modelo de negocio es
  cotización vía asesor (telemarketing), no precio fijo online, así que mostrar un número
  placeholder sería engañoso. Todas las tarjetas de producto muestran "Cotización con asesor"
  en vez de un `$` con cifra.
- **2026-07-31** — Color de marca corregido: el demo original (`nexi.html`) usaba `#0d9488`
  (teal-600 genérico de Tailwind) por comodidad, pero el color real de EEPSA medido del logo es
  `#38958D`. Se actualizó toda la paleta.
