// ---------- Formatters ----------
const nf = new Intl.NumberFormat("es-MX");

// ---------- Small SVG helpers ----------
const checkSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const plusSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const closeSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
const quoteSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const cartHeaderSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38958d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>';
const checkCircleSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38958d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>';
const emptyCartSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>';
const removeSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

function avatarHtml() {
  return (
    '<div class="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-2 ring-teal-500/30">' +
    '<img src="assets/nexi-avatar.jpg" alt="Nexi" class="h-full w-full object-cover" />' +
    "</div>"
  );
}

function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

// ---------- State ----------
let selectedCategory = null;
let selectedCable = "monomodo";
let selectedConnector = "LC";
let selectedLength = 500;
const added = new Set();

// ---------- Elements ----------
const scrollEl = document.getElementById("scroll");
const conversationEl = document.getElementById("conversation");
const categoryCard = document.getElementById("category-card");
const categoryGridEl = document.getElementById("category-grid");
const cartCountEl = document.getElementById("cart-count");

function scrollToBottom() {
  requestAnimationFrame(() => {
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
  });
}

// ---------- Category grid (primary filter) ----------
function renderCategoryGrid() {
  categoryGridEl.innerHTML = CATEGORIES.map(
    (c) =>
      '<button type="button" data-slug="' +
      c.slug +
      '" class="group flex flex-col items-start gap-2 rounded-xl border border-line bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:bg-teal-50 hover:shadow-md cursor-pointer">' +
      '<span class="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">' +
      iconSvg(c.icon, 18) +
      "</span>" +
      '<span class="font-heading text-sm font-semibold leading-tight text-ink">' +
      c.name +
      "</span>" +
      '<span class="text-xs text-ink-muted">' +
      c.hint +
      "</span></button>"
  ).join("");
}

categoryGridEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-slug]");
  if (!btn) return;
  selectCategory(btn.dataset.slug);
});

function selectCategory(slug) {
  selectedCategory = slug;
  const cat = categoryBySlug(slug);
  categoryCard.classList.add("hidden");

  appendUserBubble("Busco productos de <span class=\"font-semibold\">" + cat.name + "</span>.");

  if (slug === "cable") {
    appendCableQuestion();
  } else {
    const typing = appendTyping();
    setTimeout(() => {
      typing.remove();
      renderResults(filterByCategory(slug), cat);
    }, 900);
  }
}

// ---------- Chat bubble helpers ----------
function appendUserBubble(html) {
  const el = document.createElement("div");
  el.className = "nexi-msg-in flex justify-end";
  el.innerHTML =
    '<div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-teal-500 to-teal-600 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">' +
    html +
    "</div>";
  conversationEl.appendChild(el);
  scrollToBottom();
  return el;
}

function appendNexiBubble(html) {
  const el = document.createElement("div");
  el.className = "nexi-msg-in flex items-start gap-3";
  el.innerHTML =
    avatarHtml() +
    '<div class="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm">' +
    html +
    "</div>";
  conversationEl.appendChild(el);
  scrollToBottom();
  return el;
}

function appendTyping() {
  const el = document.createElement("div");
  el.className = "nexi-msg-in flex items-start gap-3";
  el.innerHTML =
    avatarHtml() +
    '<div class="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 shadow-sm">' +
    '<span class="nexi-dot size-2 rounded-full bg-ink-muted/60"></span>' +
    '<span class="nexi-dot size-2 rounded-full bg-ink-muted/60" style="animation-delay:.15s"></span>' +
    '<span class="nexi-dot size-2 rounded-full bg-ink-muted/60" style="animation-delay:.3s"></span>' +
    "</div>";
  conversationEl.appendChild(el);
  scrollToBottom();
  return el;
}

// ---------- Cable sub-filters (only for "cable" category) ----------
function appendCableQuestion() {
  appendNexiBubble(
    "Perfecto, cable de fibra óptica. Ajusta los controles para afinar la búsqueda:"
  );

  const wrap = document.createElement("div");
  wrap.className = "nexi-msg-in ml-[52px] max-w-[88%] rounded-2xl glass border border-white/60 p-5 shadow-sm";
  wrap.innerHTML =
    '<div class="flex flex-col gap-6">' +
    '<div class="flex flex-col gap-2">' +
    '<label class="flex items-center gap-2 text-sm font-medium text-ink">' +
    iconSvg("cable", 16) +
    "Tipo de cable</label>" +
    '<div class="relative">' +
    '<button type="button" id="cable-trigger" aria-haspopup="listbox" aria-expanded="false" class="flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left text-sm transition-colors hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40 cursor-pointer">' +
    '<span class="flex flex-col"><span id="cable-label" class="font-medium text-ink"></span><span id="cable-hint" class="text-xs text-ink-muted"></span></span>' +
    '<svg id="cable-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
    "</button>" +
    '<ul id="cable-menu" role="listbox" class="absolute z-20 mt-2 hidden w-full overflow-hidden rounded-xl border border-line bg-white shadow-lg"></ul>' +
    "</div></div>" +
    '<div class="flex flex-col gap-3">' +
    '<label for="length" class="flex items-center justify-between text-sm font-medium text-ink">' +
    '<span class="flex items-center gap-2">' +
    iconSvg("herramientas", 16) +
    "Longitud requerida</span>" +
    '<span id="length-badge" class="rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700"></span>' +
    "</label>" +
    '<input id="length" type="range" min="' + LENGTH_MIN + '" max="' + LENGTH_MAX + '" step="50" value="' + selectedLength + '" class="nexi-slider w-full" />' +
    '<div class="flex justify-between text-xs text-ink-muted"><span>' + LENGTH_MIN + " m</span><span>" + nf.format(LENGTH_MAX) + " m</span></div>" +
    "</div>" +
    '<div class="flex flex-col gap-2">' +
    '<label class="flex items-center gap-2 text-sm font-medium text-ink">' +
    iconSvg("conectores", 16) +
    "Tipo de conector</label>" +
    '<div id="connectors" class="relative grid grid-cols-3 gap-2" role="group" aria-label="Tipo de conector"></div>' +
    "</div>" +
    '<button type="button" id="submit-btn" class="mt-1 w-full cursor-pointer rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-teal-500/40">' +
    "Ver recomendaciones de Nexi</button>" +
    "</div>";
  conversationEl.appendChild(wrap);
  scrollToBottom();

  wireCableControls(wrap);
}

function wireCableControls(root) {
  const cableTrigger = root.querySelector("#cable-trigger");
  const cableMenu = root.querySelector("#cable-menu");
  const cableLabelEl = root.querySelector("#cable-label");
  const cableHintEl = root.querySelector("#cable-hint");
  const cableChevron = root.querySelector("#cable-chevron");
  const lengthInput = root.querySelector("#length");
  const lengthBadge = root.querySelector("#length-badge");
  const connectorsEl = root.querySelector("#connectors");

  function renderCableMenu() {
    cableMenu.innerHTML = cableTypes
      .map(
        (c) =>
          '<li><button type="button" role="option" data-value="' +
          c.value +
          '" class="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-teal-50">' +
          '<span class="flex flex-col"><span class="font-medium text-ink">' +
          c.label +
          '</span><span class="text-xs text-ink-muted">' +
          c.hint +
          "</span></span>" +
          (c.value === selectedCable ? '<span class="text-teal-600">' + checkSvg + "</span>" : "") +
          "</button></li>"
      )
      .join("");
  }

  function toggleMenu(open) {
    const isOpen = open ?? cableMenu.classList.contains("hidden");
    cableMenu.classList.toggle("hidden", !isOpen);
    cableTrigger.setAttribute("aria-expanded", String(isOpen));
    cableChevron.classList.toggle("rotate-180", isOpen);
  }

  function syncCableLabel() {
    const c = cableTypes.find((x) => x.value === selectedCable);
    cableLabelEl.textContent = c.label;
    cableHintEl.textContent = c.hint;
  }

  cableTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  cableMenu.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    selectedCable = btn.dataset.value;
    syncCableLabel();
    renderCableMenu();
    toggleMenu(false);
  });
  document.addEventListener("click", () => toggleMenu(false));

  function paintSlider() {
    const pct = ((selectedLength - LENGTH_MIN) / (LENGTH_MAX - LENGTH_MIN)) * 100;
    lengthInput.style.background = "linear-gradient(to right, #38958d " + pct + "%, #eef7f6 " + pct + "%)";
  }
  lengthInput.addEventListener("input", () => {
    selectedLength = Number(lengthInput.value);
    lengthBadge.textContent = nf.format(selectedLength) + " m";
    paintSlider();
  });

  function renderConnectors() {
    connectorsEl.innerHTML =
      '<span id="connector-pill" class="nexi-pill absolute inset-y-0 rounded-xl bg-teal-500 shadow-sm"></span>' +
      connectors
        .map((c) => {
          const active = c.value === selectedConnector;
          return (
            '<button type="button" data-value="' +
            c.value +
            '" aria-pressed="' +
            active +
            '" class="relative z-10 cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ' +
            (active ? "text-white" : "text-ink hover:text-teal-700") +
            '">' +
            c.label +
            "</button>"
          );
        })
        .join("");
    positionConnectorPill();
  }

  function positionConnectorPill() {
    const activeIdx = connectors.findIndex((c) => c.value === selectedConnector);
    const buttons = connectorsEl.querySelectorAll("button[data-value]");
    const btn = buttons[activeIdx];
    const pill = connectorsEl.querySelector("#connector-pill");
    if (!btn || !pill) return;
    pill.style.width = buttons[0].offsetWidth + "px";
    pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }
  connectorsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    selectedConnector = btn.dataset.value;
    renderConnectors();
  });

  root.querySelector("#submit-btn").addEventListener("click", () => {
    appendUserBubble(
      "Necesito cable <span class=\"font-semibold\">" +
        cableTypes.find((c) => c.value === selectedCable).label +
        "</span>, unos <span class=\"font-semibold\">" +
        nf.format(selectedLength) +
        " m</span> y conector <span class=\"font-semibold\">" +
        connectors.find((c) => c.value === selectedConnector).label +
        "</span>."
    );
    const typing = appendTyping();
    setTimeout(() => {
      typing.remove();
      renderResults(
        filterCableProducts(selectedCable, selectedConnector, selectedLength),
        categoryBySlug("cable")
      );
    }, 1000);
  });

  syncCableLabel();
  renderCableMenu();
  renderConnectors();
  paintSlider();
}

// ---------- Results ----------
function renderResults(results, cat) {
  appendNexiBubble(
    "Estos equipos <span class=\"font-semibold\">OpticTimes</span> coinciden con lo que buscas. Añade los que necesites a tu solicitud:"
  );

  const wrap = document.createElement("div");
  wrap.className = "nexi-msg-in ml-[52px]";
  wrap.innerHTML =
    '<div class="flex flex-col gap-3">' +
    '<div class="flex items-center justify-between">' +
    '<p class="text-xs font-medium text-ink-muted">' +
    results.length +
    " equipos en " + cat.name + "</p>" +
    '<div class="flex gap-1.5">' +
    '<button type="button" data-dir="-1" aria-label="Anterior" class="carousel-nav flex size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-teal-500/50 hover:text-teal-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>' +
    '<button type="button" data-dir="1" aria-label="Siguiente" class="carousel-nav flex size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-teal-500/50 hover:text-teal-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>' +
    "</div></div>" +
    '<div class="nexi-scroll track flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">' +
    results.map((p) => cardHtml(p, cat)).join("") +
    "</div></div>";
  conversationEl.appendChild(wrap);

  const restartWrap = document.createElement("div");
  restartWrap.className = "nexi-msg-in ml-[52px]";
  restartWrap.innerHTML =
    '<button type="button" id="restart-btn" class="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-teal-500/50 hover:text-teal-700">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>' +
    "Ajustar filtros de nuevo</button>";
  conversationEl.appendChild(restartWrap);

  const track = wrap.querySelector(".track");
  wrap.querySelectorAll(".carousel-nav").forEach((btn) => {
    btn.addEventListener("click", () => {
      track.scrollBy({ left: Number(btn.dataset.dir) * 300, behavior: "smooth" });
    });
  });
  wrap.querySelectorAll("button[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => setAdded(btn.dataset.add, !added.has(btn.dataset.add)));
  });
  restartWrap.querySelector("#restart-btn").addEventListener("click", restart);

  scrollToBottom();
}

function cardHtml(p, cat) {
  const isAdded = added.has(p.id);
  return (
    '<article class="flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg">' +
    '<div class="relative flex aspect-square w-full items-center justify-center bg-gradient-to-br from-teal-50 to-white">' +
    '<span class="text-teal-500/70">' + iconSvg(cat.icon, 44) + "</span>" +
    '<span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted backdrop-blur">' +
    cat.name +
    "</span></div>" +
    '<div class="flex flex-1 flex-col gap-3 p-4">' +
    '<div class="flex flex-col gap-1">' +
    '<h3 class="font-heading text-sm font-semibold leading-tight text-ink">' +
    p.name +
    "</h3>" +
    '<span class="inline-flex w-fit items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">' +
    quoteSvg +
    "Cotización con asesor</span></div>" +
    '<ul class="flex flex-col gap-1">' +
    p.highlights
      .map(
        (h) =>
          '<li class="flex items-start gap-1.5 text-xs text-ink-muted"><span class="mt-0.5 shrink-0 text-teal-600">' +
          checkSvg +
          "</span><span>" +
          h +
          "</span></li>"
      )
      .join("") +
    "</ul>" +
    addButtonHtml(p, isAdded) +
    "</div></article>"
  );
}

function addButtonHtml(p, isAdded) {
  return (
    '<button type="button" data-add="' +
    p.id +
    '" aria-pressed="' +
    isAdded +
    '" class="mt-auto flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ' +
    (isAdded ? "bg-teal-50 text-teal-700" : "bg-gradient-to-br from-teal-500 to-teal-600 text-white hover:brightness-105") +
    '">' +
    (isAdded ? checkSvg + "Añadido" : plusSvg + "Añadir a la solicitud") +
    "</button>"
  );
}

// ---------- Cart (shared between product cards and the order sheet) ----------
function setAdded(id, value) {
  if (value) added.add(id);
  else added.delete(id);
  const isAdded = added.has(id);

  document.querySelectorAll('button[data-add="' + id + '"]').forEach((btn) => {
    btn.setAttribute("aria-pressed", String(isAdded));
    btn.className =
      "mt-auto flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors " +
      (isAdded ? "bg-teal-50 text-teal-700" : "bg-gradient-to-br from-teal-500 to-teal-600 text-white hover:brightness-105");
    btn.innerHTML = isAdded ? checkSvg + "Añadido" : plusSvg + "Añadir a la solicitud";
  });

  cartCountEl.textContent = String(added.size);
  if (cartOpen) renderCartBody();
}

function restart() {
  conversationEl.innerHTML = "";
  categoryCard.classList.remove("hidden");
  selectedCategory = null;
  scrollToBottom();
}

// ---------- Cart sheet ----------
const cartTrigger = document.getElementById("cart-trigger");
const cartOverlay = document.getElementById("cart-overlay");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartBody = document.getElementById("cart-body");
let cartOpen = false;
let cartSubmitted = false;

function openCart() {
  cartOpen = true;
  cartSubmitted = false;
  cartOverlay.classList.remove("opacity-0", "pointer-events-none");
  cartOverlay.classList.add("opacity-100");
  cartPanel.classList.remove("nexi-sheet-hidden");
  cartTrigger.setAttribute("aria-expanded", "true");
  renderCartBody();
}
function closeCart() {
  cartOpen = false;
  cartOverlay.classList.add("opacity-0", "pointer-events-none");
  cartOverlay.classList.remove("opacity-100");
  cartPanel.classList.add("nexi-sheet-hidden");
  cartTrigger.setAttribute("aria-expanded", "false");
}
cartTrigger.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function renderCartBody() {
  if (cartSubmitted) {
    cartBody.innerHTML =
      '<div class="flex flex-col items-center gap-3 py-6 text-center">' +
      checkCircleSvg +
      '<h3 class="font-heading text-base font-semibold text-ink" id="cart-success-name">¡Listo!</h3>' +
      '<p class="max-w-xs text-sm leading-relaxed text-ink-muted">Un asesor de EEPSA revisará tu solicitud y te contactará por llamada o WhatsApp en menos de 24 horas hábiles para cotizar y coordinar tu compra.</p>' +
      '<button type="button" id="cart-success-close" class="mt-2 cursor-pointer rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-teal-500/50">Cerrar</button>' +
      "</div>";
    document.getElementById("cart-success-close").addEventListener("click", closeCart);
    return;
  }

  if (added.size === 0) {
    cartBody.innerHTML =
      '<div class="flex flex-col items-center gap-2 py-8 text-center">' +
      emptyCartSvg +
      '<p class="text-sm font-medium text-ink">Aún no agregas productos</p>' +
      '<p class="max-w-xs text-xs text-ink-muted">Explora una categoría en el chat y añade los equipos que te interesen.</p>' +
      "</div>";
    return;
  }

  const items = Array.from(added)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const itemsHtml = items
    .map((p) => {
      const cat = categoryBySlug(p.category);
      return (
        '<div class="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2.5">' +
        '<div class="flex min-w-0 items-center gap-2.5">' +
        '<span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">' +
        iconSvg(cat.icon, 16) +
        "</span>" +
        '<div class="flex min-w-0 flex-col">' +
        '<span class="truncate text-sm font-medium text-ink">' + p.name + "</span>" +
        '<span class="text-xs text-ink-muted">' + cat.name + "</span>" +
        "</div></div>" +
        '<button type="button" data-remove="' + p.id + '" aria-label="Quitar ' + p.name + '" class="shrink-0 cursor-pointer rounded-full p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500">' +
        removeSvg +
        "</button></div>"
      );
    })
    .join("");

  cartBody.innerHTML =
    '<div class="flex flex-col gap-2.5">' + itemsHtml + "</div>" +
    '<p class="mt-4 rounded-xl bg-teal-50 px-3.5 py-3 text-xs leading-relaxed text-teal-800">' +
    "Esta solicitud <strong>no genera ningún cargo ni pago en línea</strong>. Un asesor de EEPSA la revisará y te contactará para cotizar y coordinar tu compra." +
    "</p>" +
    '<form id="order-form" class="mt-4 flex flex-col gap-3">' +
    formFieldHtml("order-name", "Nombre completo *", "text", true) +
    formFieldHtml("order-phone", "Teléfono / WhatsApp *", "tel", true) +
    formFieldHtml("order-email", "Correo (opcional)", "email", false) +
    '<div class="flex flex-col gap-1.5">' +
    '<label for="order-comment" class="text-sm font-medium text-ink">Comentario (opcional)</label>' +
    '<textarea id="order-comment" rows="2" class="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-teal-500/40" placeholder="Ej. lo necesito para un proyecto en..."></textarea>' +
    "</div>" +
    '<button type="submit" id="order-submit" class="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-teal-500/40">' +
    "Enviar solicitud a ventas</button>" +
    "</form>";

  cartBody.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => setAdded(btn.dataset.remove, false));
  });

  document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("order-name");
    const phoneInput = document.getElementById("order-phone");
    if (!nameInput.value.trim() || !phoneInput.value.trim()) {
      [nameInput, phoneInput].forEach((el) => {
        if (!el.value.trim()) el.classList.add("ring-2", "ring-red-400");
      });
      return;
    }
    const submitBtn = document.getElementById("order-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    // NOTE: front-end mock only. Real submission (insert lead + notify sales) is a
    // pending backend integration — see PROJECT.md "Próximos pasos".
    setTimeout(() => {
      cartSubmitted = true;
      added.clear();
      cartCountEl.textContent = "0";
      document.querySelectorAll("button[data-add]").forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
        btn.className =
          "mt-auto flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors bg-gradient-to-br from-teal-500 to-teal-600 text-white hover:brightness-105";
        btn.innerHTML = plusSvg + "Añadir a la solicitud";
      });
      renderCartBody();
    }, 900);
  });
}

function formFieldHtml(id, label, type, required) {
  return (
    '<div class="flex flex-col gap-1.5">' +
    '<label for="' + id + '" class="text-sm font-medium text-ink">' + label + "</label>" +
    '<input id="' + id + '" type="' + type + '"' + (required ? " required" : "") +
    ' class="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />' +
    "</div>"
  );
}

// ---------- Init ----------
renderCategoryGrid();
