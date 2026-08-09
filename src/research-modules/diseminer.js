'use strict';

const SOURCE_URL = 'https://pages.cs.wisc.edu/~sklein/DISEMINER-Distributional-Semantics-Inference-Maker.pdf';

function tokenize(text) {
  return String(text || '').toLowerCase().match(/[a-z0-9']+/g) || [];
}

function add(map, key, amount) {
  map[key] = (map[key] || 0) + amount;
}

function cosine(a, b) {
  let dot = 0;
  let aa = 0;
  let bb = 0;
  const keys = Object.keys(a);
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const av = a[k];
    const bv = b[k] || 0;
    dot += av * bv;
    aa += av * av;
  }
  const bkeys = Object.keys(b);
  for (let i = 0; i < bkeys.length; i += 1) bb += b[bkeys[i]] * b[bkeys[i]];
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}

function buildModel(documents, options) {
  const opts = Object.assign({ windowSize: 4, minCount: 1 }, options || {});
  const contexts = {};
  const counts = {};
  for (let d = 0; d < documents.length; d += 1) {
    const words = tokenize(documents[d]);
    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      add(counts, word, 1);
      if (!contexts[word]) contexts[word] = {};
      const start = Math.max(0, i - opts.windowSize);
      const end = Math.min(words.length - 1, i + opts.windowSize);
      for (let j = start; j <= end; j += 1) {
        if (j !== i) add(contexts[word], words[j], 1 / Math.abs(i - j));
      }
    }
  }
  const vocabulary = Object.keys(counts).filter((w) => counts[w] >= opts.minCount).sort();
  return { sourceUrl: SOURCE_URL, windowSize: opts.windowSize, vocabulary, counts, contexts };
}

function similarity(model, left, right) {
  return cosine(model.contexts[String(left).toLowerCase()] || {}, model.contexts[String(right).toLowerCase()] || {});
}

function nearest(model, word, limit) {
  const target = String(word).toLowerCase();
  return model.vocabulary
    .filter((candidate) => candidate !== target)
    .map((candidate) => ({ word: candidate, score: similarity(model, target, candidate) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
    .slice(0, limit || 10);
}

function inferRelations(model, options) {
  const opts = Object.assign({ limitPerWord: 5, threshold: 0.1 }, options || {});
  const relations = [];
  for (let i = 0; i < model.vocabulary.length; i += 1) {
    const source = model.vocabulary[i];
    const neighbors = nearest(model, source, opts.limitPerWord);
    for (let j = 0; j < neighbors.length; j += 1) {
      if (neighbors[j].score >= opts.threshold) {
        relations.push({ source, relation: 'distributionally_similar_to', target: neighbors[j].word, confidence: Number(neighbors[j].score.toFixed(6)) });
      }
    }
  }
  return relations;
}

function makeDiseminer(documents, options) {
  const model = buildModel(documents || [], options);
  return { model, similarity: (a, b) => similarity(model, a, b), nearest: (w, n) => nearest(model, w, n), inferRelations: (o) => inferRelations(model, o) };
}

module.exports = { id: 'diseminer-distributional-semantics-inference-maker', title: 'DISEMINER: Distributional Semantics Inference Maker', sourceUrl: SOURCE_URL, tokenize, buildModel, similarity, nearest, inferRelations, create: makeDiseminer };
