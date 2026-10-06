const CACHE='weekflow-shell-v4';
const BASE=new URL('./',self.location.href);
const ASSETS=['manifest.webmanifest','icon-192.png','icon-512.png','reports.js'];
const urls=ASSETS.map(path=>new URL(path,BASE).href);
async function cachePage(request,response){
 if(!response.ok||response.redirected||response.type==='opaque')return;
 if(!(response.headers.get('content-type')||'').includes('text/html'))return;
 const text=await response.clone().text();
 if(text.includes('id="earningForm"')&&text.includes('weekflow-v1'))await(await caches.open(CACHE)).put(new URL('./index.html',BASE).href,response.clone());
}
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(urls.map(async url=>{try{const response=await fetch(url);if(response.ok&&!response.redirected)await cache.put(url,response);}catch(e){}}));self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('weekflow-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==BASE.origin)return;
 const isPage=request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===new URL('index.html',BASE).pathname);
 if(isPage){event.respondWith((async()=>{try{const response=await fetch(request);await cachePage(request,response);return response;}catch(e){const cached=await caches.match(new URL('./index.html',BASE).href);return cached||new Response('Open Weekflow online once before using it offline.',{status:503,headers:{'Content-Type':'text/plain'}});}})());return;}
 if(urls.includes(url.href))event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok&&!response.redirected)(await caches.open(CACHE)).put(request,response.clone());return response;})());
});
