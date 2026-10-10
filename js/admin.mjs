// Panel de Jorge: reservas del día, stock manual, lotes, campus, métricas, alertas, UGC y versiones.
import { FLAVORS, JAPANESE, formatCLP, zonedNow, whatsappLink } from "./catalog.mjs";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ALL = [...FLAVORS, ...JAPANESE];
const nameOf = (id) => ALL.find((f) => f.id === id)?.name || id;
let token = sessionStorage.getItem("mg-admin") || "";
let data = null;

function toast(msg, bad = false) {
  const t = $("#aToast"); t.textContent = msg; t.className = `a-toast show${bad ? " bad" : ""}`;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = "a-toast"), 2600);
}
async function api(path, opts = {}) {
  const res = await fetch(`/api/admin${path}`, { ...opts, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(opts.headers || {}) } });
  if (res.status === 401) { logout(); throw new Error("Clave incorrecta"); }
  if (res.status === 503) throw new Error("Falta configurar ADMIN_TOKEN en Netlify");
  return res;
}
const act = async (body, ok = "Guardado") => {
  const r = await api("", { method: "POST", body: JSON.stringify(body) });
  const d = await r.json();
  if (!d.ok) { toast((d.errors || ["No se pudo guardar"]).join(" "), true); return null; }
  toast(ok); await load(); return d;
};

// ---------------- Sesión ----------------
function logout() { token = ""; sessionStorage.removeItem("mg-admin"); $("#aApp").hidden = true; $("#aTools").hidden = true; $("#aLogin").hidden = false; }
$("#aLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); token = $("#aToken").value.trim();
  try { await load(); sessionStorage.setItem("mg-admin", token); }
  catch (err) { const el = $("#aLoginErr"); el.hidden = false; el.textContent = err.message; }
});
$("#aLogout").addEventListener("click", logout);
$("#aRefresh").addEventListener("click", () => load());
$("#aDate").addEventListener("change", () => load());

// ---------------- Carga ----------------
async function load() {
  const date = $("#aDate").value || zonedNow().iso;
  const res = await api(`/summary?date=${date}`);
  data = await res.json();
  if (!data.ok) throw new Error("No se pudo cargar");
  $("#aLogin").hidden = true; $("#aApp").hidden = false; $("#aTools").hidden = false;
  $("#aDate").value = data.date;
  $("#aVersion").textContent = `Catálogo v${data.catalogVersion}`;
  renderKpis(); renderCampus(); renderReservations(); renderStock(); renderLots(); renderMetrics(); renderAlerts(); renderUgc(); renderVersions();
}

// ---------------- KPIs ----------------
function renderKpis() {
  const active = data.reservations.filter((r) => r.status !== "cancelada");
  const bags = active.reduce((s, r) => s + r.bags, 0);
  const total = active.reduce((s, r) => s + r.total, 0);
  const delivered = active.filter((r) => r.status === "entregada").length;
  const pendingAlerts = Object.values(data.alerts).flat().filter((s) => !s.notifiedAt).length;
  const tiles = [
    ["Reservas", active.length, `${delivered} entregadas`],
    ["Bolsas comprometidas", bags, "para este día"],
    ["Total del día", formatCLP(total), "sin canceladas"],
    ["Esperando un sabor", pendingAlerts, "alertas sin avisar"],
  ];
  $("#aKpis").innerHTML = tiles.map(([k, v, s]) => `<div class="a-kpi"><span>${k}</span><strong>${v}</strong><small>${s}</small></div>`).join("");
}

// ---------------- Campus ----------------
function renderCampus() {
  const c = data.campus || {};
  $("#aAway").checked = !!c.away; $("#aAwayMsg").value = c.message || ""; $("#aAwayUntil").value = c.until || "";
  const st = $("#aCampusState");
  st.textContent = data.liveCampus.label; st.dataset.tone = data.liveCampus.away ? "critical" : data.liveCampus.open ? "good" : "neutral";
}
$("#aCampusForm").addEventListener("submit", (e) => {
  e.preventDefault();
  act({ action: "campus.toggle", away: $("#aAway").checked, message: $("#aAwayMsg").value || undefined, until: $("#aAwayUntil").value || undefined }, $("#aAway").checked ? "Listo: la web avisa que no estás" : "Listo: estás de vuelta en la web");
});

// ---------------- Reservas ----------------
const STATUSES = ["pendiente", "pagada", "entregada", "no-show", "cancelada"];
function renderReservations() {
  const day = data.slots.find((d) => d.iso === data.date);
  $("#aSlots").innerHTML = day ? day.slots.map((s) => `<span class="a-slot${s.left === 0 ? " full" : ""}"><b>${s.time}</b> ${s.left === 0 ? "lleno" : `${s.left} libres`}</span>`).join("") : `<span class="a-help">Ese día no se reciben reservas (fuera de horario o del rango de 4 días).</span>`;
  const rows = data.reservations;
  $("#aRes tbody").innerHTML = rows.length ? rows.map((r) => `<tr data-status="${r.status}">
    <td><b>${esc(r.time)}</b></td><td><code>${esc(r.code)}</code></td><td>${esc(r.name)}<small>${esc(r.meetingPoint)}${r.notes ? ` · ${esc(r.notes)}` : ""}</small></td>
    <td>${(r.lines || []).map((l) => `${esc(l.name)} ×${l.qty}`).join("<br>")}</td><td>${formatCLP(r.total)}</td><td>${esc(r.payment || "—")}</td><td>${esc(r.origin)}</td>
    <td><select data-code="${esc(r.code)}" aria-label="Estado de ${esc(r.code)}">${STATUSES.map((s) => `<option${s === r.status ? " selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("")
    : `<tr><td colspan="8" class="a-empty">Sin reservas para este día todavía.</td></tr>`;
}
$("#aRes").addEventListener("change", (e) => {
  const sel = e.target.closest("select[data-code]"); if (!sel) return;
  act({ action: "reservation.status", date: data.date, code: sel.dataset.code, status: sel.value }, `Reserva ${sel.dataset.code}: ${sel.value}`);
});
$("#aExport").addEventListener("click", async () => {
  const from = $("#aFrom").value || data.date.slice(0, 8) + "01", to = $("#aTo").value || data.date;
  const res = await api(`/export.csv?from=${from}&to=${to}`);
  const blob = await res.blob();
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `manigante-reservas-${from}_${to}.csv`; a.click();
});

// ---------------- Stock manual ----------------
function renderStock() {
  $("#aStockSrc").textContent = `Fuente: ${data.stock.source}${data.stock.updated ? ` · ${new Date(data.stock.updated).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}` : ""}`;
  $("#aStock").innerHTML = data.stock.catalog.map((f) => {
    const o = data.overrides[f.id];
    const mode = o === true ? "on" : o === false ? "off" : "auto";
    return `<div class="a-stock-row"><span class="a-dot" data-on="${f.available}" aria-hidden="true"></span><span class="a-name">${esc(f.name)}${f.lotsLeft != null ? `<small>${f.lotsLeft} en lotes</small>` : ""}</span>
      <div class="a-seg" role="radiogroup" aria-label="Stock de ${esc(f.name)}">${[["auto", "Auto"], ["on", "Hay"], ["off", "Agotado"]].map(([m, l]) => `<button type="button" role="radio" aria-checked="${mode === m}" data-flavor="${f.id}" data-mode="${m}">${l}</button>`).join("")}</div></div>`;
  }).join("");
  $("#aLotFlavor").innerHTML = ALL.map((f) => `<option value="${f.id}">${esc(f.name)}</option>`).join("");
  if (!$("#aLotDate").value) $("#aLotDate").value = zonedNow().iso;
}
$("#aStock").addEventListener("click", (e) => {
  const b = e.target.closest("[data-mode]"); if (!b) return;
  const available = b.dataset.mode === "auto" ? null : b.dataset.mode === "on";
  act({ action: "stock.override", flavorId: b.dataset.flavor, available }, `${nameOf(b.dataset.flavor)}: ${b.textContent}`);
});

// ---------------- Lotes ----------------
function renderLots() {
  const lots = data.lots.slice(0, 40);
  $("#aLots tbody").innerHTML = lots.length ? lots.map((l) => `<tr><td><code>${esc(l.id)}</code>${l.note ? `<small>${esc(l.note)}</small>` : ""}</td><td>${esc(nameOf(l.flavorId))}</td><td>${esc(l.madeOn)}</td><td><b>${l.bags - l.sold}</b> / ${l.bags}</td>
    <td><div class="a-row tight">${[1, 5].map((n) => `<button type="button" class="a-btn ghost small" data-lot="${l.id}" data-sell="${n}" ${l.bags - l.sold < n ? "disabled" : ""}>−${n}</button>`).join("")}</div></td></tr>`).join("")
    : `<tr><td colspan="5" class="a-empty">Registra tu primer lote para llevar el inventario.</td></tr>`;
}
$("#aLotForm").addEventListener("submit", (e) => {
  e.preventDefault();
  act({ action: "lot.add", flavorId: $("#aLotFlavor").value, bags: +$("#aLotBags").value, madeOn: $("#aLotDate").value, note: $("#aLotNote").value || undefined }, "Lote registrado");
});
$("#aLots").addEventListener("click", (e) => { const b = e.target.closest("[data-sell]"); if (b) act({ action: "lot.sell", lotId: b.dataset.lot, bags: +b.dataset.sell }, "Venta descontada del lote"); });

// ---------------- Métricas (SVG accesible: columnas de una serie + hover) ----------------
function columnChart(title, series, unit) {
  const W = 560, H = 180, padL = 34, padB = 26, padT = 14;
  const max = Math.max(1, ...series.map((d) => d.v));
  const nice = max <= 4 ? 4 : Math.ceil(max / 4) * 4; // múltiplo de 4: ticks enteros (0, mitad, máximo)
  const step = (W - padL - 8) / series.length, bw = Math.min(24, step - 6);
  const y = (v) => H - padB - (v / nice) * (H - padB - padT);
  const ticks = [0, nice / 2, nice];
  const grid = ticks.map((t) => `<line x1="${padL}" x2="${W - 4}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${padL - 6}" y="${y(t) + 4}" class="tick" text-anchor="end">${t}</text>`).join("");
  const bars = series.map((d, i) => {
    const x = padL + i * step + (step - bw) / 2, top = y(d.v), h = H - padB - top;
    const path = h > 0 ? `M${x},${H - padB} V${top + Math.min(4, h)} Q${x},${top} ${x + Math.min(4, bw / 2)},${top} H${x + bw - Math.min(4, bw / 2)} Q${x + bw},${top} ${x + bw},${top + Math.min(4, h)} V${H - padB} Z` : "";
    const label = i === series.length - 1 || d.v === max ? `<text x="${x + bw / 2}" y="${top - 5}" class="val" text-anchor="middle">${d.v}</text>` : "";
    const day = d.date.slice(8, 10);
    return `<g class="col" data-tip="${esc(d.label)}: ${d.v} ${unit}"><rect x="${padL + i * step}" y="${padT}" width="${step}" height="${H - padB - padT}" class="hit"/>${path ? `<path d="${path}" class="mark"/>` : ""}${label}<text x="${x + bw / 2}" y="${H - 8}" class="tick" text-anchor="middle">${i % 2 === 0 || series.length < 10 ? day : ""}</text></g>`;
  }).join("");
  return `<figure class="a-chart"><figcaption>${esc(title)}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}: ${series.map((d) => `${d.label} ${d.v}`).join(", ")}">${grid}${bars}</svg></figure>`;
}
function renderMetrics() {
  const days = [...data.metrics].reverse();
  const fmtDay = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric" });
  const s = (key) => days.map((d) => ({ date: d.date, label: fmtDay(d.date), v: d.counts[key] || 0 }));
  const flavors = {};
  days.forEach((d) => Object.entries(d.flavors || {}).forEach(([k, v]) => { flavors[k] = (flavors[k] || 0) + v; }));
  const top = Object.entries(flavors).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const tmax = Math.max(1, ...top.map((t) => t[1]));
  const topHTML = `<figure class="a-chart"><figcaption>Sabores más agregados o vistos</figcaption>${top.length ? `<ul class="a-bars">${top.map(([id, v]) => {
    const f = ALL.find((x) => x.id === id);
    return `<li data-tip="${esc(nameOf(id))}: ${v}"><span class="a-bar-name"><i style="background:${f?.color || "#999"}"></i>${esc(nameOf(id))}</span><span class="a-bar-track"><span class="a-bar" style="width:${(v / tmax) * 100}%"></span></span><b>${v}</b></li>`;
  }).join("")}</ul>` : `<p class="a-empty">Aún no hay datos: aparecen cuando los clientes usen la tienda.</p>`}</figure>`;
  $("#aCharts").innerHTML = columnChart("Reservas creadas por día", s("reservation_created"), "reservas") + columnChart("Mensajes al asistente IA por día", s("agent_message"), "mensajes") + columnChart("Visitas a la tienda por día", s("page_view"), "visitas") + topHTML;
  const keys = [["page_view", "Visitas"], ["add_to_cart", "Agregados"], ["reservation_created", "Reservas"], ["order_whatsapp", "Pedidos WA"], ["agent_message", "Msj. IA"], ["alert_subscribe", "Avísame"]];
  $("#aMetricsTable").innerHTML = `<table class="a-table"><thead><tr><th>Día</th>${keys.map(([, l]) => `<th>${l}</th>`).join("")}</tr></thead><tbody>${days.map((d) => `<tr><td>${fmtDay(d.date)}</td>${keys.map(([k]) => `<td>${d.counts[k] || 0}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  // Web Vitals de hoy con estado (ícono + etiqueta, nunca solo color)
  const today = data.metrics[0]?.vitals || {};
  const TH = { LCP: [2500, 4000, "ms"], INP: [200, 500, "ms"], CLS: [0.1, 0.25, ""], FCP: [1800, 3000, "ms"], TTFB: [800, 1800, "ms"] };
  $("#aVitals").innerHTML = Object.entries(TH).map(([k, [good, poor, u]]) => {
    const v = today[k]; if (!v?.n) return `<div class="a-vital" data-tone="neutral"><span>${k}</span><strong>—</strong><small>sin datos</small></div>`;
    const avg = v.sum / v.n, tone = avg <= good ? "good" : avg <= poor ? "warning" : "critical";
    const icon = { good: "✓", warning: "!", critical: "✕" }[tone], label = { good: "Bien", warning: "Mejorable", critical: "Lento" }[tone];
    return `<div class="a-vital" data-tone="${tone}"><span>${k}</span><strong>${u === "ms" ? Math.round(avg) + " ms" : avg.toFixed(3)}</strong><small><b aria-hidden="true">${icon}</b> ${label} · ${Math.round((v.good / v.n) * 100)}% bien · ${v.n} visitas</small></div>`;
  }).join("");
}
$("#aTableToggle").addEventListener("click", (e) => {
  const on = e.target.getAttribute("aria-pressed") !== "true";
  e.target.setAttribute("aria-pressed", on); e.target.textContent = on ? "Ver gráficos" : "Ver como tabla";
  $("#aMetricsTable").hidden = !on; $("#aCharts").hidden = on;
});
// Tooltip compartido (hover + foco)
const tip = $("#aTip");
document.addEventListener("pointermove", (e) => {
  const t = e.target.closest?.("[data-tip]");
  if (!t) { tip.hidden = true; return; }
  tip.textContent = t.dataset.tip; tip.hidden = false;
  tip.style.left = `${Math.min(innerWidth - tip.offsetWidth - 8, e.clientX + 12)}px`; tip.style.top = `${e.clientY - 36}px`;
});

// ---------------- Alertas ----------------
function renderAlerts() {
  const entries = Object.entries(data.alerts).map(([id, subs]) => [id, subs.filter((s) => !s.notifiedAt)]).filter(([, s]) => s.length);
  $("#aAlerts").innerHTML = entries.length ? entries.map(([id, subs]) => {
    const f = data.stock.catalog.find((x) => x.id === id);
    return `<div class="a-alert"><div class="a-card-head"><strong>${esc(nameOf(id))}</strong><span class="a-chip" data-tone="${f?.available ? "good" : "neutral"}">${f?.available ? "¡Ya hay!" : "Agotado"} · ${subs.length} esperando</span></div>
      <ul>${subs.map((s) => {
        const msg = `Hola${s.name ? " " + s.name : ""}, volvió ${nameOf(id)} a MANI-GANTE. ¿Te guardamos una bolsa? · La familia MANI-GANTE`;
        const link = s.contact.includes("@") ? `mailto:${s.contact}?subject=${encodeURIComponent("Volvió " + nameOf(id))}&body=${encodeURIComponent(msg)}` : `https://wa.me/${s.contact.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
        return `<li>${esc(s.name || "Cliente")} · <a href="${link}" target="_blank" rel="noopener">${esc(s.contact)}</a></li>`;
      }).join("")}</ul>
      <button type="button" class="a-btn ghost small" data-notified="${id}">Marcar como avisados</button></div>`;
  }).join("") : `<p class="a-empty">Nadie esperando un sabor por ahora.</p>`;
}
$("#aAlerts").addEventListener("click", (e) => { const b = e.target.closest("[data-notified]"); if (b) act({ action: "alerts.markNotified", flavorId: b.dataset.notified }, "Marcados como avisados"); });

// ---------------- UGC ----------------
function renderUgc() {
  $("#aUgc").innerHTML = data.ugc.length ? data.ugc.map((u) => `<div class="a-ugc-item"><p>“${esc(u.quote)}”</p><small>— ${esc(u.author)} · ${esc(u.source)}</small><button type="button" class="a-btn ghost small" data-ugc="${u.id}">Quitar</button></div>`).join("") : `<p class="a-empty">Publica aquí opiniones reales (con permiso). Aparecen en "La familia habla" de la web.</p>`;
}
$("#aUgcForm").addEventListener("submit", (e) => {
  e.preventDefault();
  act({ action: "ugc.add", quote: $("#aUgcQuote").value, author: $("#aUgcAuthor").value, source: $("#aUgcSource").value, url: $("#aUgcUrl").value || undefined }, "Publicada en la web");
  e.target.reset();
});
$("#aUgc").addEventListener("click", (e) => { const b = e.target.closest("[data-ugc]"); if (b) act({ action: "ugc.remove", id: b.dataset.ugc }, "Quitada"); });

// ---------------- Versiones ----------------
function renderVersions() {
  $("#aChangelog").innerHTML = data.catalogChangelog.map((c) => `<li><b>v${esc(c.version)}</b> · ${esc(c.date)}<br>${esc(c.note)}</li>`).join("");
  $("#aVersions").innerHTML = data.versions.length ? data.versions.map((v) => `<li><b>${new Date(v.at).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</b><br>${esc(v.change)}</li>`).join("") : `<li class="a-empty">Sin cambios todavía.</li>`;
}

if (token) load().catch(() => logout());
