import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {analyse,render} from '../src/index.js';import {parseCSV,toCSV,escape} from '../src/util.js';
const data=JSON.parse(fs.readFileSync(new URL('../examples/input.json',import.meta.url),'utf8'));
test('the complete synthetic example produces a readable report',()=>{const r=analyse(data);assert.ok(r.title);assert.ok(r.summary);assert.match(render(r),/<h2>/);assert.ok(Array.isArray(r.issues));});
test('quoted CSV and dangerous spreadsheet values remain safe',()=>{assert.equal(parseCSV('id,note\r\n1,"one, two"')[0].note,'one, two');assert.throws(()=>parseCSV('id,note\n1,"unclosed'),/Unclosed/);assert.match(toCSV([{name:'=HYPERLINK("x")'}]),/'=HYPERLINK/);});
test('HTML escaping never emits an executable supplied tag',()=>{assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;');});

test('anonymous publication excludes exact identity and unsupported results',()=>{const r=analyse(data);assert.doesNotMatch(JSON.stringify(r),/PRIVATE CLIENT|PRIVATE EXACT|70 percent/);assert.equal(r.approved.length,1);});
test('permission is a real publication gate',()=>{const d=structuredClone(data);d.publication_permission=false;const r=analyse(d);assert.equal(r.sections.length,0);assert.doesNotMatch(render(r),/phased access/);});
test('approved evidence still needs a source reference',()=>{const d=structuredClone(data);d.evidence=[{text:'Unsubstantiated result',approved:true,source:''}];assert.equal(analyse(d).approved.length,0);});
