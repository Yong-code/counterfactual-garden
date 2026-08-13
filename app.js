import {
  createDecision,
  daysUntil,
  exportEnvelope,
  gardenMetrics,
  stableHue,
  statusOf,
  validateImport,
} from "./core.js";

const STORAGE_KEY = "counterfactual-garden:v1";
const THEME_KEY = "counterfactual-garden:theme";

const elements = {
  form: document.querySelector("#decision-form"),
  confidence: document.querySelector("#confidence"),
  confidenceOutput: document.querySelector("#confidence-output"),
  confidenceLabel: document.querySelector("#confidence-label"),
  reviewDate: document.querySelector("#review-date"),
  reviewDateHint: document.querySelector("#review-date-hint"),
  gardenBed: document.querySelector("#garden-bed"),
  gardenEmpty: document.querySelector("#garden-empty"),
  recordList: document.querySelector("#record-list"),
  recordEmpty: document.querySelector("#record-empty"),
  recordSearch: document.querySelector("#record-search"),
  recordCount: document.querySelector("#record-count"),
  reviewDialog: document.querySelector("#review-dialog"),
  reviewForm: document.querySelector("#review-form"),
  reviewTitle: document.querySelector("#review-title"),
  reviewId: document.querySelector("#review-id"),
  deleteDialog: document.querySelector("#delete-dialog"),
  deleteForm: document.querySelector("#delete-form"),
  deleteTitle: document.querySelector("#delete-title"),
  deleteId: document.querySelector("#delete-id"),
  cancelDelete: document.querySelector("#cancel-delete"),
  toast: document.querySelector("#toast"),
  toastMessage: document.querySelector("#toast-message"),
  toastAction: document.querySelector("#toast-action"),
  loadDemo: document.querySelector("#load-demo"),
  exportData: document.querySelector("#export-data"),
  importData: document.querySelector("#import-data"),
  themeToggle: document.querySelector("#theme-toggle"),
  metrics: {
    total: document.querySelector("#metric-total"),
    due: document.querySelector("#metric-due"),
    bloomed: document.querySelector("#metric-bloomed"),
    score: document.querySelector("#metric-score"),
  },
};

let decisions = readDecisions();
let activeFilter = "all";
let searchQuery = "";
let toastTimer;
let toastActionHandler = null;

function readDecisions() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveDecisions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

function isoDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function relativeReview(decision) {
  if (decision.review) return `已于 ${formatDate(decision.review.reviewedAt.slice(0, 10))} 复盘`;
  const days = daysUntil(decision.reviewDate);
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天复盘";
  return `${days} 天后复盘`;
}

function showToast(message, options = {}) {
  window.clearTimeout(toastTimer);
  elements.toastMessage.textContent = message;
  toastActionHandler = typeof options.onAction === "function" ? options.onAction : null;
  elements.toastAction.hidden = !toastActionHandler;
  elements.toastAction.textContent = options.actionLabel || "撤销";
  elements.toast.classList.add("show");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
    toastActionHandler = null;
  }, options.duration || 2800);
}

function makeText(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

function plantMarkup(decision) {
  const status = statusOf(decision);
  const height = 54 + decision.confidence * 0.76;
  const hue = stableHue(decision.title);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `garden-plant ${status}`;
  button.style.setProperty("--plant-height", `${height}px`);
  button.style.setProperty("--flower-hue", hue);
  button.dataset.id = decision.id;
  button.setAttribute("aria-label", `${decision.title}，信心 ${decision.confidence}%，${relativeReview(decision)}`);

  const plantVisual = document.createElement("span");
  plantVisual.className = "plant-visual";
  const flower = document.createElement("span");
  flower.className = "flower";
  for (let index = 0; index < 6; index += 1) flower.append(document.createElement("i"));
  flower.append(document.createElement("b"));
  plantVisual.append(flower, makeText("span", "stem", ""), makeText("span", "leaf leaf-left", ""), makeText("span", "leaf leaf-right", ""));

  const caption = document.createElement("span");
  caption.className = "plant-caption";
  caption.append(makeText("strong", "", decision.title), makeText("small", "", relativeReview(decision)));
  button.append(plantVisual, caption);
  return button;
}

function renderGarden() {
  elements.gardenBed.replaceChildren();
  elements.gardenEmpty.hidden = decisions.length > 0;
  elements.gardenBed.hidden = decisions.length === 0;
  const sorted = [...decisions].sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
  sorted.forEach((decision) => elements.gardenBed.append(plantMarkup(decision)));
}

function statusLabel(status) {
  return { growing: "生长中", due: "待复盘", bloomed: "已开花" }[status];
}

function buildDetail(label, value) {
  const row = document.createElement("div");
  row.className = "record-detail";
  row.append(makeText("dt", "", label), makeText("dd", "", value || "—"));
  return row;
}

function recordMarkup(decision) {
  const status = statusOf(decision);
  const article = document.createElement("article");
  article.className = `record-card ${status}`;
  article.dataset.id = decision.id;

  const top = document.createElement("div");
  top.className = "record-top";
  const badges = document.createElement("div");
  badges.className = "record-badges";
  badges.append(makeText("span", "category-badge", decision.category), makeText("span", `status-badge ${status}`, statusLabel(status)));
  top.append(badges, makeText("time", "", formatDate(decision.createdAt.slice(0, 10))));

  const title = makeText("h3", "", decision.title);
  const prediction = makeText("p", "record-prediction", decision.expectation);
  const confidence = document.createElement("div");
  confidence.className = "confidence-bar";
  confidence.innerHTML = `<span style="width:${decision.confidence}%"></span>`;
  confidence.setAttribute("aria-label", `当时信心 ${decision.confidence}%`);
  const confidenceCaption = makeText("p", "confidence-caption", `当时信心 ${decision.confidence}% · ${relativeReview(decision)}`);

  const details = document.createElement("dl");
  details.append(buildDetail("选择", decision.choice));
  if (decision.alternative) details.append(buildDetail("另一条路", decision.alternative));
  if (decision.review) {
    details.append(buildDetail("实际结果", decision.review.actual));
    if (decision.review.lesson) details.append(buildDetail("留给未来", decision.review.lesson));
  }

  const more = document.createElement("details");
  more.className = "record-more";
  more.append(makeText("summary", "", decision.review ? "查看判断与复盘" : "查看完整判断"), details);

  const actions = document.createElement("div");
  actions.className = "record-actions";
  if (!decision.review) {
    const reviewButton = makeText("button", "text-button review-button", status === "due" ? "现在复盘 →" : "提前复盘 →");
    reviewButton.type = "button";
    reviewButton.dataset.action = "review";
    actions.append(reviewButton);
  }
  const deleteButton = makeText("button", "text-button delete-button", "删除");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  actions.append(deleteButton);

  article.append(top, title, prediction, confidence, confidenceCaption, more, actions);
  return article;
}

function renderRecords() {
  elements.recordList.replaceChildren();
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("zh-CN");
  const filtered = decisions
    .filter((decision) => activeFilter === "all" || statusOf(decision) === activeFilter)
    .filter((decision) => {
      if (!normalizedQuery) return true;
      return [decision.title, decision.expectation, decision.choice, decision.alternative, decision.category]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("zh-CN").includes(normalizedQuery));
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  elements.recordEmpty.hidden = filtered.length > 0;
  elements.recordCount.textContent = `${filtered.length} 条记录`;
  filtered.forEach((decision) => elements.recordList.append(recordMarkup(decision)));
}

function renderMetrics() {
  const metrics = gardenMetrics(decisions);
  elements.metrics.total.textContent = metrics.total;
  elements.metrics.due.textContent = metrics.due;
  elements.metrics.bloomed.textContent = metrics.bloomed;
  elements.metrics.score.textContent = metrics.score === null ? "—" : `${metrics.score}`;
}

function render() {
  renderMetrics();
  renderGarden();
  renderRecords();
}

function openReview(id) {
  const decision = decisions.find((item) => item.id === id);
  if (!decision) return;
  elements.reviewForm.reset();
  elements.reviewId.value = decision.id;
  elements.reviewTitle.textContent = `“${decision.expectation}” · 当时信心 ${decision.confidence}%`;
  elements.reviewDialog.showModal();
}

function handleRecordAction(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const card = actionButton.closest("[data-id]");
  if (!card) return;
  if (actionButton.dataset.action === "review") openReview(card.dataset.id);
  if (actionButton.dataset.action === "delete") {
    const decision = decisions.find((item) => item.id === card.dataset.id);
    if (!decision) return;
    elements.deleteId.value = decision.id;
    elements.deleteTitle.textContent = `“${decision.title}”`;
    elements.deleteDialog.showModal();
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(elements.form));
  decisions.unshift(createDecision(fields));
  saveDecisions();
  elements.form.reset();
  elements.confidence.value = "65";
  elements.reviewDate.value = isoDateOffset(30);
  updateConfidence();
  updateReviewDateHint();
  render();
  showToast("决定已经种进花园");
  document.querySelector("#garden").scrollIntoView({ behavior: "smooth" });
});

function confidenceDescription(value) {
  if (value <= 30) return "谨慎预期";
  if (value <= 55) return "仍在权衡";
  if (value <= 75) return "较有把握";
  return "很有把握";
}

function updateConfidence() {
  const value = Number(elements.confidence.value);
  elements.confidenceOutput.textContent = `${value}%`;
  elements.confidenceLabel.textContent = confidenceDescription(value);
  elements.confidence.style.setProperty("--confidence", `${value}%`);
}

function updateReviewDateHint() {
  if (!elements.reviewDate.value) {
    elements.reviewDateHint.textContent = "请选择未来的复盘日期";
    return;
  }
  const days = daysUntil(elements.reviewDate.value);
  elements.reviewDateHint.textContent = days === 0 ? "今天回来复盘" : `${days} 天后回来看看`;
}

elements.confidence.addEventListener("input", updateConfidence);
elements.reviewDate.addEventListener("input", updateReviewDateHint);

elements.recordList.addEventListener("click", handleRecordAction);

elements.gardenBed.addEventListener("click", (event) => {
  const plant = event.target.closest(".garden-plant");
  if (!plant) return;
  activeFilter = "all";
  searchQuery = "";
  elements.recordSearch.value = "";
  document.querySelectorAll(".filter").forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderRecords();
  window.requestAnimationFrame(() => {
    document.querySelector(`.record-card[data-id="${CSS.escape(plant.dataset.id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

elements.reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.reviewForm);
  const id = formData.get("id");
  const decision = decisions.find((item) => item.id === id);
  if (!decision) return;
  decision.review = {
    occurred: formData.get("occurred") === "true",
    actual: String(formData.get("actual")).trim(),
    lesson: String(formData.get("lesson") || "").trim(),
    reviewedAt: new Date().toISOString(),
  };
  saveDecisions();
  elements.reviewDialog.close();
  render();
  showToast("复盘完成，一朵花开了");
});

elements.cancelDelete.addEventListener("click", () => elements.deleteDialog.close());

elements.deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = elements.deleteId.value;
  const originalIndex = decisions.findIndex((item) => item.id === id);
  if (originalIndex < 0) return;
  const [decision] = decisions.splice(originalIndex, 1);
  saveDecisions();
  elements.deleteDialog.close();
  render();
  showToast("记录已从当前浏览器删除", {
    actionLabel: "撤销",
    duration: 6000,
    onAction: () => {
      decisions.splice(originalIndex, 0, decision);
      saveDecisions();
      render();
      showToast("删除已撤销");
    },
  });
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderRecords();
  });
});

elements.recordSearch.addEventListener("input", () => {
  searchQuery = elements.recordSearch.value;
  renderRecords();
});

function loadDemoDecisions() {
  if (decisions.some((item) => item.demo)) {
    document.querySelector("#garden").scrollIntoView({ behavior: "smooth" });
    showToast("示例已经在花园里了");
    return;
  }
  const now = new Date();
  const demos = [
    {
      title: "连续 14 天散步",
      choice: "晚饭后不看手机，先出门走 20 分钟。",
      alternative: "继续坐在桌前刷视频。",
      expectation: "14 天后，我至少完成 10 次散步，并且入睡更快。",
      confidence: 70,
      reviewDate: isoDateOffset(8),
      category: "生活",
    },
    {
      title: "公开一个周末作品",
      choice: "周日晚上前发布一个很小但完整的网页。",
      alternative: "继续补功能，等到觉得足够好再发布。",
      expectation: "发布后的一周内，至少有一个陌生人给出具体反馈。",
      confidence: 45,
      reviewDate: isoDateOffset(-2),
      category: "创作",
    },
    {
      title: "先画草图再写代码",
      choice: "每个页面先用纸笔画 10 分钟再打开编辑器。",
      alternative: "想到哪里直接写到哪里。",
      expectation: "本周第二个页面的返工时间会比第一个少。",
      confidence: 80,
      reviewDate: isoDateOffset(-12),
      category: "实验",
    },
  ].map((fields, index) => ({
    ...createDecision(fields, new Date(now.getTime() - index * 86_400_000)),
    demo: true,
  }));
  demos[2].review = {
    occurred: true,
    actual: "第二个页面只调整了两次布局，第一个页面调整了五次。",
    lesson: "草图不用好看，只要先确定信息顺序。",
    reviewedAt: new Date().toISOString(),
  };
  decisions = [...demos, ...decisions];
  saveDecisions();
  render();
  document.querySelector("#garden").scrollIntoView({ behavior: "smooth" });
  showToast("三颗示例种子已加入，可随时删除");
}

elements.loadDemo.addEventListener("click", loadDemoDecisions);
document.querySelectorAll("[data-demo-trigger]").forEach((button) => {
  button.addEventListener("click", loadDemoDecisions);
});

elements.exportData.addEventListener("click", () => {
  if (!decisions.length) {
    showToast("花园还没有可以导出的记录");
    return;
  }
  const blob = new Blob([JSON.stringify(exportEnvelope(decisions), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `counterfactual-garden-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("备份已导出");
});

elements.importData.addEventListener("change", async () => {
  const [file] = elements.importData.files;
  if (!file) return;
  try {
    const imported = validateImport(JSON.parse(await file.text()));
    const byId = new Map(decisions.map((item) => [item.id, item]));
    imported.forEach((item) => byId.set(item.id, item));
    decisions = [...byId.values()];
    saveDecisions();
    render();
    showToast(`成功导入 ${imported.length} 条记录`);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "导入失败");
  } finally {
    elements.importData.value = "";
  }
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.setAttribute("aria-label", theme === "dark" ? "切换浅色模式" : "切换深色模式");
  elements.themeToggle.querySelector("span").textContent = theme === "dark" ? "☀" : "☾";
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#0c1713" : "#f2f4ef";
}

elements.themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
});

const storedTheme = localStorage.getItem(THEME_KEY);
applyTheme(storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
elements.toastAction.addEventListener("click", () => {
  window.clearTimeout(toastTimer);
  const handler = toastActionHandler;
  toastActionHandler = null;
  elements.toast.classList.remove("show");
  if (handler) handler();
});

const observedSections = [...document.querySelectorAll("main > section[id]")];
const navLinks = [...document.querySelectorAll("nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.find((entry) => entry.isIntersecting);
  if (!visible) return;
  navLinks.forEach((link) => {
    const isActive = link.hash === `#${visible.target.id}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-28% 0px -62%", threshold: 0 });
observedSections.forEach((section) => sectionObserver.observe(section));

elements.reviewDate.min = isoDateOffset(0);
elements.reviewDate.value = isoDateOffset(30);
updateConfidence();
updateReviewDateHint();
render();
