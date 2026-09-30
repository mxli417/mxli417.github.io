// Run with node scripts/check-two-drawer.cjs. No dependencies required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/two-drawer-search.js', 'utf8');
const elements = {};
const context = { document: { addEventListener() {}, getElementById: id => elements[id] } };
vm.createContext(context);
vm.runInContext(source.replace('document.addEventListener("DOMContentLoaded", initWidget);',
  'globalThis.model = { findBestAllocation, probabilityOfSuccess, posteriorAfterFailure, validateParams, initWidget };'), context);
const m = context.model;
const base = {p1: 2/3, budget: 2, a1: 1, a2: 1, c1: 1, c2: 1};
const near = (a,b) => assert.ok(Math.abs(a-b) < 1e-10, `${a} != ${b}`);
const optimum = m.findBestAllocation(base);
near(optimum.t1, (2+Math.log(2))/2);
near(optimum.t2, (2-Math.log(2))/2);
near(m.posteriorAfterFailure(base, optimum.t1, optimum.t2).p1Posterior, .5);
for (const budget of [.1, .5, Math.log(2)]) {
  const best = m.findBestAllocation({...base, budget});
  near(best.t1, budget); near(best.t2, 0);
}
for (const p1 of [.01, .2, .5, 2/3, .99]) {
  for (const budget of [.1, 2, 30]) {
    for (const [a1,a2,c1,c2] of [[1,1,1,1],[.35,.25,1,1],[2,.2,3,.5],[.01,10,.1,5]]) {
      const p = {p1,budget,a1,a2,c1,c2}, best = m.findBestAllocation(p);
      near(c1*best.t1+c2*best.t2, budget);
      assert.ok(best.t1 >= 0 && best.t2 >= 0);
      for (let i=0; i<=2000; i++) {
        const t1 = budget/c1*i/2000, t2 = (budget-c1*t1)/c2;
        assert.ok(best.value + 1e-12 >= m.probabilityOfSuccess(p,t1,t2));
      }
      const posterior = m.posteriorAfterFailure(p,best.t1,best.t2);
      near(posterior.p1Posterior+posterior.p2Posterior,1);
    }
  }
}
near(m.posteriorAfterFailure(base,1000,1000).p1Posterior,2/3);
assert.ok(m.validateParams({...base,c1:0}).length);
assert.ok(m.validateParams({...base,p1:NaN}).length);
// Exercise the real initialization, drawing, input validation and reset handlers.
const noop = () => {};
const ctx = new Proxy({}, {get: (o,k) => o[k] || noop});
for (const id of ['widget','result','reset','p1-value','p2-value','budget-value'])
  elements['two-drawer-'+id] = {addEventListener(event,fn) { this[event] = fn; }};
for (const [key,value] of Object.entries(base))
  elements['two-drawer-'+key] = {value,addEventListener(event,fn) { this[event] = fn; }};
elements['two-drawer-heatmap'] = {width:720,height:520,getContext:()=>ctx};
m.initWidget();
assert.match(elements['two-drawer-result'].innerHTML,/65.3%/);
elements['two-drawer-c1'].value = '';
elements['two-drawer-c1'].input();
assert.equal(elements['two-drawer-heatmap'].hidden,true);
elements['two-drawer-reset'].click();
assert.equal(elements['two-drawer-heatmap'].hidden,false);
assert.match(elements['two-drawer-result'].innerHTML,/65.3%/);
console.log('PASS: analytical example, boundary cases, 60 parameter sets vs dense grid, stable posterior, widget events.');
