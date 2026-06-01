const fields = {
  date: ["Дата створення", "Дата взяття в роботу", "Дата видачі"],
  designer: "Дизайнер",
  buyer: "Баєр",
  status: "Статус таски",
  type: "Тип креатива:",
  priority: "Пріорітет",
  quantity: "К-сть",
  geo: "GEO",
  task: "Таска",
  creative: "Креатив",
  size: "Розмір",
  language: "Мова",
  text: "Text",
  post: "Post",
  id: "Id",
};

const colors = ["#5b6af0", "#a78bfa", "#34d399", "#fb923c", "#f43f5e", "#fbbf24", "#818cf8", "#94a3b8"];
let allRows = [];
let filteredRows = [];
let rangeMode = "all";
let selectedDesigner = "";

const els = {
  fileInput: document.querySelector("#fileInput"),
  notice: document.querySelector("#notice"),
  reportTitle: document.querySelector("#reportTitle"),
  dateBadge: document.querySelector("#dateBadge"),
  rangeMode: document.querySelector("#rangeMode"),
  dateField: document.querySelector("#dateField"),
  monthWrap: document.querySelector("#monthWrap"),
  monthInput: document.querySelector("#monthInput"),
  startWrap: document.querySelector("#startWrap"),
  startDate: document.querySelector("#startDate"),
  endWrap: document.querySelector("#endWrap"),
  endDate: document.querySelector("#endDate"),
  designerFilter: document.querySelector("#designerFilter"),
  buyerFilter: document.querySelector("#buyerFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  searchInput: document.querySelector("#searchInput"),
  exportFiltered: document.querySelector("#exportFiltered"),
};

window.addEventListener("DOMContentLoaded", async () => {
  fields.date.forEach((field) => addOption(els.dateField, field, field));
  els.dateField.value = "Дата створення";
  bindEvents();

  try {
    const response = await fetch("assets/sample-notion-export.csv");
    const csv = await response.text();
    loadCsv(csv, "Демо-дані з поточного Notion export");
  } catch {
    setNotice("Завантажте CSV-файл експорту Notion, щоб побачити аналітику.");
  }
});

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.addEventListener("click", (event) => {
    const drill = event.target.closest("[data-designer-drill]");
    if (!drill) return;
    selectedDesigner = decodeURIComponent(drill.dataset.designerDrill);
    renderTeam();
  });

  els.fileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    loadCsv(await file.text(), file.name);
  });

  els.rangeMode.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;
    rangeMode = event.target.dataset.mode;
    [...els.rangeMode.querySelectorAll("button")].forEach((button) => {
      button.classList.toggle("active", button === event.target);
    });
    els.monthWrap.hidden = rangeMode !== "month";
    els.startWrap.hidden = rangeMode !== "custom";
    els.endWrap.hidden = rangeMode !== "custom";
    update();
  });

  [
    els.dateField,
    els.monthInput,
    els.startDate,
    els.endDate,
    els.designerFilter,
    els.buyerFilter,
    els.statusFilter,
    els.typeFilter,
    els.searchInput,
  ].forEach((input) => input.addEventListener("input", update));

  els.exportFiltered.addEventListener("click", exportFilteredCsv);
}

function switchTab(name) {
  document.querySelectorAll(".section").forEach((section) => section.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  document.querySelector(`#tab-${name}`).classList.add("active");
}

function loadCsv(csv, sourceName) {
  allRows = parseCsv(csv).map(normalizeRow).filter((row) => row[fields.id] || row[fields.task]);
  populateFilters();
  setDefaultDates();
  setNotice(`${sourceName}: завантажено ${allRows.length} задач.`);
  update();
}

function update() {
  filteredRows = allRows.filter(matchesFilters);
  updateHeader();
  renderOverview();
  renderTeam();
  renderGeo();
  renderInsights();
  renderTable();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const next = cleanText[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);

  const header = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] || ""])));
}

function normalizeRow(row) {
  const next = { ...row };
  next.__quantity = Number.parseFloat(String(row[fields.quantity] || "0").replace(",", ".")) || 0;
  next.__search = [
    row[fields.id],
    row[fields.task],
    row[fields.text],
    row[fields.post],
    row[fields.geo],
    row[fields.type],
    row[fields.creative],
    row[fields.language],
  ]
    .join(" ")
    .toLowerCase();
  return next;
}

function populateFilters() {
  fillSelect(els.designerFilter, uniqueValues(fields.designer));
  fillSelect(els.buyerFilter, uniqueValues(fields.buyer));
  fillSelect(els.statusFilter, uniqueValues(fields.status));
  fillSelect(els.typeFilter, uniqueValues(fields.type));
}

function fillSelect(select, values) {
  select.innerHTML = "";
  addOption(select, "Усі", "");
  values.forEach((value) => addOption(select, value, value));
}

function addOption(select, label, value) {
  const option = document.createElement("option");
  option.textContent = label;
  option.value = value;
  select.append(option);
}

function uniqueValues(field) {
  return [...new Set(allRows.map((row) => clean(row[field])).filter(Boolean))].sort((a, b) => a.localeCompare(b, "uk"));
}

function setDefaultDates() {
  const dates = allRows.map((row) => parseNotionDate(row[els.dateField.value])).filter(Boolean).sort((a, b) => a - b);
  if (!dates.length) return;
  els.monthInput.value = toMonthInput(dates.at(-1));
  els.startDate.value = toDateInput(dates[0]);
  els.endDate.value = toDateInput(dates.at(-1));
}

function matchesFilters(row) {
  const selectedDate = parseNotionDate(row[els.dateField.value]);
  if (rangeMode === "month") {
    if (!selectedDate || toMonthInput(selectedDate) !== els.monthInput.value) return false;
  }
  if (rangeMode === "custom") {
    if (!selectedDate) return false;
    if (els.startDate.value && selectedDate < parseInputDate(els.startDate.value)) return false;
    if (els.endDate.value && selectedDate > endOfDay(parseInputDate(els.endDate.value))) return false;
  }
  if (els.designerFilter.value && clean(row[fields.designer]) !== els.designerFilter.value) return false;
  if (els.buyerFilter.value && clean(row[fields.buyer]) !== els.buyerFilter.value) return false;
  if (els.statusFilter.value && clean(row[fields.status]) !== els.statusFilter.value) return false;
  if (els.typeFilter.value && clean(row[fields.type]) !== els.typeFilter.value) return false;

  const needle = els.searchInput.value.trim().toLowerCase();
  return !needle || row.__search.includes(needle);
}

function updateHeader() {
  const dates = filteredRows.map((row) => parseNotionDate(row[els.dateField.value])).filter(Boolean).sort((a, b) => a - b);
  if (!dates.length) {
    els.dateBadge.textContent = "-";
    els.reportTitle.textContent = "MounthAnalytic";
    return;
  }
  const start = dates[0];
  const end = dates.at(-1);
  els.dateBadge.textContent = `${formatShortDate(start)} - ${formatShortDate(end)}`;
  els.reportTitle.textContent = monthTitle(start, end);
}

function renderOverview() {
  const tasks = filteredRows.length;
  const creatives = sumQuantity(filteredRows);
  const done = filteredRows.filter((row) => isDone(row[fields.status])).length;
  const cycleValues = filteredRows
    .map((row) => daysBetween(parseNotionDate(row["Дата взяття в роботу"]), parseNotionDate(row["Дата видачі"])))
    .filter((value) => Number.isFinite(value) && value >= 0);
  const avgCycle = average(cycleValues);
  const topBuyer = countBy(filteredRows, fields.buyer, true)[0];
  const ids = filteredRows.map((row) => clean(row[fields.id])).filter(Boolean);

  document.querySelector("#overviewKpis").innerHTML = [
    kpi("blue", "Всього тасок", tasks, ids.length ? `${ids[0]} -> ${ids.at(-1)}` : "У вибірці"),
    kpi("green", "Виконано", done, tasks ? `${((done / tasks) * 100).toFixed(1)}% від усіх` : "0% від усіх"),
    kpi("blue", "Всього креативів", formatNumber(creatives), `~${tasks ? (creatives / tasks).toFixed(1) : 0} на таску`),
    kpi("orange", "Середня видача", Number.isFinite(avgCycle) ? avgCycle.toFixed(1) : "-", `дні · ${cycleValues.length} тасок з датою`),
    kpi("purple", "Топ баєр", topBuyer?.name || "-", topBuyer ? `${formatNumber(topBuyer.value)} креативів` : "Немає даних", true),
  ].join("");

  const daily = countByDate(filteredRows, els.dateField.value);
  const peakDays = [...daily].sort((a, b) => b.value - a.value).slice(0, 9);
  renderBars("#peakDaysChart", peakDays, { mono: true, label: (item) => shortDayLabel(item.name), value: (item) => item.value });
  const peak = peakDays[0];
  document.querySelector("#peakDaysNote").innerHTML = peak
    ? `Пік: <span style="color:#f43f5e;font-weight:600">${shortDayLabel(peak.name)} - ${peak.value} тасок</span> за один день`
    : "Немає дат у вибірці";

  renderBars("#creativeChart", countBy(filteredRows, fields.creative, false).slice(0, 6));
  renderBars("#typeChart", countBy(filteredRows, fields.type, false).slice(0, 5));
  renderTimeline(daily);
  renderBars("#priorityChart", countBy(filteredRows, fields.priority, false).slice(0, 6), { tone: priorityColor });
  renderBars("#statusChart", countBy(filteredRows, fields.status, false).slice(0, 6), { tone: statusColor });
}

function renderTeam() {
  const designers = enrichPeople(countBy(filteredRows, fields.designer, true), countBy(filteredRows, fields.designer, false));
  if (!designers.some((item) => item.name === selectedDesigner)) selectedDesigner = designers[0]?.name || "";
  document.querySelector("#designerCards").innerHTML = designers.slice(0, 8).map(designerCard).join("");
  renderBars("#designerCreativeChart", designers.slice(0, 10), {
    mono: true,
    value: (item) => item.value,
    drillDesigner: true,
  });
  renderBars("#designerTaskChart", [...designers].sort((a, b) => b.tasks - a.tasks).slice(0, 10), {
    mono: true,
    value: (item) => item.tasks,
    maxValue: (items) => Math.max(1, ...items.map((item) => item.tasks)),
    drillDesigner: true,
  });
  renderDesignerDetail(selectedDesigner);
  const buyers = enrichPeople(countBy(filteredRows, fields.buyer, true), countBy(filteredRows, fields.buyer, false));
  renderBars("#buyerChart", buyers.slice(0, 14), {
    mono: true,
    value: (item) => `${formatNumber(item.value)} крео · ${item.tasks} тасок`,
  });
}

function renderGeo() {
  const geoTasks = countBy(filteredRows, fields.geo, false);
  const geoCreatives = countBy(filteredRows, fields.geo, true);
  const languages = countBy(filteredRows, fields.language, false);
  const arabicRows = filteredRows.filter((row) => /араб|arab|sy|iq|ye|jo|lb|mr/i.test([row[fields.language], row[fields.geo]].join(" "))).length;

  document.querySelector("#geoKpis").innerHTML = [
    kpi("blue", "Унікальних GEO", geoTasks.filter((item) => item.name !== "Без значення").length, "Записів у таблиці"),
    kpi("purple", "Топ GEO (таски)", compactGeo(geoTasks[0]?.name || "-"), geoTasks[0] ? `${geoTasks[0].value} тасок` : "Немає даних", true),
    kpi("green", "Топ GEO (к-сть)", compactGeo(geoCreatives[0]?.name || "-"), geoCreatives[0] ? `${formatNumber(geoCreatives[0].value)} креативів` : "Немає даних", true),
    kpi("orange", "Арабо-орієнтовано", filteredRows.length ? `~${Math.round((arabicRows / filteredRows.length) * 100)}%` : "0%", "SY, IQ, YE, JO, LB, MR"),
  ].join("");

  renderBars("#geoTaskChart", geoTasks.slice(0, 10), { label: (item) => geoLabel(item.name) });
  renderBars("#geoCreativeChart", geoCreatives.slice(0, 10), { label: (item) => geoLabel(item.name) });
  document.querySelector("#languageTags").innerHTML = languages
    .slice(0, 14)
    .map((item, index) => `<span class="tag" style="border-color:${hexToRgba(colors[index % colors.length], 0.24)};background:${hexToRgba(colors[index % colors.length], 0.12)};color:${colors[index % colors.length]}">🔤 ${escapeHtml(item.name)} · ${item.value}</span>`)
    .join("");
}

function renderInsights() {
  const tasks = filteredRows.length;
  const creatives = sumQuantity(filteredRows);
  const done = filteredRows.filter((row) => isDone(row[fields.status])).length;
  const topBuyer = countBy(filteredRows, fields.buyer, true)[0];
  const topDesigner = countBy(filteredRows, fields.designer, true)[0];
  const topGeo = countBy(filteredRows, fields.geo, false)[0];
  const topDay = countByDate(filteredRows, els.dateField.value).sort((a, b) => b.value - a.value)[0];
  const topCreative = countBy(filteredRows, fields.creative, false)[0];
  const critical = filteredRows.filter((row) => clean(row[fields.priority]).toLowerCase().includes("critical"));
  const adaptations = filteredRows.filter((row) => /адап|adapt/i.test(clean(row[fields.type])));

  const insights = [
    ["📊", "Завершеність", tasks ? `${((done / tasks) * 100).toFixed(1)}% тасок виконано. У вибірці <strong>${tasks}</strong> задач і <strong>${formatNumber(creatives)}</strong> креативів.` : "Немає задач у вибірці."],
    ["👑", `Топ-баєр: ${topBuyer?.name || "-"}`, topBuyer ? `Замовив <strong>${formatNumber(topBuyer.value)} креативів</strong>. Це найбільший обсяг у поточному фільтрі.` : "Немає баєрів у вибірці."],
    ["🎨", `Топ-дизайнер: ${topDesigner?.name || "-"}`, topDesigner ? `<strong>${formatNumber(topDesigner.value)} креативів</strong> у поточній вибірці. Добре видно, хто тримає основний production-volume.` : "Немає дизайнерів у вибірці."],
    ["🌍", `Топ GEO: ${compactGeo(topGeo?.name || "-")}`, topGeo ? `<strong>${topGeo.value} тасок</strong> припадає на цей GEO/кластер.` : "GEO не заповнені."],
    ["📈", "Піки активності", topDay ? `Найбільше задач по даті <strong>${shortDayLabel(topDay.name)}: ${topDay.value}</strong>. Це день з найбільшим навантаженням.` : "Немає дат у вибірці."],
    ["🎬", `Домінує формат: ${topCreative?.name || "-"}`, topCreative ? `<strong>${topCreative.value}</strong> задач у цьому форматі. Варто дивитись, чи не перекошує це production.` : "Формати не заповнені."],
    ["⚡", "Critical / швидка реакція", critical.length ? `<strong>${critical.length}</strong> critical-задач дали <strong>${formatNumber(sumQuantity(critical))}</strong> креативів.` : "Critical-задач у вибірці немає."],
    ["🔄", "Адаптації", tasks ? `<strong>${adaptations.length}</strong> задач, або ${Math.round((adaptations.length / tasks) * 100)}%, схожі на адаптації існуючих креативів.` : "Немає даних."],
  ];

  document.querySelector("#insightCards").innerHTML = insights.map(insightCard).join("");
  renderContentCards();
  renderPatterns();
}

function renderContentCards() {
  const patterns = [
    ["📰", "Новина / Новостник", ["новин", "новост", "news"], "#f43f5e"],
    ["🎮", "Ігровий контент", ["chicken", "кур", "slot", "слот", "plinko", "плінко", "zeus", "зевс"], "#5b6af0"],
    ["🎲", "Plinko", ["plinko", "плінко"], "#34d399"],
    ["🎰", "Слоти / Мультислот", ["slot", "слот", "multi"], "#fbbf24"],
    ["🏦", "Банкінг / локалізація", ["банк", "bank", "cash", "валют", "currency"], "#fb923c"],
    ["📱", "PWA", ["pwa"], "#a78bfa"],
    ["🎭", "Дипфейк", ["дипф", "deepfake"], "#f43f5e"],
    ["🎬", "UGC / Motion", ["ugc", "motion", "стример"], "#818cf8"],
  ];

  document.querySelector("#contentCards").innerHTML = patterns
    .map(([icon, title, keys, color]) => {
      const matches = filteredRows.filter((row) => keys.some((key) => row.__search.includes(key))).length;
      return `
        <div class="content-card" style="border-color:${hexToRgba(color, 0.15)};background:${hexToRgba(color, 0.06)}">
          <div class="content-icon">${icon}</div>
          <div class="content-title">${title}</div>
          <div class="content-text">${matches} задач у вибірці. Рахується за назвами, описами і текстом задач.</div>
        </div>
      `;
    })
    .join("");
}

function renderPatterns() {
  const keywords = keywordCounts().slice(0, 8);
  const patterns = keywords.length
    ? keywords.map(([word, count], index) => [
        colors[index % colors.length],
        word,
        `Зустрічається ${count} разів у текстах задач. Може бути окремою категорією для майбутньої аналітики.`,
      ])
    : [["#a78bfa", "Недостатньо текстів", "Завантажте CSV з описами задач, щоб побачити паттерни."]];

  document.querySelector("#patternList").innerHTML = patterns
    .map(
      ([color, title, text]) => `
        <div class="pattern-row">
          <span class="pattern-arrow" style="color:${color}">→</span>
          <div>
            <div class="pattern-title">${escapeHtml(title)}</div>
            <div class="pattern-text">${escapeHtml(text)}</div>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTable() {
  document.querySelector("#taskRows").innerHTML = filteredRows
    .slice(0, 250)
    .map((row) => {
      const date = parseNotionDate(row[els.dateField.value]);
      return `
        <tr>
          <td class="task-id">${escapeHtml(row[fields.id])}</td>
          <td class="task-name">${escapeHtml(row[fields.task])}</td>
          <td>${date ? date.toLocaleDateString("uk-UA") : ""}</td>
          <td>${escapeHtml(row[fields.designer])}</td>
          <td>${escapeHtml(row[fields.buyer])}</td>
          <td>${formatNumber(row.__quantity)}</td>
          <td><span class="badge ${badgeClass(row[fields.status])}">${escapeHtml(row[fields.status])}</span></td>
          <td class="geo-text" title="${escapeHtml(row[fields.geo])}">${escapeHtml(row[fields.geo])}</td>
        </tr>
      `;
    })
    .join("");
}

function renderBars(selector, items, options = {}) {
  const element = document.querySelector(selector);
  const top = items.filter((item) => item.value || item.tasks).slice(0, 12);
  const valueForMax = options.maxValue || ((list) => Math.max(1, ...list.map((item) => Number(item.value) || Number(item.tasks) || 0)));
  const max = valueForMax(top);
  element.innerHTML = top
    .map((item, index) => {
      const numericValue = Number(item.value) || Number(item.tasks) || 0;
      const width = numericValue ? Math.max(3, (numericValue / max) * 100) : 0;
      const color = options.tone ? options.tone(item.name, index, numericValue) : colors[index % colors.length];
      const label = options.label ? options.label(item) : item.name;
      const value = options.value ? options.value(item) : formatNumber(item.value);
      const drillAttrs = options.drillDesigner ? `data-designer-drill="${encodeURIComponent(item.name)}"` : "";
      const activeClass = options.drillDesigner && item.name === selectedDesigner ? " active" : "";
      return `
        <div class="bar-row ${options.drillDesigner ? "clickable" : ""}${activeClass}" ${drillAttrs}>
          <div class="bar-label ${options.mono ? "mono" : ""}" title="${escapeHtml(label)}">${escapeHtml(label)}</div>
          <div class="bar-wrap"><div class="bar-fill" style="width:${width.toFixed(1)}%;background:${color}"></div></div>
          <div class="bar-val" style="${index === 0 ? `color:${color};font-weight:700` : ""}">${escapeHtml(value)}</div>
        </div>
      `;
    })
    .join("");
}

function renderTimeline(daily) {
  const element = document.querySelector("#timelineChart");
  const max = Math.max(1, ...daily.map((item) => item.value));
  const chartHeight = 96;
  element.innerHTML = daily
    .map((item) => {
      const height = Math.max(4, (item.value / max) * chartHeight);
      const color = item.value / max > 0.72 ? "#f43f5e" : item.value / max > 0.45 ? "#fb923c" : "#5b6af0";
      return `
        <div class="timeline-bar-wrap" title="${shortDayLabel(item.name)}: ${item.value} тасок">
          <div class="timeline-val">${item.value}</div>
          <div class="timeline-bar" style="height:${height}px;background:${color}"></div>
        </div>
      `;
    })
    .join("");

  const axis = document.createElement("div");
  axis.className = "timeline-axis";
  axis.innerHTML = daily.map((item) => `<span class="timeline-axis-label">${shortDayLabel(item.name).split(".")[0]}</span>`).join("");
  element.append(axis);
}

function kpi(color, label, value, sub, compact = false) {
  return `
    <div class="kpi-card ${color}">
      <div class="kpi-label">${escapeHtml(label)}</div>
      <div class="kpi-value ${color}" style="${compact ? "font-size:22px;letter-spacing:-1px" : ""}">${escapeHtml(value)}</div>
      <div class="kpi-sub">${escapeHtml(sub)}</div>
    </div>
  `;
}

function designerCard(item, index) {
  const rank = index + 1;
  const name = compactPerson(item.name);
  return `
    <div class="designer-card ${item.name === selectedDesigner ? "active" : ""}" data-designer-drill="${encodeURIComponent(item.name)}">
      <div class="rank-badge rank-${Math.min(rank, 5)}">#${rank}</div>
      <div class="designer-name">${escapeHtml(name)}</div>
      <div class="designer-handle">${escapeHtml(item.name)}</div>
      <div class="designer-stats">
        <div><div class="d-stat-val" style="color:${colors[index % colors.length]}">${formatNumber(item.value)}</div><div class="d-stat-label">Креативів</div></div>
        <div><div class="d-stat-val" style="color:#5b6af0">${item.tasks}</div><div class="d-stat-label">Тасок</div></div>
      </div>
    </div>
  `;
}

function renderDesignerDetail(designer) {
  const card = document.querySelector("#designerDetailCard");
  if (!designer) {
    card.innerHTML = `<div class="chart-title">Деталізація дизайнера</div><div class="chart-note">Немає дизайнера у вибірці.</div>`;
    return;
  }

  const rows = filteredRows.filter((row) => clean(row[fields.designer]) === designer);
  const tasks = rows.length;
  const creatives = sumQuantity(rows);
  const creativeBreakdown = countBy(rows, fields.creative, true).slice(0, 8);
  const topicBreakdown = countBy(rows, fields.task, true).slice(0, 10);
  const taskList = rows
    .slice()
    .sort((a, b) => (parseNotionDate(b[els.dateField.value]) || 0) - (parseNotionDate(a[els.dateField.value]) || 0))
    .slice(0, 80);

  card.innerHTML = `
    <div class="detail-head">
      <div>
        <div class="chart-title">Деталізація дизайнера</div>
        <div class="detail-name">${escapeHtml(compactPerson(designer))}</div>
        <div class="detail-handle">${escapeHtml(designer)}</div>
      </div>
      <div class="detail-metrics">
        <div class="mini-metric"><div class="mini-value" style="color:#5b6af0">${tasks}</div><div class="mini-label">Тасок</div></div>
        <div class="mini-metric"><div class="mini-value" style="color:#34d399">${formatNumber(creatives)}</div><div class="mini-label">Креативів</div></div>
        <div class="mini-metric"><div class="mini-value" style="color:#a78bfa">${tasks ? (creatives / tasks).toFixed(1) : "0"}</div><div class="mini-label">Крео / таску</div></div>
      </div>
    </div>
    <div class="detail-grid">
      <div>
        <div class="detail-subtitle">Формати: Відео / Статика / PWA</div>
        <div class="bar-chart" id="designerCreativeBreakdown"></div>
      </div>
      <div>
        <div class="detail-subtitle">Теми / назви задач: таски і креативи</div>
        <div class="bar-chart" id="designerTopicBreakdown"></div>
      </div>
    </div>
    <div class="detail-subtitle">Конкретні задачі</div>
    <div class="task-list">
      ${taskList.map(taskPill).join("")}
    </div>
  `;

  renderBars("#designerCreativeBreakdown", creativeBreakdown, {
    value: (item) => {
      const formatRows = rows.filter((row) => (clean(row[fields.creative]) || "Без значення") === item.name);
      return `${formatRows.length} т. · ${formatNumber(item.value)} крео`;
    },
  });
  renderBars("#designerTopicBreakdown", topicBreakdown, {
    value: (item) => {
      const topicRows = rows.filter((row) => (clean(row[fields.task]) || "Без значення") === item.name);
      return `${topicRows.length} т. · ${formatNumber(item.value)} крео`;
    },
  });
}

function taskPill(row) {
  const date = parseNotionDate(row[els.dateField.value]);
  const meta = [row[fields.creative], row[fields.type], row[fields.geo], date ? date.toLocaleDateString("uk-UA") : ""]
    .map(clean)
    .filter(Boolean)
    .join(" · ");
  return `
    <div class="task-pill">
      <div class="task-pill-id">${escapeHtml(row[fields.id])}</div>
      <div class="task-pill-main">
        <div class="task-pill-title" title="${escapeHtml(row[fields.task])}">${escapeHtml(row[fields.task] || "Без назви")}</div>
        <div class="task-pill-meta">${escapeHtml(meta)}</div>
      </div>
      <div class="task-pill-qty">${formatNumber(row.__quantity)} крео</div>
    </div>
  `;
}

function insightCard([icon, title, text]) {
  return `
    <div class="insight-card">
      <div class="insight-icon">${icon}</div>
      <div>
        <div class="insight-title">${escapeHtml(title)}</div>
        <div class="insight-text">${text}</div>
      </div>
    </div>
  `;
}

function enrichPeople(quantityItems, taskItems) {
  const taskMap = new Map(taskItems.map((item) => [item.name, item.value]));
  return quantityItems.map((item) => ({ ...item, tasks: taskMap.get(item.name) || 0 }));
}

function countBy(rows, field, useQuantity) {
  const counts = new Map();
  rows.forEach((row) => {
    const key = clean(row[field]) || "Без значення";
    counts.set(key, (counts.get(key) || 0) + (useQuantity ? row.__quantity || 1 : 1));
  });
  return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function countByDate(rows, field) {
  const counts = new Map();
  rows.forEach((row) => {
    const date = parseNotionDate(row[field]);
    if (!date) return;
    const key = toDateInput(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));
}

function keywordCounts() {
  const stop = new Set(["the", "and", "for", "with", "this", "that", "task", "buyer", "id", "https", "http", "com", "www", "notion", "source", "copy_link"]);
  const counts = new Map();
  filteredRows.forEach((row) => {
    const words = [row[fields.text], row[fields.post], row[fields.task]].join(" ").toLowerCase().match(/[a-zа-яіїєґ0-9@_-]{3,}/giu) || [];
    words.forEach((word) => {
      if (stop.has(word) || /^ts-\d+$/i.test(word)) return;
      counts.set(word, (counts.get(word) || 0) + 1);
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function exportFilteredCsv() {
  if (!filteredRows.length) return;
  const header = Object.keys(filteredRows[0]).filter((key) => !key.startsWith("__"));
  const csv = [header, ...filteredRows.map((row) => header.map((key) => row[key] || ""))]
    .map((values) => values.map(csvEscape).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mounthanalytic-filtered.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function statusColor(name) {
  const text = clean(name).toLowerCase();
  if (text.includes("викон")) return "#34d399";
  if (text.includes("перев")) return "#fb923c";
  if (text.includes("проц")) return "#5b6af0";
  if (text.includes("нова")) return "#a78bfa";
  if (text.includes("hold")) return "#f43f5e";
  return "#6b6b80";
}

function priorityColor(name) {
  const text = clean(name).toLowerCase();
  if (text.includes("critical")) return "#f43f5e";
  if (text.includes("high")) return "#fb923c";
  if (text.includes("medium")) return "#5b6af0";
  return "#6b6b80";
}

function badgeClass(status) {
  const text = clean(status).toLowerCase();
  if (text.includes("викон")) return "badge-done";
  if (text.includes("перев")) return "badge-review";
  if (text.includes("проц")) return "badge-progress";
  if (text.includes("нова")) return "badge-new";
  return "badge-critical";
}

function parseNotionDate(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(/(\d{1,2}):(\d{2})\s?(AM|PM)/i, "$1:$2 $3"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseInputDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function daysBetween(start, end) {
  if (!start || !end) return Number.NaN;
  return (end - start) / 86_400_000;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : Number.NaN;
}

function sumQuantity(rows) {
  return rows.reduce((sum, row) => sum + row.__quantity, 0);
}

function isDone(status) {
  return clean(status).toLowerCase().includes("викон");
}

function clean(value) {
  return String(value || "").trim();
}

function toDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toMonthInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatShortDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function shortDayLabel(value) {
  const date = parseInputDate(value);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthTitle(start, end) {
  const months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
  return start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
    ? months[start.getMonth()]
    : `${months[start.getMonth()]} - ${months[end.getMonth()]}`;
}

function compactPerson(value) {
  const match = clean(value).match(/\(([^)]+)\)/);
  return match ? match[1] : clean(value).replace(/^@/, "");
}

function compactGeo(value) {
  return clean(value).split(",")[0].replace(/\s*\(.+?\)/, "");
}

function geoLabel(value) {
  return compactGeo(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(value || 0);
}

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace("#", "");
  const bigint = Number.parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function escapeHtml(value) {
  return clean(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function csvEscape(value) {
  const string = String(value ?? "");
  return /[",\n\r]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string;
}

function setNotice(message) {
  els.notice.textContent = message;
}
