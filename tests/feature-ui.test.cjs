/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner; isolated component event/render checks without browser dependencies. */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
function loader(overrides={}){const cache=new Map();return function load(file){file=path.resolve(__dirname,'..',file);if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',code)(id=>{if(id in overrides)return overrides[id];if(id.startsWith('@/')){const base=id.slice(2);return load(base+(fs.existsSync(path.resolve(__dirname,'..',base+'.ts'))?'.ts':'.tsx'));}return require(id);},mod,mod.exports);return mod.exports;};}
function find(element,predicate){if(!element||typeof element!=='object')return; if(predicate(element))return element;for(const child of React.Children.toArray(element.props?.children)){const match=find(child,predicate);if(match)return match;}}

test('discovery renders counts/empty state and Clear Filters invokes the shared reset',()=>{
 const base=loader();const {products}=base('features/catalog/catalog.ts');let filters={query:'no-match-xyz',category:'All',sort:'price-desc',featured:false};let resets=0;
 const load=loader({'@/features/catalog/DiscoveryProvider':{useDiscovery:()=>({filters,setFilters:value=>{filters=typeof value==='function'?value(filters):value},selectCategory:category=>{filters={...filters,category,featured:false}},reset:()=>{resets++;filters={query:'',category:'All',sort:'default',featured:false}}})},'@/features/cart/BagProvider':{useBag:()=>({ready:true,store:{add(){}}})},react:{...React,useRef:()=>({current:null})}});
 const Discovery=load('features/catalog/ProductDiscovery.tsx').default;
 let html=renderToStaticMarkup(React.createElement(Discovery,{products})).replace(/<!--[\s\S]*?-->/g,'');assert(html.includes('0 products shown'));assert(html.includes('A little change of search?'));assert(!html.includes('<article '));
 const tree=Discovery({products});find(tree,e=>e.type==='button'&&e.props.children==='Clear Filters ×').props.onClick();assert.equal(resets,1);assert.deepEqual(filters,{query:'',category:'All',sort:'default',featured:false});
 html=renderToStaticMarkup(React.createElement(Discovery,{products})).replace(/<!--[\s\S]*?-->/g,'');assert(html.includes('30 products shown'));assert.equal((html.match(/<article /g)||[]).length,30);
});

test('promo form rejects invalid codes, applies normalized GLOW20, and removes it',()=>{
 let slots=[],cursor=0,applied='';const actions=[];
 const load=loader({react:{...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=value}];}}});
 const Form=load('features/cart/PromoForm.tsx').default;
 const render=()=>{cursor=0;return Form({appliedCode:applied,onApply:code=>{actions.push(code);applied=code;}})};
 find(render(),e=>e.type==='input').props.onChange({target:{value:'wrong'}});render().props.onSubmit({preventDefault(){}});assert.equal(actions.length,0);assert(find(render(),e=>e.props?.role==='status').props.children.includes('Try GLOW20'));
 find(render(),e=>e.type==='input').props.onChange({target:{value:' glow20 '}});render().props.onSubmit({preventDefault(){}});assert.equal(applied,'GLOW20');assert.equal(find(render(),e=>e.type==='input').props.readOnly,true);
 render().props.onSubmit({preventDefault(){}});assert.equal(applied,'');assert.deepEqual(actions,['GLOW20','']);
});

test('bag provider server render never reads browser storage and exposes hydration-safe empty state',()=>{
 const load=loader();const {products}=load('features/catalog/catalog.ts');const {BagProvider,useBag}=load('features/cart/BagProvider.tsx');function Probe(){const bag=useBag();return React.createElement('p',null,JSON.stringify({ready:bag.ready,count:bag.totals.count}));}
 const html=renderToStaticMarkup(React.createElement(BagProvider,{products},React.createElement(Probe)));assert(html.includes('&quot;ready&quot;:false'));assert(html.includes('&quot;count&quot;:0'));
});

test('header category navigation updates the real shared discovery state and listing controls',()=>{
 let slots=[],cursor=0;
 const providerLoad=loader({react:{...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}];}}});
 const Provider=providerLoad('features/catalog/DiscoveryProvider.tsx').DiscoveryProvider;
 function context(){cursor=0;return Provider({children:null}).props.value;}
 let shared=context();shared.setFilters({query:'rose',category:'All',sort:'price-desc',featured:false});shared=context();
 const hooks={...React,useRef:()=>({current:null}),useState:()=>[false,()=>{}],useEffect(){}};
 const load=loader({react:hooks,'next/navigation':{usePathname:()=>'/products'},'@/features/catalog/DiscoveryProvider':{useDiscovery:()=>shared},'@/features/cart/BagProvider':{useBag:()=>({ready:true,store:{add(){}}})}});
 const Nav=load('components/layout/HeaderNavigation.tsx').default;
 find(Nav({logo:null,actions:null}),e=>e.props?.children==='SKIN CARE').props.onClick();shared=context();
 assert.equal(shared.filters.category,'Skin Care');assert.equal(shared.filters.query,'rose');assert.equal(shared.filters.sort,'price-desc');
 const {products}=load('features/catalog/catalog.ts');const Discovery=load('features/catalog/ProductDiscovery.tsx').default;
 const controls=find(Discovery({products}),e=>e.type?.name==='CatalogControls');assert.equal(controls.props.filters,shared.filters);
 const html=renderToStaticMarkup(React.createElement(Discovery,{products}));assert(html.includes('value="Skin Care" selected'));assert(html.includes('value="price-desc" selected'));
 find(Nav({logo:null,actions:null}),e=>e.props?.children==='SHOP').props.onClick();shared=context();assert.deepEqual(shared.filters,{query:'',category:'All',sort:'default',featured:false});
});

test('card/detail add actions update the header count, bag quantities, removal and empty state',()=>{
 const base=loader();const {products}=base('features/catalog/catalog.ts');const {createBagStore}=base('features/cart/bag.store.ts');const {cartTotals}=base('features/cart/cart.logic.ts');const store=createBagStore(products);store.hydrate();
 const useBag=()=>({...store.getSnapshot(),products,store,totals:cartTotals(store.getSnapshot().items,store.getSnapshot().promoCode,products)});
 const load=loader({react:{...React,useRef:()=>({current:null})},'@/features/cart/BagProvider':{useBag},'@/features/catalog/DiscoveryProvider':{useDiscovery:()=>({searchOpen:false,setSearchOpen(){}})}});
 const Add=load('features/cart/AddToBagButton.tsx').default;const Card=load('features/catalog/ProductCard.tsx').default;const Detail=load('features/catalog/ProductDetails.tsx').default;
 for(const Component of [Card,Detail]){const button=find(Component({product:products[0]}),e=>e.type===Add);assert(button);Add(button.props).props.onClick();}
 assert.equal(store.getSnapshot().items[0].quantity,2);
 const Actions=load('components/layout/HeaderActions.tsx').default;assert.equal(find(Actions(),e=>e.props?.href==='/bag').props['aria-label'],'Open shopping bag, 2 items');
 const Bag=load('features/cart/ShoppingBag.tsx').default;const Row=load('features/cart/CartRow.tsx').default;
 let row=find(Bag(),e=>e.type===Row);find(Row(row.props),e=>e.props?.['aria-label']==='Increase quantity of Velvet Body Cream').props.onClick();assert.equal(store.getSnapshot().items[0].quantity,3);
 row=find(Bag(),e=>e.type===Row);find(Row(row.props),e=>e.props?.['aria-label']==='Decrease quantity of Velvet Body Cream').props.onClick();assert.equal(store.getSnapshot().items[0].quantity,2);
 row=find(Bag(),e=>e.type===Row);find(Row(row.props),e=>e.props?.['aria-label']==='Remove Velvet Body Cream').props.onClick();assert.equal(store.getSnapshot().items.length,0);
 assert.equal(find(Actions(),e=>e.props?.href==='/bag').props['aria-label'],'Open shopping bag, 0 items');assert(renderToStaticMarkup(React.createElement(Bag)).includes('Your shopping bag is empty.'));
});
