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

test('Home and Shop keep independent filters and Home category navigation stays local',()=>{
 let slots=[],cursor=0,context,route='/products';
 const react={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},useContext:()=>context};
 const local=loader({react,'next/navigation':{usePathname:()=>route}});const {DiscoveryProvider,useDiscovery}=local('features/catalog/DiscoveryProvider.tsx');const refresh=()=>{cursor=0;context=DiscoveryProvider({children:null}).props.value};refresh();useDiscovery().setFilters({query:'serum',category:'All',sort:'price-asc',featured:false});refresh();route='/';assert.equal(useDiscovery().filters.featured,true);
 let focused=0;const navLoad=loader({react:{...React,useState:()=>[false,()=>{}],useRef:()=>({current:null}),useEffect(){}},'next/navigation':{usePathname:()=>route},'@/features/catalog/DiscoveryProvider':{useDiscovery,focusCollection:()=>{focused++}}});const Nav=navLoad('components/layout/HeaderNavigation.tsx').default;
 const category=find(Nav({logo:null,actions:null}),e=>e.props?.children==='SKIN CARE');assert.equal(category.type,'button');category.props.onClick();refresh();assert.equal(useDiscovery().filters.category,'Skin Care');assert.equal(focused,1);assert.equal(route,'/');
 route='/products';assert.equal(useDiscovery().filters.query,'serum');assert.equal(useDiscovery().filters.sort,'price-asc');assert.equal(useDiscovery().filters.category,'All');
});

test('catalog error/empty/loading feedback differs from no-match and wires retry',()=>{
 let phase='error',retries=0;const {products}=loader()('features/catalog/catalog.ts');
 const local=loader({react:{...React,useRef:()=>({current:null})},'@/features/catalog/DiscoveryProvider':{useDiscovery:()=>({filters:{query:'',category:'All',sort:'default',featured:false},setFilters(){},selectCategory(){},reset(){}})},'@/features/cart/BagProvider':{useBag:()=>({products:phase==='ready'?products:[],catalogPhase:phase,retryCatalog:()=>{retries++},ready:true,store:{add(){}}})}});const Discovery=local('features/catalog/ProductDiscovery.tsx').default;
 for(const [value,text]of [['error','Unable to load products'],['empty','The collection is taking a little pause.'],['loading','Loading ROSEVEIL products']]){phase=value;const html=renderToStaticMarkup(React.createElement(Discovery,{products}));assert(html.includes(text));assert(!html.includes('A little change of search?'));assert(!html.includes('<article '));}
 phase='error';find(Discovery({products}),e=>e.props?.children==='Try Again').props.onClick();assert.equal(retries,1);
});

test('bag modal is controlled by the existing provider with explicit title, description and focus restoration',()=>{
 const {products}=loader()('features/catalog/catalog.ts');let slots=[],cursor=0,context;const target={};
 const react={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},useContext:()=>context,useSyncExternalStore:(_s,get)=>get(),useEffect(){}};
 const local=loader({react,'next/navigation':{usePathname:()=>'/products'}});const {BagProvider}=local('features/cart/BagProvider.tsx');function render(){cursor=0;const tree=BagProvider({products,children:null});context=tree.props.value;return tree.props.children;}
 render();context.store.hydrate();context.store.openModal();const root=render();assert.equal(root.props.open,true);const modal=find(root,e=>e.type?.name==='BagModal').type();assert.equal(modal.props.id,'shopping-bag-dialog');const old=global.document;global.document={getElementById:id=>id==='cart-button'?target:null};try{assert.equal(modal.props.finalFocus(),target)}finally{global.document=old}
 const header=modal.props.children[0];assert.equal(header.props.children[0].props.children,'Your Shopping Bag');assert(header.props.children[1].props.children.includes('Review your items'));root.props.onOpenChange(false);assert.equal(context.store.getSnapshot().modalOpen,false);
});

test('unavailable bag prices retain lines but block checkout until catalog recovers',()=>{
 const base=loader();const {products}=base('features/catalog/catalog.ts');const {createBagStore}=base('features/cart/bag.store.ts');const {cartTotals}=base('features/cart/cart.logic.ts');const store=createBagStore(products);store.hydrate();store.add('body-cream');let available=false;
 const local=loader({react:{...React,useRef:()=>({current:null})},'@/features/cart/BagProvider':{useBag:()=>({...store.getSnapshot(),products:available?products:[],store,pricesAvailable:available,catalogPhase:available?'ready':'error',retryCatalog(){available=true},totals:cartTotals(store.getSnapshot().items,'',products)})}});const Bag=local('features/cart/ShoppingBag.tsx').default;assert(!find(Bag(),e=>e.props?.href==='/checkout'));assert(renderToStaticMarkup(React.createElement(Bag)).includes('Product prices are unavailable. Your saved bag is safe.'));find(Bag(),e=>e.props?.children==='Try again').props.onClick();assert(find(Bag(),e=>e.props?.href==='/checkout'));assert.equal(store.getSnapshot().items.length,1);
});

test('detail price stays unavailable until a successful catalog retry',()=>{
 const {products}=loader()('features/catalog/catalog.ts');let phase='error';
 const local=loader({'@/features/cart/BagProvider':{useBag:()=>({products,catalogPhase:phase,retryCatalog(){phase='ready'}})}});
 const Price=local('features/catalog/ProductPrice.tsx').default;
 assert(renderToStaticMarkup(React.createElement(Price,{id:'body-cream'})).includes('Price unavailable'));
 find(Price({id:'body-cream'}),e=>e.type==='button').props.onClick();
 const html=renderToStaticMarkup(React.createElement(Price,{id:'body-cream'}));assert(!html.includes('Price unavailable'));assert(html.includes('USD'));
});

test('successful adds alone restart bag feedback and repeated clipboard notifications stay visible',async()=>{
 const base=loader();const {products}=base('features/catalog/catalog.ts');const store=base('features/cart/bag.store.ts').createBagStore(products);store.hydrate();assert.equal(store.getSnapshot().bagFeedback,0);store.add('body-cream');store.add('body-cream');assert.equal(store.getSnapshot().bagFeedback,2);store.changeQuantity('body-cream',1);assert.equal(store.getSnapshot().bagFeedback,2);
 const local=loader({'@/features/cart/BagProvider':{useBag:()=>({...store.getSnapshot(),store,totals:{count:3}})},'@/features/catalog/DiscoveryProvider':{useDiscovery:()=>({searchOpen:false,setSearchOpen(){}})}});
 const Header=local('components/layout/HeaderActions.tsx').default;const icon=find(Header(),e=>e.key?.endsWith('bag-icon-2')),count=find(Header(),e=>e.key?.endsWith('bag-count-2'));assert(icon.props.className.includes('motion-safe:animate-'));assert(count.props.className.includes('360ms'));
 const Announcement=local('components/layout/AnnouncementBar.tsx').default;const descriptor=Object.getOwnPropertyDescriptor(global,'navigator');Object.defineProperty(global,'navigator',{configurable:true,value:{clipboard:{async writeText(value){assert.equal(value,'GLOW20')}}}});
 try{const click=()=>find(Announcement(),e=>e.type==='button').props.onClick();await click();const first=store.getSnapshot();assert.equal(first.message,'GLOW20 copied! Apply it in your bag for 20% off.');await click();assert.equal(store.getSnapshot().revision,first.revision+1);assert.equal(store.getSnapshot().message,first.message);global.navigator.clipboard.writeText=async()=>{throw Error('blocked')};await click();assert.equal(store.getSnapshot().message,'Could not copy GLOW20. Enter it manually in your bag for 20% off.');store.clearMessage();assert.equal(store.getSnapshot().message,'')}finally{if(descriptor)Object.defineProperty(global,'navigator',descriptor);else delete global.navigator}
});

test('visible shared toast restarts its timer and announcement key for identical notifications',()=>{
 const {products}=loader()('features/catalog/catalog.ts');let slots=[],cursor=0,context,effects=[];
 const react={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],next=>{slots[i]=next}]},useContext:()=>context,useSyncExternalStore:(_subscribe,get)=>get(),useEffect:(effect,deps)=>{effects.push([effect,deps])}};
 const local=loader({react,'next/navigation':{usePathname:()=>'/products'}});const Provider=local('features/cart/BagProvider.tsx').BagProvider;cursor=0;const tree=Provider({products,children:null});context=tree.props.value;context.store.hydrate();const Feedback=find(tree,e=>e.type?.name==='BagFeedback').type;
 const oldSet=global.setTimeout,oldClear=global.clearTimeout;let scheduled=0,cleared=0,callback;
 global.setTimeout=(fn,delay)=>{assert.equal(delay,3800);callback=fn;return ++scheduled};global.clearTimeout=()=>{cleared++};
 try{context.store.notify('Same message');effects=[];const first=Feedback();const [effect,deps]=effects[0];const cleanup=effect();assert(first.props.className.includes('fixed'));context.store.notify('Same message');effects=[];const second=Feedback();assert.notEqual(first.props.children.key,second.props.children.key);assert.notEqual(deps[1],effects[0][1][1]);cleanup();effects[0][0]();assert.equal(scheduled,2);assert.equal(cleared,1);callback();assert.equal(context.store.getSnapshot().message,'')}finally{global.setTimeout=oldSet;global.clearTimeout=oldClear}
});

test('Makeup collection tab filters canonical products and synchronizes Home controls and Shop navigation',()=>{
 let slots=[],cursor=0,context,route='/';
 const react={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},useContext:()=>context,useRef:()=>({current:null}),useEffect(){}};
 const local=loader({react,'next/navigation':{usePathname:()=>route},'@/features/cart/BagProvider':{useBag:()=>({ready:true,store:{add(){}}})}});
 const {DiscoveryProvider}=local('features/catalog/DiscoveryProvider.tsx');const Discovery=local('features/catalog/ProductDiscovery.tsx').default;const Controls=local('features/catalog/CatalogControls.tsx').default;const Grid=local('features/catalog/ProductGrid.tsx').default;const Nav=local('components/layout/HeaderNavigation.tsx').default;const {products}=local('features/catalog/catalog.ts');
 function refresh(){cursor=0;context=DiscoveryProvider({children:null}).props.value}function discovery(){cursor=3;return Discovery({products})}refresh();
 const nav=find(discovery(),e=>e.props?.['aria-label']==='Beauty collections');assert.deepEqual(React.Children.toArray(nav.props.children).map(e=>e.props.children),['All Beauty','Body Care','Skin Care','Makeup','Hair Care','Gift Sets']);
 find(nav,e=>e.type==='button'&&e.props.children==='Makeup').props.onClick();refresh();let tree=discovery();assert.equal(find(tree,e=>e.props?.children==='Makeup'&&e.type==='button').props['aria-current'],'true');
 const expected=products.filter(product=>product.category==='Makeup');assert(expected.length>0);assert.deepEqual(find(tree,e=>e.type===Grid).props.products,expected);assert.equal(find(tree,e=>e.type===Controls).props.filters.category,'Makeup');assert.equal(find(tree,e=>e.type===Controls).props.filters.featured,false);
 const controls=find(tree,e=>e.type===Controls);find(Controls(controls.props),e=>e.props?.id==='category-select').props.onChange({target:{value:'Skin Care'}});refresh();assert.equal(find(discovery(),e=>e.type==='button'&&e.props.children==='Skin Care').props['aria-current'],'true');
 route='/products';find(Nav({logo:null,actions:null}),e=>e.props?.children==='MAKEUP').props.onClick();refresh();tree=discovery();assert.deepEqual(find(tree,e=>e.type===Grid).props.products,expected);assert.equal(find(tree,e=>e.type===Controls).props.filters.category,'Makeup');
 route='/';assert.equal(find(discovery(),e=>e.type===Controls).props.filters.category,'Skin Care');
});
