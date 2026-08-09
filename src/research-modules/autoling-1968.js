'use strict';

const SOURCE_URL = 'https://pages.cs.wisc.edu/~sklein/Autoling-1968%20UWCS%20Tech%20Rept-%2343.pdf';

function tokenize(sentence) { return String(sentence || '').match(/[A-Za-z0-9']+|[.,!?;]/g) || []; }
function lexiconEntry(word, tag, features) { return { word: String(word).toLowerCase(), tag, features: Object.assign({}, features || {}) }; }
function createAutoling(entries) {
  const lexicon = {};
  (entries || []).forEach((e) => { lexicon[e.word] = e; });
  const suffixRules = [{ suffix: 'ing', tag: 'VERB' }, { suffix: 'ed', tag: 'VERB' }, { suffix: 'ly', tag: 'ADV' }, { suffix: 'ous', tag: 'ADJ' }, { suffix: 'ness', tag: 'NOUN' }];
  function tag(word) {
    const lower = String(word).toLowerCase();
    if (lexicon[lower]) return lexicon[lower].tag;
    if (/^[.,!?;]$/.test(lower)) return 'PUNCT';
    for (let i = 0; i < suffixRules.length; i += 1) if (lower.endsWith(suffixRules[i].suffix)) return suffixRules[i].tag;
    return 'UNKNOWN';
  }
  return {
    add(word, partOfSpeech, features) { lexicon[String(word).toLowerCase()] = lexiconEntry(word, partOfSpeech, features); return this; },
    analyze(sentence) { return tokenize(sentence).map((word) => ({ token: word, tag: tag(word) })); },
    chunks(sentence) {
      const tagged = this.analyze(sentence); const chunks = []; let current = [];
      tagged.forEach((t) => { if (t.tag === 'PUNCT') { if (current.length) chunks.push(current); current = []; } else current.push(t); });
      if (current.length) chunks.push(current); return chunks;
    },
  };
}

module.exports = { id: 'autoling-1968-uwcs-tech-report-43', title: 'Autoling 1968 UWCS Technical Report #43', sourceUrl: SOURCE_URL, tokenize, lexiconEntry, create: createAutoling };
