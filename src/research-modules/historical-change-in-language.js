'use strict';

const SOURCE_URL = 'http://www.cs.wisc.edu/%7Esklein/Historical%20Change%20in%20LanguageCover%20plus.pdf';

function cloneVector(v) { return Object.assign({}, v || {}); }
function magnitude(v) { return Math.sqrt(Object.keys(v).reduce((s, k) => s + v[k] * v[k], 0)); }
function normalize(v) { const m = magnitude(v) || 1; const out = {}; Object.keys(v || {}).forEach((k) => { out[k] = v[k] / m; }); return out; }
function cosine(a, b) { let dot = 0; Object.keys(a || {}).forEach((k) => { dot += (a[k] || 0) * (b[k] || 0); }); return dot / ((magnitude(a) || 1) * (magnitude(b) || 1)); }
function delta(a, b) { const keys = {}; Object.keys(a || {}).forEach((k) => { keys[k] = true; }); Object.keys(b || {}).forEach((k) => { keys[k] = true; }); const out = {}; Object.keys(keys).forEach((k) => { out[k] = (b[k] || 0) - (a[k] || 0); }); return out; }

function createTimeline() {
  const slices = [];
  return {
    addSlice(label, lexicon) { slices.push({ label, lexicon: Object.assign({}, lexicon || {}) }); return this; },
    getSlices() { return slices.map((s) => ({ label: s.label, lexicon: Object.assign({}, s.lexicon) })); },
    trace(term) { return slices.map((s) => ({ time: s.label, value: s.lexicon[term] == null ? null : cloneVector(s.lexicon[term]) })); },
    compare(term, fromIndex, toIndex) {
      const from = slices[fromIndex || 0];
      const to = slices[toIndex == null ? slices.length - 1 : toIndex];
      const before = from && from.lexicon[term] ? normalize(from.lexicon[term]) : {};
      const after = to && to.lexicon[term] ? normalize(to.lexicon[term]) : {};
      return { term, from: from && from.label, to: to && to.label, stability: Number(cosine(before, after).toFixed(6)), changeVector: delta(before, after) };
    },
    changedTerms(threshold) {
      const t = threshold == null ? 0.25 : threshold;
      if (slices.length < 2) return [];
      const terms = {};
      slices.forEach((s) => Object.keys(s.lexicon).forEach((w) => { terms[w] = true; }));
      return Object.keys(terms).map((term) => this.compare(term, 0, slices.length - 1)).filter((r) => 1 - r.stability >= t).sort((a, b) => a.stability - b.stability);
    },
  };
}

module.exports = { id: 'historical-change-in-language', title: 'Historical Change in Language', sourceUrl: SOURCE_URL, createTimeline, normalize, cosine, delta };
