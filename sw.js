const CACHE_NAME = 'deenlink-ai-v1-2-1';
const ASSETS = ['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',(e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',(e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',(e)=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      if(e.request.method==='GET' && resp.status===200){
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));
      }
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});
