/* Yalnızca https üzerinden yayımlanınca çalışır: programı telefona kurulabilir ve internetsiz yapar */
var SURUM = 'kartal-bakisi-v4';
var DOSYALAR = ['./', 'index.html', 'stil.css', 'ikon.svg', 'manifest.json', 'veri/metinler.js', 'veri/kelimeler.js',
  'js/ortak.js', 'js/egzersizler.js', 'js/okuma.js', 'js/program.js', 'js/ekler.js', 'js/sayfalar.js'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(SURUM).then(function (c) { return c.addAll(DOSYALAR.map(function (d) { return new Request(d, { cache: 'reload' }); })); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x.indexOf('kartal-bakisi-') === 0 && x !== SURUM; }).map(function (x) { return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); })); });
