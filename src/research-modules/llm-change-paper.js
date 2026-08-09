'use strict';

const SOURCE_URL = 'https://arxiv.org/pdf/2301.01741';

function zeros(n) { return Array.from({ length: n }, () => 0); }
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function dot(a, b) { let s = 0; for (let i = 0; i < Math.min(a.length, b.length); i += 1) s += a[i] * b[i]; return s; }
function inferGraph(series, threshold) {
  const t = threshold == null ? 0.35 : threshold;
  const names = Object.keys(series || {});
  const edges = [];
  for (let i = 0; i < names.length; i += 1) for (let j = i + 1; j < names.length; j += 1) {
    const a = series[names[i]] || [];
    const b = series[names[j]] || [];
    const ma = a.reduce((s, x) => s + x, 0) / (a.length || 1);
    const mb = b.reduce((s, x) => s + x, 0) / (b.length || 1);
    let num = 0, da = 0, db = 0;
    for (let k = 0; k < Math.min(a.length, b.length); k += 1) { num += (a[k] - ma) * (b[k] - mb); da += (a[k] - ma) ** 2; db += (b[k] - mb) ** 2; }
    const weight = da && db ? num / Math.sqrt(da * db) : 0;
    if (Math.abs(weight) >= t) edges.push({ from: names[i], to: names[j], weight: Number(weight.toFixed(6)) });
  }
  return { nodes: names.map((id) => ({ id })), edges };
}

function createGraphStateSpace(options) {
  const opts = Object.assign({ stateSize: 3, inputWeight: 0.5, recurrentWeight: 0.35, graphWeight: 0.15 }, options || {});
  let state = zeros(opts.stateSize);
  let graph = { nodes: [], edges: [] };
  return {
    reset(initialState) { state = (initialState || zeros(opts.stateSize)).slice(0, opts.stateSize); return this; },
    setGraph(nextGraph) { graph = { nodes: (nextGraph && nextGraph.nodes) || [], edges: (nextGraph && nextGraph.edges) || [] }; return this; },
    step(input) {
      const x = Array.isArray(input) ? input : zeros(opts.stateSize);
      const edgeSignal = graph.edges.reduce((s, e) => s + Math.abs(e.weight || 0), 0) / (graph.edges.length || 1);
      state = state.map((h, i) => Math.tanh(opts.recurrentWeight * h + opts.inputWeight * (x[i] || 0) + opts.graphWeight * edgeSignal));
      return state.slice();
    },
    predict(input, horizon) { const out = []; for (let i = 0; i < (horizon || 1); i += 1) out.push(this.step(i === 0 ? input : out[out.length - 1])); return out; },
    observe(target) { return { state: state.slice(), probability: sigmoid(dot(state, target || [])), graph }; },
  };
}

module.exports = { id: 'graph-state-space-models-2301-01741', legacyId: 'llm-change-paper-2301-01741', title: 'Graph State-Space Models and Latent Relational Inference', sourceUrl: SOURCE_URL, inferGraph, createGraphStateSpace };
