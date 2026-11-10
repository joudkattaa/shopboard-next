/* eslint-disable @typescript-eslint/no-require-imports -- Actual HTTP regression checks using the installed Next.js production server. */
const {test,before,after}=require('node:test');const assert=require('node:assert/strict');const {spawn}=require('node:child_process');const net=require('node:net');const path=require('node:path');
let base=process.env.ROSEVEIL_HTTP_BASE,server;
before(async()=>{
 if(base)return;
 const port=await new Promise((resolve,reject)=>{const probe=net.createServer();probe.on('error',reject);probe.listen(0,'127.0.0.1',()=>{const port=probe.address().port;probe.close(()=>resolve(port));});});
 base='http://127.0.0.1:'+port;
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:path.resolve(__dirname,'..'),windowsHide:true,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Next server failed to start: '+output)),20000);function receive(chunk){output+=chunk.toString();if(output.includes('Ready in')){clearTimeout(timer);resolve();}}server.stdout.on('data',receive);server.stderr.on('data',receive);server.once('error',error=>{clearTimeout(timer);reject(error)});server.once('exit',code=>{clearTimeout(timer);reject(Error('Next server exited '+code+': '+output))});});
});
after(()=>{server?.kill();});
test('raw malformed IDs produce controlled JSON 400 before dynamic route decoding',async()=>{
 for(const id of ['%ZZ','%E0%A4%A','%','UPPER','a%2Fb']){const r=await fetch(base+'/api/products/'+id);assert.equal(r.status,400,id);assert.deepEqual(await r.json(),{error:'Invalid product ID'});assert.equal(r.headers.get('cache-control'),'no-store');}
});
test('unsupported methods retain source JSON, Allow and cache policy',async()=>{
 for(const route of ['/api/products','/api/products/body-cream'])for(const method of ['POST','PUT','PATCH','DELETE','OPTIONS','HEAD']){const r=await fetch(base+route,{method});assert.equal(r.status,405);assert.equal(r.headers.get('allow'),'GET');assert.equal(r.headers.get('cache-control'),'no-store');if(method!=='HEAD')assert.deepEqual(await r.json(),{error:'Method not allowed'});}
});
test('Home composition and source-compatible routes render through the production server',async()=>{
 const home=await fetch(base+'/');assert.equal(home.status,200);const html=await home.text();let last=-1;for(const marker of ['id="hero-title"','aria-label="The Roseveil philosophy"','aria-label="The Roseveil signature"','id="categories"','id="about"','id="products"','id="promise-title"']){const index=html.indexOf(marker);assert(index>last,marker);last=index;}
 assert.equal((html.match(/<article aria-label=/g)||[]).length,5);
 for(const [route,text]of [['/products','The Roseveil Collection'],['/products/body-cream','Delivery &amp; demo checkout'],['/bag','Your Shopping Bag'],['/checkout','Demo Checkout'],['/about','A Softer Way']]){const r=await fetch(base+route);assert.equal(r.status,200);assert((await r.text()).includes(text));}
 const shop=await fetch(base+'/shop',{redirect:'manual'});assert([307,308].includes(shop.status));assert.equal(shop.headers.get('location'),'/products');
 for(const route of ['/products/unknown-product','/missing-page','/api/products/unknown-product'])assert.equal((await fetch(base+route)).status,404);
 const r=await fetch(base+'/api/products');const json=await r.json();assert.equal(json.total,30);assert.equal(json.items[0].id,'body-cream');
});

test('original branded favicon and optimized responsive product images are served',async()=>{
 const fs=require('node:fs');const icon=await fetch(base+'/roseveil-mark.svg');assert.equal(icon.status,200);assert.equal(await icon.text(),fs.readFileSync(path.resolve(__dirname,'../public/roseveil-mark.svg'),'utf8'));
 const home=await(await fetch(base+'/')).text();assert(home.includes('href="/roseveil-mark.svg"'));assert(!home.includes('href="/favicon.ico'));
 const listing=await(await fetch(base+'/products')).text();assert(listing.includes('srcSet="/_next/image'));assert(listing.includes('sizes="(min-width: 1330px)'));
 const image=await fetch(base+'/_next/image?url=%2Froseveil%2Fbody-lotion.webp&w=640&q=75');assert.equal(image.status,200);assert(image.headers.get('content-type').startsWith('image/'));assert((await image.arrayBuffer()).byteLength>0);
});
