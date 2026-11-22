/* Kartal Bakışı – ortak yardımcılar, veri saklama, profil */
'use strict';

var KB = window.KB = {};
var DEPO = 'kartalBakisi.v1';

/* ---------- Küçük yardımcılar ---------- */
function $(s, k) { return (k || document).querySelector(s); }
function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
function el(etiket, ozel, icerik) {
  var e = document.createElement(etiket);
  if (ozel) for (var a in ozel) {
    if (a === 'html') e.innerHTML = ozel[a];
    else if (a === 'text') e.textContent = ozel[a];
    else if (a.slice(0, 2) === 'on') e.addEventListener(a.slice(2), ozel[a]);
    else if (a === 'class') e.className = ozel[a];
    else e.setAttribute(a, ozel[a]);
  }
  if (icerik != null) (Array.isArray(icerik) ? icerik : [icerik]).forEach(function (c) {
    if (c == null) return;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return e;
}
function karistir(d) { d = d.slice(); for (var i = d.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = d[i]; d[i] = d[j]; d[j] = t; } return d; }
function rastgele(d) { return d[Math.floor(Math.random() * d.length)]; }
function kucuk(s) { return (s || '').toLocaleLowerCase('tr'); }
function temizKelime(s) { return kucuk(s).replace(/[^a-zçğıöşüâîû]/g, ''); }
function kelimeSay(metin) { return metin.trim().split(/\s+/).filter(Boolean).length; }
function bugun() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function gunFarki(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
function tarihYaz(iso) { var d = new Date(iso); return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
function sn(ms) { return (ms / 1000).toFixed(1).replace('.', ',') + ' sn'; }
function yuvarla(x, adim) { adim = adim || 1; return Math.round(x / adim) * adim; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ---------- Veri ---------- */
var D;
function yukle() {
  try { D = JSON.parse(localStorage.getItem(DEPO)) || null; } catch (e) { D = null; }
  if (!D || !D.profiller) D = { profiller: {}, aktif: null, surum: 1 };
}
function kaydet() {
  try { localStorage.setItem(DEPO, JSON.stringify(D)); }
  catch (e) { uyar('Kayıt yapılamadı', 'Tarayıcın verileri kaydetmeye izin vermiyor olabilir (gizli pencere?). İlerlemen kaybolmasın diye normal pencerede aç.'); }
}
function P() { return D.aktif ? D.profiller[D.aktif] : null; }
function yeniProfil(ad, sinif) {
  var id = 'p' + Date.now().toString(36);
  D.profiller[id] = {
    id: id, ad: ad, sinif: sinif, olusturma: new Date().toISOString(),
    gun: -1,               // -1: başlangıç testi yapılmadı; n: tamamlanan son program günü
    sonGunTarihi: null, seri: 0, enUzunSeri: 0, calisilanGunler: [],
    baslangic: null, hedef: null,
    kayitlar: [], rekorlar: {}, rozetler: {}, kelimeler: {},
    ayar: { boyut: 1, tema: 'acik', yanip: true, gunSiniri: true }
  };
  D.aktif = id; kaydet(); return D.profiller[id];
}
function kayitEkle(k) {
  var p = P(); if (!p) return;
  k.t = new Date().toISOString();
  p.kayitlar.push(k);
  var gun = bugun();
  if (p.calisilanGunler.indexOf(gun) < 0) {
    var son = p.calisilanGunler[p.calisilanGunler.length - 1];
    p.calisilanGunler.push(gun);
    p.seri = (son && gunFarki(son, gun) <= 2) ? p.seri + 1 : 1; // bir gün ara vermek (ör. hafta sonu) seriyi bozmaz
    if (p.seri > p.enUzunSeri) p.enUzunSeri = p.seri;
  }
  kaydet();
  rozetDenetle();
}
function rekor(ad, deger, kucukIyi) {
  var p = P(); var eski = p.rekorlar[ad];
  var yeni = eski == null || (kucukIyi ? deger < eski : deger > eski);
  if (yeni) { p.rekorlar[ad] = deger; kaydet(); }
  return yeni && eski != null;
}

/* ---------- Ayarlar (boyut/tema) ---------- */
function ayarUygula() {
  var p = P(); var a = p ? p.ayar : { boyut: 1, tema: 'acik' };
  document.documentElement.style.setProperty('--olcek', a.boyut || 1);
  document.documentElement.style.setProperty('--satir', a.satir || 1.85);
  document.documentElement.style.setProperty('--genislik', a.genislik || '40em');
  document.documentElement.style.setProperty('--metinFont', { serif: 'Georgia,"Times New Roman",serif', sans: '-apple-system,"Segoe UI",Roboto,Arial,sans-serif', acik: 'Verdana,Tahoma,"Trebuchet MS",sans-serif' }[a.font || 'serif']);
  document.documentElement.style.setProperty('--harfAralik', a.harfAralik ? '.04em' : 'normal');
  document.body.classList.toggle('koyu', a.tema === 'koyu');
  $('#kisiAd').textContent = p ? '👤 ' + p.ad : '';
}

/* ---------- Pencereler ---------- */
function modal(baslik, icerik, dugmeler) {
  var arka = el('div', { class: 'modal-arka' });
  var m = el('div', { class: 'modal', role: 'dialog' }, [el('h2', { text: baslik, style: 'margin-top:0' })]);
  if (typeof icerik === 'string') m.appendChild(el('p', { html: icerik })); else m.appendChild(icerik);
  var alt = el('div', { style: 'margin-top:1rem;text-align:right' });
  (dugmeler || [{ y: 'Tamam' }]).forEach(function (d) {
    alt.appendChild(el('button', { class: 'btn' + (d.sinif ? ' ' + d.sinif : ''), text: d.y, onclick: function () { arka.remove(); if (d.f) d.f(); } }));
  });
  m.appendChild(alt); arka.appendChild(m); document.body.appendChild(arka);
  var b = alt.querySelector('button:last-child'); if (b) b.focus();
  return arka;
}
function uyar(b, m) { modal(b, m); }
function onayla(b, m, evet, evetYazi) {
  modal(b, m, [{ y: 'Vazgeç', sinif: 'ikincil' }, { y: evetYazi || 'Evet', f: evet }]);
}

/* ---------- Ekran yönetimi ---------- */
var aktifTemizle = null; // çalışan egzersizin zamanlayıcılarını durdurur
function ekranTemizle() {
  if (aktifTemizle) { try { aktifTemizle(); } catch (e) { } aktifTemizle = null; }
  var e = $('#ekran'); e.innerHTML = ''; window.scrollTo(0, 0); return e;
}
function zamanlayici() {
  // birden çok setTimeout/interval/raf'ı tek seferde temizlemek için
  var idler = [], araliklar = [], raflar = [];
  var z = {
    sure: function (f, ms) { var i = setTimeout(f, ms); idler.push(i); return i; },
    aralik: function (f, ms) { var i = setInterval(f, ms); araliklar.push(i); return i; },
    raf: function (f) { var i = requestAnimationFrame(f); raflar.push(i); return i; },
    hepsi: function () { idler.forEach(clearTimeout); araliklar.forEach(clearInterval); raflar.forEach(cancelAnimationFrame); idler = []; araliklar = []; raflar = []; }
  };
  return z;
}

/* ---------- Metin ve kelime havuzu ---------- */
function metinBul(id) {
  var m = (window.METINLER || []).filter(function (m) { return m.id === id; })[0];
  if (!m && window.KENDI && window.KENDI[id]) m = window.KENDI[id];
  if (!m && P() && P().kendiMetinler) m = P().kendiMetinler.filter(function (x) { return x.id === id; })[0];
  return m;
}
var _havuz = null, _gruplar = null;
function kelimeHavuzu() {
  if (_havuz) return _havuz;
  var set = {};
  (window.TEMEL_KELIMELER || []).forEach(function (w) { set[w] = 1; });
  (window.METINLER || []).forEach(function (m) {
    m.metin.split(/\s+/).forEach(function (w) {
      var t = w.replace(/[^A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ]/g, '');
      if (t.length >= 4 && t.length <= 10 && t === kucuk(t)) set[t] = 1;
    });
  });
  _havuz = Object.keys(set);
  return _havuz;
}
var SON_YASAK = ['ve', 'ile', 'ya', 'da', 'de', 'ki', 'ama', 'fakat', 'çünkü', 'veya', 'hem', 'bir', 'bu', 'şu', 'o', 'en', 'daha', 'çok', 'gibi', 'her', 'ne', 'mi', 'mı'];
var BAS_YASAK = ['ve', 'ile', 'da', 'de', 'ki', 'ama', 'fakat', 'çünkü', 'veya', 'mi', 'mı', 'gibi', 'için'];
function kelimeGruplari(n) {
  _gruplar = _gruplar || {};
  if (_gruplar[n]) return _gruplar[n];
  var g = {}, liste;
  (window.METINLER || []).forEach(function (m) {
    m.metin.split(/[.!?;:]\s+|\n+/).forEach(function (cumle) {
      var w = cumle.split(/\s+/).filter(Boolean);
      for (var i = 0; i + n <= w.length; i++) {
        var parca = w.slice(i, i + n);
        if (parca.slice(0, -1).some(function (x) { return /[,"“”()'’]$/.test(x); })) continue;
        var s = parca.join(' ').replace(/[,.;:!?…"“”()]+$/, '');
        if (/[^A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ\s]/.test(s)) continue;
        if (s !== kucuk(s) && i > 0) continue;
        var ilk = kucuk(parca[0]), son = kucuk(s.split(' ').pop());
        if (BAS_YASAK.indexOf(ilk) >= 0 || SON_YASAK.indexOf(son) >= 0) continue;
        if (s.length >= 8 && s.length <= 10 + n * 6) g[s] = 1;
      }
    });
  });
  liste = Object.keys(g);
  if (!liste.length) liste = (window.TEMEL_GRUPLAR || []).slice();
  _gruplar[n] = liste; return liste;
}
function benzerCeldiriciler(hedef, havuz, adet) {
  var L = hedef.length;
  var aday = havuz.filter(function (w) { return w !== hedef && Math.abs(w.length - L) <= 1; });
  var ayniBas = aday.filter(function (w) { return w[0] === hedef[0]; });
  var sec = karistir(ayniBas).slice(0, adet);
  if (sec.length < adet) sec = sec.concat(karistir(aday.filter(function (w) { return sec.indexOf(w) < 0; })).slice(0, adet - sec.length));
  return sec;
}

/* ---------- Rozetler ---------- */
var ROZETLER = [
  { k: 'ilk', r: '🐣', a: 'İlk Adım', d: 'Başlangıç testini yaptın.' },
  { k: 'h1', r: '👀', a: '1. Hafta', d: 'Temel haftasını bitirdin.' },
  { k: 'h2', r: '🔭', a: '2. Hafta', d: 'Görüş alanı haftasını bitirdin.' },
  { k: 'h3', r: '🧩', a: '3. Hafta', d: 'Kelime grupları haftasını bitirdin.' },
  { k: 'h4', r: '🌊', a: '4. Hafta', d: 'Akış haftasını bitirdin.' },
  { k: 'h5', r: '🧭', a: '5. Hafta', d: 'Stratejiler haftasını bitirdin.' },
  { k: 'mezun', r: '🦅', a: 'Kartal Göz', d: 'Programın tamamını bitirdin.' },
  { k: 'seri3', r: '🔥', a: '3 Gün Seri', d: '3 gün üst üste çalıştın.' },
  { k: 'seri7', r: '⭐', a: '7 Gün Seri', d: '7 gün üst üste çalıştın.' },
  { k: 'seri14', r: '🏅', a: '14 Gün Seri', d: '14 gün üst üste çalıştın.' },
  { k: 'tam', r: '🎯', a: 'Tam Anlama', d: 'Bir metnin bütün sorularını doğru cevapladın.' },
  { k: 'hiz15', r: '🚀', a: '1,5 Kat', d: 'Etkili okuma hızın başlangıcın 1,5 katına çıktı.' },
  { k: 'hiz2', r: '⚡', a: '2 Kat', d: 'Etkili okuma hızın başlangıcın 2 katına çıktı.' },
  { k: 'schulte', r: '🔢', a: 'Tablo Ustası', d: '5×5 Schulte tablosunu 45 saniyenin altında bitirdin.' },
  { k: 'kelime30', r: '📚', a: 'Kelime Avcısı', d: '30 yeni kelime öğrendin.' },
  { k: 'kitap10', r: '📖', a: '10 Metin', d: '10 metin okuyup soruları cevapladın.' },
  { k: 'farkindalik', r: '🪞', a: 'Kendini Tanıyan', d: '5 okumada ne kadar anladığını tam isabetle tahmin ettin.' },
  { k: 'tekrar', r: '🔁', a: 'Akıcı Okur', d: 'Tekrarlı okumada hızını %20 artırdın.' },
  { k: 'sesli', r: '🎤', a: 'Sesli Okur', d: 'Sesli okuma ölçümü yaptın.' }
];
function rozetVer(k) {
  var p = P(); if (!p || p.rozetler[k]) return;
  p.rozetler[k] = new Date().toISOString(); kaydet();
  var r = ROZETLER.filter(function (x) { return x.k === k; })[0];
  if (r) bekleyenRozetler.push(r);
}
var bekleyenRozetler = [];
function rozetGoster() { // yalnızca sonuç ekranlarında ve ana sayfada çağrılır; egzersiz ortasında açılmaz
  var r = bekleyenRozetler.shift(); if (!r) return;
  setTimeout(function () { modal('Yeni rozet! ' + r.r, '<b>' + r.a + '</b><br>' + r.d, [{ y: 'Harika!', f: rozetGoster }]); }, 400);
}
function rozetDenetle() {
  var p = P(); if (!p) return;
  if (p.baslangic) rozetVer('ilk');
  if (p.seri >= 3) rozetVer('seri3');
  if (p.seri >= 7) rozetVer('seri7');
  if (p.seri >= 14) rozetVer('seri14');
  var ok = p.kayitlar.filter(function (k) { return k.tur === 'okuma' || k.tur === 'test'; });
  if (ok.some(function (k) { return k.an === 100; })) rozetVer('tam');
  if (ok.length >= 10) rozetVer('kitap10');
  if (p.baslangic) {
    var en = Math.max.apply(null, ok.map(function (k) { return k.eoh || 0; }));
    if (en >= p.baslangic.eoh * 1.5) rozetVer('hiz15');
    if (en >= p.baslangic.eoh * 2) rozetVer('hiz2');
  }
  if (p.rekorlar['schulte5'] && p.rekorlar['schulte5'] < 45000) rozetVer('schulte');
  if (Object.keys(p.kelimeler).length >= 30) rozetVer('kelime30');
  if (p.kayitlar.filter(function (k) { return k.tahmin && k.an != null && k.tur !== 'kendi' && k.tahmin === 1 + Math.round(k.an / 25); }).length >= 5) rozetVer('farkindalik');
  if (p.kayitlar.some(function (k) { return k.tur === 'tekrar' && k.kh1 && k.kh >= k.kh1 * 1.2; })) rozetVer('tekrar');
  if (p.kayitlar.some(function (k) { return k.tur === 'sesli'; })) rozetVer('sesli');
}

/* ---------- Ortak arayüz parçaları ---------- */
function aciklamaKutusu(simge, baslik, aciklama, nasil, basla, ekstra) {
  var e = el('div', { class: 'kart orta' }, [
    el('div', { class: 'simge', text: simge, style: 'font-size:3rem' }),
    el('h2', { text: baslik, style: 'margin-top:.3rem' }),
    el('p', { html: aciklama })
  ]);
  if (nasil) e.appendChild(el('details', { style: 'text-align:left' }, [el('summary', { text: 'Nasıl yapılır?' }), el('div', { html: nasil })]));
  if (ekstra) e.appendChild(ekstra);
  e.appendChild(el('button', { class: 'btn buyuk', text: 'Başla ▶', onclick: basla, style: 'margin-top:.8rem' }));
  return e;
}
function sonucKutusu(baslik, satirlar, notlar) {
  var ist = el('div', { class: 'istatistik' });
  satirlar.forEach(function (s) { ist.appendChild(el('div', null, [el('b', { text: s[1] }), el('span', { text: s[0] })])); });
  var k = el('div', { class: 'kart orta' }, [el('h2', { text: baslik, style: 'margin-top:0' }), ist]);
  (notlar || []).forEach(function (n) { if (n) k.appendChild(el('div', { class: n[0], html: n[1], style: 'text-align:left' })); });
  return k;
}
