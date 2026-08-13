import test from "node:test";
import assert from "node:assert/strict";

import {
  brierScore,
  calibrationScore,
  createDecision,
  daysUntil,
  gardenMetrics,
  statusOf,
  validateImport,
} from "../core.js";

const today = new Date("2026-08-13T12:00:00+08:00");

test("daysUntil compares calendar days instead of time of day", () => {
  assert.equal(daysUntil("2026-08-14", today), 1);
  assert.equal(daysUntil("2026-08-13", today), 0);
  assert.equal(daysUntil("2026-08-10", today), -3);
});

test("statusOf distinguishes growing, due, and bloomed decisions", () => {
  assert.equal(statusOf({ reviewDate: "2026-08-20", review: null }, today), "growing");
  assert.equal(statusOf({ reviewDate: "2026-08-13", review: null }, today), "due");
  assert.equal(statusOf({ reviewDate: "2026-08-01", review: { occurred: true } }, today), "bloomed");
});

test("Brier-derived score rewards calibrated predictions", () => {
  assert.ok(Math.abs(brierScore(80, true) - 0.04) < Number.EPSILON);
  assert.equal(calibrationScore([
    { confidence: 80, review: { occurred: true } },
    { confidence: 20, review: { occurred: false } },
  ]), 96);
});

test("garden metrics count each visible state", () => {
  const metrics = gardenMetrics([
    { confidence: 60, reviewDate: "2026-08-20", review: null },
    { confidence: 60, reviewDate: "2026-08-10", review: null },
    { confidence: 80, reviewDate: "2026-08-01", review: { occurred: true } },
  ], today);
  assert.deepEqual(metrics, { total: 3, due: 1, bloomed: 1, score: 96 });
});

test("imports reject unrelated or structurally incomplete JSON", () => {
  assert.throws(() => validateImport({ app: "another-app" }), /不是反事实花园/);
  assert.throws(() => validateImport({ app: "counterfactual-garden", schemaVersion: 1, decisions: [{}] }), /不完整/);
});

test("imports reject invalid confidence, date, and review values", () => {
  const base = { id: "1", title: "x", choice: "y", expectation: "z", confidence: 50, reviewDate: "2026-09-01" };
  const envelope = (decision) => ({ app: "counterfactual-garden", schemaVersion: 1, decisions: [decision] });
  assert.throws(() => validateImport(envelope({ ...base, confidence: "unknown" })), /信心数值/);
  assert.throws(() => validateImport(envelope({ ...base, reviewDate: "September" })), /复盘日期/);
  assert.throws(() => validateImport(envelope({ ...base, review: { occurred: "yes" } })), /复盘记录/);
});

test("createDecision normalizes form values without changing the schema", () => {
  const decision = createDecision({
    title: "  新决定  ",
    choice: "  去做  ",
    alternative: "  等待  ",
    expectation: "  收到反馈  ",
    confidence: "65",
    reviewDate: "2026-09-01",
    category: "创作",
  }, today);
  assert.equal(decision.title, "新决定");
  assert.equal(decision.choice, "去做");
  assert.equal(decision.confidence, 65);
  assert.equal(decision.review, null);
});

test("valid backups are returned for merging", () => {
  const decisions = [{ id: "1", title: "x", choice: "y", expectation: "z", confidence: 50, reviewDate: "2026-09-01" }];
  assert.equal(validateImport({ app: "counterfactual-garden", schemaVersion: 1, decisions }), decisions);
});
