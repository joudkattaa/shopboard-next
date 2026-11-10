/* eslint-disable @typescript-eslint/no-require-imports -- Node runner with in-memory TS/TSX loading. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function loader(overrides={}){const cache=new Map();return function load(file){file=path.resolve(__dirname,'..',file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',code)(id=>{if(id in overrides)return overrides[id];if(id.startsWith('@/')){const base=id.slice(2);return load(base+(fs.existsSync(path.resolve(__dirname,'..',base+'.ts'))?'.ts':'.tsx'));}return require(id);},m,m.exports);return m.exports;}}
function find(el,pred){if(!el||typeof el!=='object')return;if(pred(el))return el;for(const child of React.Children.toArray(el.props?.children)){const result=find(child,pred);if(result)return result;}}
const load=loader();const {products}=load('features/catalog/catalog.ts');const {checkoutOrder,validateCheckout}=load('features/checkout/checkout.logic.ts');const {createBagStore}=load('features/cart/bag.store.ts');
const valid={fullName:' Sample Person ',email:'sample@example.com',phone:'+1 (555) 123-4567',address:'123 Sample Street'};

test('checkout retains source validation limits, email and phone rules',()=>{
 assert.deepEqual(validateCheckout(valid),{});
 for(const [key,value] of [['fullName','x'],['fullName','x'.repeat(101)],['email','bad'],['email','a..b@example.com'],['email','a'.repeat(255)],['phone','abc12345'],['phone','-------'],['phone','1'.repeat(31)],['address','short'],['address','x'.repeat(501)]])assert(validateCheckout({...valid,[key]:value})[key],key);
 assert.equal(Object.keys(validateCheckout({fullName:'',email:'',phone:'',address:''})).length,4);
});

test('checkout order uses canonical prices and rejects invalid or unavailable bags',()=>{
 const store=createBagStore(products);assert.equal(checkoutOrder({...store.getSnapshot(),products}),null);store.hydrate();store.add('body-cream');store.setPromoCode('GLOW20');const order=checkoutOrder({...store.getSnapshot(),products});assert.equal(order.totals.total,2834);assert.equal(order.items[0].price,2799);
 for(const quantity of [0,100,1.5])assert.equal(checkoutOrder({ready:true,items:[{id:'body-cream',quantity}],promoCode:'',products}),null);
 assert.equal(checkoutOrder({ready:true,items:[{id:'missing',quantity:1}],promoCode:'',products}),null);
});

test('checkout submit focuses errors, takes a fresh snapshot and clears only after valid demo confirmation',()=>{
 const store=createBagStore(products);store.hydrate();store.add('body-cream');let slots=[],cursor=0,resets=0,focuses=0;
 const react={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=value}]},useRef:()=>({current:{reset(){resets++},querySelector(){return {focus(){focuses++}}},focus(){}}}),useEffect(){}};
 const local=loader({react,'@/features/cart/BagProvider':{useBag:()=>({...store.getSnapshot(),store,products})}});const Checkout=local('features/checkout/Checkout.tsx').default;const render=()=>{cursor=0;return Checkout()};
 const OriginalFormData=global.FormData;global.FormData=class{constructor(value){this.value=value}get(key){return this.value[key]}};
 try{find(render(),el=>el.type==='form').props.onSubmit({preventDefault(){},currentTarget:{}});assert.equal(store.getSnapshot().items.length,1);assert(focuses>0);assert.equal(resets,0);
 const form=find(render(),el=>el.type==='form');store.add('body-cream');form.props.onSubmit({preventDefault(){},currentTarget:valid});assert.equal(store.getSnapshot().items.length,0);assert.equal(slots[0].items[0].quantity,2);assert.equal(resets,1);
 const html=renderToStaticMarkup(render());assert(html.includes('Demo order confirmed'));assert(!html.includes('Sample Person'));assert(!html.includes('sample@example.com'));
 }finally{global.FormData=OriginalFormData}
});

test('theme bootstrap respects saved values, invalid values, system preference and blocked storage',()=>{
 const {themeBootstrap,resolveTheme,THEME_KEY}=load('features/theme/theme.ts');assert.equal(THEME_KEY,'roseveil-theme');
 for(const [saved,system,expected] of [['dark',false,'dark'],['light',true,'light'],[null,true,'dark'],['invalid',false,'light'],[null,false,'light']]){const context={localStorage:{getItem:()=>saved},matchMedia:()=>({matches:system}),document:{documentElement:{dataset:{theme:'light'}}}};vm.runInNewContext(themeBootstrap,context);assert.equal(context.document.documentElement.dataset.theme,expected);assert.equal(resolveTheme(saved,system),expected);}
 const blocked={localStorage:{getItem(){throw Error('blocked')}},matchMedia:()=>({matches:true}),document:{documentElement:{dataset:{}}}};vm.runInNewContext(themeBootstrap,blocked);assert.equal(blocked.document.documentElement.dataset.theme,'dark');
});

test('theme toggle persists light/dark and still works when storage writes are blocked',()=>{
 const oldWindow=global.window,oldDocument=global.document;let saved;global.document={documentElement:{dataset:{theme:'light'}}};global.window={localStorage:{setItem(key,value){saved=[key,value]}},dispatchEvent(){}};
 try{const local=loader({react:{...React,useSyncExternalStore:(_subscribe,get)=>get()}});const Toggle=local('features/theme/ThemeToggle.tsx').default;Toggle().props.onClick();assert.deepEqual(saved,['roseveil-theme','dark']);assert.equal(Toggle().props['aria-pressed'],true);global.window.localStorage.setItem=()=>{throw Error('blocked')};Toggle().props.onClick();assert.equal(global.document.documentElement.dataset.theme,'light');}finally{global.window=oldWindow;global.document=oldDocument}
});

test('About disclosure retains controls, original story and accessible expanded state',()=>{
 let value=false;const local=loader({react:{...React,useState:()=>[value,next=>{value=next}]}});const About=local('components/editorial/AboutSection.tsx').default;
 const button=find(About(),el=>el.type==='button');assert.equal(button.props['aria-expanded'],false);button.props.onClick();assert.equal(find(About(),el=>el.props?.id==='about-story').props.hidden,false);assert.equal(find(About(),el=>el.type==='button').props['aria-expanded'],true);
});
