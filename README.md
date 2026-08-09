# urban-couscous

## Pure JavaScript research modules

This project contains five independent, dependency-free CommonJS modules built from the supplied research PDFs. They are not metadata placeholders: each file exports runnable functions that can be used on its own with `require()`.

```js
const { diseminer, graphStateSpace } = require('./src/research-modules');

const semantic = diseminer.create(['stars guide agents', 'agents guide realms']);
console.log(semantic.nearest('agents'));

const model = graphStateSpace.createGraphStateSpace({ stateSize: 2 });
console.log(model.predict([1, 0], 3));
```

Included modules:

- `historical-change-in-language` tracks lexical or concept vectors through dated slices and reports stability and change vectors.
- `graph-state-space-models-2301-01741` implements a lightweight graph state-space simulator plus latent graph inference from correlated time series.
- `diseminer-distributional-semantics-inference-maker` builds distributional context vectors, scores semantic similarity, returns nearest neighbors, and emits inference relations.
- `autoling-1968-uwcs-tech-report-43` performs rule-oriented tokenization, lexicon lookup, suffix tagging, and chunking.
- `automatic-novel-writing-1979-1973` builds a story world, outlines plot beats, renders chapters, and returns a generated novel object.

The index also provides compatibility helpers:

```js
const {
  getResearchModules,
  getResearchModuleById,
  attachResearchModules,
} = require('./src/research-modules');

const modules = getResearchModules();
const diseminerModule = getResearchModuleById('diseminer-distributional-semantics-inference-maker');
const universeWithResearch = attachResearchModules({ id: 'demo' });
```
