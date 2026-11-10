/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test runner and in-memory TypeScript module loader. */
﻿const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const loaded = new Map();
// Execute pure TypeScript modules without adding a test-runner dependency.
function load(file) {
  file = path.resolve(__dirname, '..', file);
  if (loaded.has(file)) return loaded.get(file).exports;
  const mod = { exports: {} }; loaded.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(id => {
    if (id.startsWith('@/')) return load(id.slice(2) + '.ts');
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  }, mod, mod.exports);
  return mod.exports;
}
const { products } = load('features/catalog/catalog.ts');
const { findProducts, productCategories } = load('features/catalog/products.logic.ts');
const { normalizeCart, cartTotals } = load('features/cart/cart.logic.ts');
const { createBagStore, BAG_KEY, LEGACY_BAG_KEY } = load('features/cart/bag.store.ts');
function storage(seed = {}) { const data = new Map(Object.entries(seed)); return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }; }

test('search is case insensitive and combines category then stable price sorting', () => {
  const before = products.map(p => p.id);
  assert.deepEqual(findProducts('All', '  rOsE  ', false, 'default', products), products.filter(p => p.name.toLowerCase().includes('rose')));
  for (const category of productCategories) {
    assert(findProducts(category, '', false, 'default', products).every(p => p.category === category));
    for (const sort of ['price-asc', 'price-desc']) {
      const result = findProducts(category, 'rose', false, sort, products);
      assert.deepEqual(result.map(p => p.id), products.filter(p => p.category === category && p.name.toLowerCase().includes('rose')).sort((a,b) => sort === 'price-asc' ? a.price-b.price : b.price-a.price).map(p => p.id));
    }
  }
  assert.equal(findProducts('All', 'no-match-xyz', false, 'default', products).length, 0);
  assert.equal(findProducts('All', '', false, 'default', products).length, products.length);
  assert.deepEqual(products.map(p => p.id), before);
});

test('normalization rejects unknown/bad lines, merges duplicates, and ignores stored prices', () => {
  assert.deepEqual(normalizeCart([{id:'body-cream',quantity:2,price:1},{id:'body-cream',quantity:100},{id:'unknown',quantity:1},{id:'shampoo',quantity:1.5},null,{id:'serum',quantity:-1}], products), [{id:'body-cream',quantity:99}]);
  assert.deepEqual(normalizeCart({items:[]}, products), []);
});

test('GLOW20 rounding, shipping boundaries, invalid promo and empty totals match source rules', () => {
  const bag = [{id:'body-cream',quantity:1}];
  assert.deepEqual(cartTotals(bag, ' glow20 ', products), {count:1,subtotal:2799,discount:560,merchandise:2239,shipping:595,total:2834});
  assert.equal(cartTotals(bag,'invalid',products).discount,0);
  for (const [price,code,shipping] of [[5000,'',595],[5001,'',0],[6250,'GLOW20',595],[6251,'GLOW20',0]]) {
    assert.equal(cartTotals(bag,code,[{...products[0],price}]).shipping,shipping);
  }
  assert.equal(cartTotals([], 'GLOW20', products).total,0);
});

test('hydration never overwrites storage; refresh restores canonical bag and promo', () => {
  const disk = storage({[BAG_KEY]:JSON.stringify({items:[{id:'body-cream',quantity:2}],promoCode:'GLOW20'})});
  const original = disk.getItem(BAG_KEY);
  const store = createBagStore(products);
  assert.equal(store.getServerSnapshot().ready,false);
  assert.deepEqual(store.getServerSnapshot().items,[]);
  assert.equal(store.add('body-cream'),false);
  assert.equal(disk.getItem(BAG_KEY),original);
  store.hydrate(disk); assert.equal(disk.getItem(BAG_KEY),original);
  store.add('shampoo');
  const next = createBagStore(products); next.hydrate(disk);
  assert.deepEqual(next.getSnapshot().items,store.getSnapshot().items);
  assert.equal(next.getSnapshot().promoCode,'GLOW20');
  assert.deepEqual(store.getServerSnapshot().items,[]);
  assert.deepEqual(Object.keys(JSON.parse(disk.getItem(BAG_KEY))).sort(),['items','promoCode']);
});

test('legacy keys, corrupt storage, invalid promo and blocked storage recover safely', () => {
  const old = createBagStore(products); old.hydrate(storage({[LEGACY_BAG_KEY]:JSON.stringify({items:[{id:'body-cream',quantity:3}],promoCode:'GLOW20'})}));
  assert.equal(old.getSnapshot().items[0].quantity,3);
  for (const value of ['{broken','null','[]','{"items":"bad","promoCode":"bad"}']) {
    const store=createBagStore(products);store.hydrate(storage({[BAG_KEY]:value}));assert.deepEqual(store.getSnapshot().items,[]);assert.equal(store.getSnapshot().promoCode,'');assert.equal(store.getSnapshot().ready,true);
  }
  const blocked=createBagStore(products);blocked.hydrate({getItem(){throw Error('blocked')},setItem(){throw Error('quota')}});assert.equal(blocked.add('body-cream'),true);assert.equal(blocked.getSnapshot().items[0].quantity,1);
});

test('add/remove/change/clear enforce limits, preserve previous snapshots, and notify subscribers', () => {
  const store=createBagStore(products);store.hydrate(storage());let notifications=0;const unsubscribe=store.subscribe(()=>notifications++);
  assert.equal(store.add('missing'),false);
  store.add('body-cream');const before=store.getSnapshot();store.changeQuantity('body-cream',200);assert.equal(before.items[0].quantity,1);assert.equal(store.getSnapshot().items[0].quantity,99);assert.equal(store.add('body-cream'),false);
  store.changeQuantity('body-cream',1.5);assert.equal(store.getSnapshot().items[0].quantity,99);
  store.changeQuantity('body-cream',-99);assert.equal(store.getSnapshot().items.length,0);
  store.add('shampoo');store.remove('shampoo');assert.equal(store.getSnapshot().items.length,0);
  store.add('body-cream');store.setPromoCode('GLOW20');store.clear();assert.deepEqual(store.getSnapshot().items,[]);assert.equal(store.getSnapshot().promoCode,'');assert(notifications>0);unsubscribe();const count=notifications;store.add('body-cream');assert.equal(notifications,count);
});

test('legacy storage is migrated on the next save without deleting the old key',()=>{
 const legacy=JSON.stringify({items:[{id:'body-cream',quantity:2}],promoCode:'GLOW20'});const disk=storage({[LEGACY_BAG_KEY]:legacy});const store=createBagStore(products);store.hydrate(disk);assert.equal(disk.getItem(BAG_KEY),null);store.add('shampoo');assert.equal(disk.getItem(LEGACY_BAG_KEY),legacy);const restored=createBagStore(products);restored.hydrate(disk);assert.deepEqual(restored.getSnapshot().items,store.getSnapshot().items);assert.equal(restored.getSnapshot().promoCode,'GLOW20');
});
