export const SCHEMA_VERSION = 1;

export function startOfDay(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysUntil(dateString, today = new Date()) {
  const milliseconds = startOfDay(dateString) - startOfDay(today);
  return Math.ceil(milliseconds / 86_400_000);
}

export function statusOf(decision, today = new Date()) {
  if (decision.review) return "bloomed";
  return daysUntil(decision.reviewDate, today) <= 0 ? "due" : "growing";
}

export function brierScore(confidence, occurred) {
  const probability = Number(confidence) / 100;
  const outcome = occurred ? 1 : 0;
  return (probability - outcome) ** 2;
}

export function calibrationScore(decisions) {
  const reviewed = decisions.filter((item) => item.review);
  if (!reviewed.length) return null;
  const meanBrier = reviewed.reduce(
    (sum, item) => sum + brierScore(item.confidence, item.review.occurred),
    0,
  ) / reviewed.length;
  return Math.round((1 - meanBrier) * 100);
}

export function gardenMetrics(decisions, today = new Date()) {
  return {
    total: decisions.length,
    due: decisions.filter((item) => statusOf(item, today) === "due").length,
    bloomed: decisions.filter((item) => item.review).length,
    score: calibrationScore(decisions),
  };
}

export function stableHue(text = "") {
  let hash = 0;
  for (const character of text) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 110) + 4) % 360;
}

export function makeId(now = Date.now()) {
  return `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDecision(fields, now = new Date()) {
  return {
    id: makeId(now.getTime()),
    title: String(fields.title).trim(),
    choice: String(fields.choice).trim(),
    alternative: String(fields.alternative || "").trim(),
    expectation: String(fields.expectation).trim(),
    confidence: Number(fields.confidence),
    reviewDate: String(fields.reviewDate),
    category: String(fields.category || "生活"),
    createdAt: now.toISOString(),
    review: null,
  };
}

export function exportEnvelope(decisions) {
  return {
    app: "counterfactual-garden",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    decisions,
  };
}

export function validateImport(payload) {
  if (!payload || payload.app !== "counterfactual-garden") {
    throw new Error("这不是反事实花园的备份文件。");
  }
  if (payload.schemaVersion !== SCHEMA_VERSION || !Array.isArray(payload.decisions)) {
    throw new Error("备份版本不受支持。");
  }
  for (const item of payload.decisions) {
    const required = ["id", "title", "choice", "expectation", "confidence", "reviewDate"];
    if (!item || typeof item !== "object" || required.some((key) => item[key] === undefined)) {
      throw new Error("备份中有不完整的决定记录。");
    }
    const requiredText = ["id", "title", "choice", "expectation", "reviewDate"];
    if (requiredText.some((key) => typeof item[key] !== "string" || !item[key].trim())) {
      throw new Error("备份中有不完整的决定记录。");
    }
    const confidence = Number(item.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
      throw new Error("备份中有无效的信心数值。");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.reviewDate) || Number.isNaN(startOfDay(item.reviewDate).getTime())) {
      throw new Error("备份中有无效的复盘日期。");
    }
    if (item.review !== undefined && item.review !== null) {
      const review = item.review;
      if (
        typeof review !== "object"
        || typeof review.occurred !== "boolean"
        || typeof review.actual !== "string"
        || !review.actual.trim()
        || typeof review.reviewedAt !== "string"
        || Number.isNaN(new Date(review.reviewedAt).getTime())
      ) {
        throw new Error("备份中有无效的复盘记录。");
      }
    }
  }
  return payload.decisions;
}
