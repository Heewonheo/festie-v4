/* Festie offline copy for the exhibition iPad and iMac.
   Lives at the top of the festie-v4 repo so it covers festie-site, the prototype and the loop.
   After one visit online, everything below is kept on the device and works without the internet. */
const CACHE='festie-offline-v13-1';
const ROOT=new URL('./',self.location).pathname;           // '/festie-v4/'
const NEED=[
"festie-site/",
"festie-site/fonts/files/caveat-latin-500-normal.woff2",
"festie-site/fonts/files/caveat-latin-700-normal.woff2",
"festie-site/fonts/files/hanken-grotesk-latin-400-normal.woff2",
"festie-site/fonts/files/hanken-grotesk-latin-500-normal.woff2",
"festie-site/fonts/files/hanken-grotesk-latin-600-normal.woff2",
"festie-site/fonts/files/josefin-sans-latin-600-normal.woff2",
"festie-site/fonts/files/josefin-sans-latin-700-normal.woff2",
"festie-site/fonts/files/noto-sans-kr-400.woff2",
"festie-site/fonts/files/noto-sans-kr-500.woff2",
"festie-site/fonts/files/noto-sans-kr-700.woff2",
"festie-site/fonts/files/noto-sans-kr-800.woff2",
"festie-site/fonts/files/silkscreen-latin-400-normal.woff2",
"festie-site/fonts/fonts.css",
"festie-site/icon-180.png",
"festie-site/icon-512.png",
"festie-site/index.html",
"festie-site/qr.png",
"festie-site/shots/artist.webp",
"festie-site/shots/check.webp",
"festie-site/shots/detailUnreleased.webp",
"festie-site/shots/discover.webp",
"festie-site/shots/playlist.webp",
"festie-site/shots/recordSaved.webp",
"festie-site/shots/reportFilled.webp",
"festie-site/shots/reportStep2.webp",
"festie-site/shots/reportStep3.webp",
"festie-site/shots/ticketSaved.webp",
"festie-site/shots/today.webp",
"festie-site/shots/tt.webp",
"festie-site/manifest.webmanifest",
"festie-prototype-v13/README.md",
"festie-prototype-v13/assets/images/artists/cnblue.jpg",
"festie-prototype-v13/assets/images/artists/day6.jpg",
"festie-prototype-v13/assets/images/artists/daybreak.jpg",
"festie-prototype-v13/assets/images/artists/dragon-pony.jpg",
"festie-prototype-v13/assets/images/artists/guckkasten.jpg",
"festie-prototype-v13/assets/images/artists/hyukoh.jpg",
"festie-prototype-v13/assets/images/artists/jannabi.jpg",
"festie-prototype-v13/assets/images/artists/lucy.jpg",
"festie-prototype-v13/assets/images/artists/n-flying.jpg",
"festie-prototype-v13/assets/images/artists/nell.jpg",
"festie-prototype-v13/assets/images/artists/peppertones.jpg",
"festie-prototype-v13/assets/images/artists/pinkpantheress.jpg",
"festie-prototype-v13/assets/images/artists/silica-gel.jpg",
"festie-prototype-v13/assets/images/artists/thornapple.jpg",
"festie-prototype-v13/assets/images/artists/touched.jpg",
"festie-prototype-v13/assets/images/artists/tyla.jpg",
"festie-prototype-v13/assets/images/patterns/pattern-a-lavender.svg",
"festie-prototype-v13/assets/images/patterns/pattern-d-yellow-dots.svg",
"festie-prototype-v13/assets/images/patterns/pattern-e-black-dday.svg",
"festie-prototype-v13/assets/images/patterns/pattern-e-black.svg",
"festie-prototype-v13/assets/images/photos/photo-1.jpg",
"festie-prototype-v13/assets/images/photos/photo-2.jpg",
"festie-prototype-v13/assets/images/photos/photo-3.jpg",
"festie-prototype-v13/assets/images/photos/photo-4.jpg",
"festie-prototype-v13/assets/images/photos/photo-5.jpg",
"festie-prototype-v13/assets/images/photos/photo-6.jpg",
"festie-prototype-v13/assets/images/photos/photo-7.jpg",
"festie-prototype-v13/assets/images/posters/countdown-fantasy.jpg",
"festie-prototype-v13/assets/images/posters/grand-mint-festival.jpg",
"festie-prototype-v13/assets/images/posters/hero-rock-festival.jpg",
"festie-prototype-v13/assets/images/posters/inmufe.jpg",
"festie-prototype-v13/assets/images/posters/nol-festival.jpg",
"festie-prototype-v13/assets/images/posters/sejong-bohemian.jpg",
"festie-prototype-v13/assets/images/posters/wonderlivet.jpg",
"festie-prototype-v13/icons/favicon.svg",
"festie-prototype-v13/icons/icon-180.png",
"festie-prototype-v13/icons/icon-192.png",
"festie-prototype-v13/icons/icon-32.png",
"festie-prototype-v13/icons/icon-512.png",
"festie-prototype-v13/icons/icon-maskable-512.png",
"festie-prototype-v13/icons/icon.svg",
"festie-prototype-v13/index.html",
"festie-prototype-v13/js/dc-lite.js",
"festie-prototype-v13/js/festie-app.js",
"festie-prototype-v13/manifest.webmanifest",
"festie-prototype-v13/vendor/PREACT-LICENSE",
"festie-prototype-v13/vendor/preact.umd.js"
];
const OPTIONAL=[
"festie-loop/",
"festie-loop/index.html",
"festie-loop/screens/checkAll.webp",
"festie-loop/screens/dashDone.webp",
"festie-loop/screens/detail.webp",
"festie-loop/screens/discover.webp",
"festie-loop/screens/pass.webp",
"festie-loop/screens/playlist.webp",
"festie-loop/screens/pushDday.webp",
"festie-loop/screens/report.webp",
"festie-loop/screens/reportFilled.webp",
"festie-loop/screens/reportStep2.webp",
"festie-loop/screens/reportStep3.webp",
"festie-loop/screens/search.webp",
"festie-loop/screens/searchResult.webp",
"festie-loop/screens/today.webp",
"festie-loop/screens/tt.webp",
"festie-loop/screens/tte.webp"
];  // the iMac loop, if it has been uploaded

/* the prototype asks Google Fonts for its type; offline it gets the same faces from festie-site/fonts */
const F=ROOT+'festie-site/fonts/files/';
const FONT_CSS=[
  ['Josefin Sans',600,'josefin-sans-latin-600-normal.woff2'],['Josefin Sans',700,'josefin-sans-latin-700-normal.woff2'],
  ['Hanken Grotesk',400,'hanken-grotesk-latin-400-normal.woff2'],['Hanken Grotesk',500,'hanken-grotesk-latin-500-normal.woff2'],['Hanken Grotesk',600,'hanken-grotesk-latin-600-normal.woff2'],
  ['Noto Sans KR',400,'noto-sans-kr-400.woff2'],['Noto Sans KR',500,'noto-sans-kr-500.woff2'],['Noto Sans KR',700,'noto-sans-kr-700.woff2']
].map(([f,w,file])=>`@font-face{font-family:'${f}';font-style:normal;font-weight:${w};font-display:swap;src:url(${F}${file}) format('woff2')}`).join('\n');

async function save(cache,path){
  try{const r=await fetch(ROOT+path,{cache:'reload'});if(r.ok){await cache.put(ROOT+path,r);return true}}catch(e){}
  return false;
}
async function fill(){
  const cache=await caches.open(CACHE);
  const all=[...NEED,...OPTIONAL];
  for(let i=0;i<all.length;i+=8)await Promise.all(all.slice(i,i+8).map(p=>save(cache,p)));
}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(fill())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);
  await self.clients.claim();
})())});

self.addEventListener('message',e=>{
  if(e.data!=='status')return;
  e.waitUntil((async()=>{
    const cache=await caches.open(CACHE);let done=0;
    for(const p of NEED)if(await cache.match(ROOT+p))done++;
    if(done<NEED.length&&!self.__filling){self.__filling=true;fill().finally(()=>self.__filling=false)}
    e.source&&e.source.postMessage({type:'status',done,total:NEED.length,ready:done===NEED.length});
  })());
});

const timeout=(ms)=>new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),ms));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname==='fonts.googleapis.com'){
    e.respondWith(new Response(FONT_CSS,{headers:{'Content-Type':'text/css'}}));return;
  }
  if(url.hostname==='fonts.gstatic.com'){e.respondWith(fetch(req).catch(()=>new Response('',{status:404})));return}
  if(url.origin!==self.location.origin||!url.pathname.startsWith(ROOT))return;
  if(req.mode==='navigate'){
    /* pages: newest from the internet when it answers quickly, otherwise the saved copy */
    e.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const r=await Promise.race([fetch(req),timeout(2500)]);
        if(r.ok){const key=url.origin+url.pathname;cache.put(key,r.clone())}
        return r;
      }catch(err){
        return (await cache.match(req,{ignoreSearch:true}))
            ||(await cache.match(url.pathname.replace(/[^/]*$/,'')+'index.html'))
            ||(await cache.match(url.pathname.replace(/index\.html$/,'')))
            ||new Response('오프라인 저장본이 아직 없어요. 인터넷에 연결해 한 번 열어 주세요.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  /* images, fonts, scripts: saved copy first */
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const hit=await cache.match(req,{ignoreSearch:true});if(hit)return hit;
    try{const r=await fetch(req);if(r.ok)cache.put(req,r.clone());return r}
    catch(err){return new Response('',{status:504})}
  })());
});
