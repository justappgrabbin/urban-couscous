'use strict';

const SOURCE_URL = 'https://pages.cs.wisc.edu/~sklein/Automatic%20Novel%20Writing-1979-(1973)-W%20de%20GruyterNY.pdf';

function pick(list, seed) { return list[Math.abs(seed) % list.length]; }
function hash(text) { let h = 0; for (let i = 0; i < String(text).length; i += 1) h = ((h << 5) - h + String(text).charCodeAt(i)) | 0; return h; }
function createStoryWorld(config) {
  const c = Object.assign({ theme: 'change', setting: 'the youniverse', hero: 'the agent', desire: 'understanding', obstacle: 'confusion' }, config || {});
  return { theme: c.theme, setting: c.setting, characters: [{ role: 'protagonist', name: c.hero, desire: c.desire }, { role: 'opposition', name: c.obstacle, desire: 'delay' }] };
}
function outline(world, chapters) {
  const beats = ['arrival', 'discovery', 'complication', 'reversal', 'choice', 'resolution'];
  const n = chapters || 6;
  const rows = [];
  for (let i = 0; i < n; i += 1) rows.push({ chapter: i + 1, beat: beats[i % beats.length], focus: world.characters[i % world.characters.length].name, conflict: world.theme });
  return rows;
}
function renderChapter(world, beat) {
  const openers = ['At dawn', 'In the quiet hour', 'Beyond the familiar gate', 'After the signal changed'];
  const h = hash(world.theme + beat.chapter + beat.beat);
  return `${pick(openers, h)}, ${beat.focus} moved through ${world.setting}. The chapter of ${beat.beat} tested ${world.theme}: desire met resistance, memory became evidence, and every choice made the world more specific.`;
}
function writeNovel(config) {
  const world = createStoryWorld(config);
  const plan = outline(world, config && config.chapters);
  return { title: (config && config.title) || `A Novel of ${world.theme}`, world, outline: plan, chapters: plan.map((beat) => renderChapter(world, beat)) };
}

module.exports = { id: 'automatic-novel-writing-1979-1973', title: 'Automatic Novel Writing', sourceUrl: SOURCE_URL, createStoryWorld, outline, renderChapter, writeNovel };
