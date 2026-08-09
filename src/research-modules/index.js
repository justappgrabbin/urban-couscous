'use strict';

const historicalChangeInLanguage = require('./historical-change-in-language');
const graphStateSpace = require('./llm-change-paper');
const diseminer = require('./diseminer');
const autoling1968 = require('./autoling-1968');
const automaticNovelWriting = require('./automatic-novel-writing');

const researchModules = [historicalChangeInLanguage, graphStateSpace, diseminer, autoling1968, automaticNovelWriting];

function copyModule(moduleDefinition) { return Object.assign({}, moduleDefinition); }
function getResearchModules() { return researchModules.map(copyModule); }
function getResearchModuleById(id) { return researchModules.find((m) => m.id === id || m.legacyId === id) || null; }
function attachResearchModules(indiverse) { return Object.assign({}, indiverse || {}, { research_modules: getResearchModules() }); }

module.exports = { researchModules, getResearchModules, getResearchModuleById, attachResearchModules, historicalChangeInLanguage, graphStateSpace, diseminer, autoling1968, automaticNovelWriting };
