const CACHE='practica-consciente-v2-layout';
const CORE=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
'./assets/practices/om.png','./assets/practices/saludos.jpg','./assets/practices/bhramari.png','./assets/practices/kapalabhati.jpg','./assets/practices/solar.jpg','./assets/practices/moola.jpg','./assets/practices/vajroli.jpg','./assets/practices/ashwini.jpg','./assets/practices/agni.jpg','./assets/practices/khechari.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
    const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)).catch(()=>{}); return res;
  }).catch(()=>caches.match('./index.html'))));
});
