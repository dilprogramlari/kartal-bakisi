/* Kartal Bakışı – sayfalar ve akış */
'use strict';

/* ---------- Egzersiz çalıştırıcı ---------- */
var cikisFn = null;
function egzersizCalistir(kap, adim, bittiSonra) {
  var z = zamanlayici(); aktifTemizle = z.hepsi;
  var E = EGZ[adim.tur];
  E.calistir(kap, adim.ayar || {}, function (sonuc) {
    z.hepsi();
    bittiSonra(sonuc);
  }, z);
}

/* ---------- Üst çubuk ---------- */
function ustKur() {
  $('#logoBtn').onclick = function () { cikisSor(anaSayfa); };
  $('#menuBtn').onclick = menu;
  $('#boyutBtn').onclick = function () {
    var p = P(); if (!p) return; var d = [0.9, 1, 1.15, 1.3, 1.5]; var i = d.indexOf(p.ayar.boyut); p.ayar.boyut = d[(i + 1) % d.length]; kaydet(); ayarUygula();
  };
  $('#temaBtn').onclick = function () { var p = P(); if (!p) return; p.ayar.tema = p.ayar.tema === 'koyu' ? 'acik' : 'koyu'; kaydet(); ayarUygula(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cikisFn && !$('.modal-arka')) cikisFn(); });
}
function cikisSor(sonra) {
  if (!cikisFn) return sonra();
  onayla('Çıkmak istiyor musun?', 'Yarım kalan antrenman kaydedilmez. Bugünkü antrenmanı daha sonra baştan yapabilirsin.', function () { cikisFn = null; sonra(); }, 'Çık');
}
function menu() {
  if (!P()) return;
  var ogeler = [
    ['🏠', 'Ana sayfa', anaSayfa], ['▶️', 'Bugünkü antrenman', function () { antrenmanGiris(); }],
    ['🏋️', 'Serbest alıştırmalar', alistirmalar], ['📚', 'Okuma kütüphanesi', kutuphane],
    ['📈', 'İlerlemem', ilerleme], ['📒', 'Kelime defterim', kelimeDefteri],
    ['🗣️', 'Sesli okuma ölçümü (veli/öğretmenle)', sesliOlcum], ['👩‍🏫', 'Öğretmen: sınıf görünümü', sinifGorunumu],
    ['❓', 'Nasıl kullanılır?', rehber], ['⚙️', 'Ayarlar ve yedekleme', ayarlar], ['👥', 'Profil değiştir', profilSec]
  ];
  var kutu = el('div');
  var arka;
  ogeler.forEach(function (o) {
    kutu.appendChild(el('button', { class: 'secenek', text: o[0] + '  ' + o[1], onclick: function () { arka.remove(); cikisSor(o[2]); } }));
  });
  arka = modal('Menü', kutu, [{ y: 'Kapat', sinif: 'ikincil' }]);
}

/* ---------- Başlangıç ---------- */
function baslat() {
  yukle(); ustKur(); ayarUygula();
  if (!window.METINLER || !window.METINLER.length) { ekranTemizle().appendChild(el('div', { class: 'uyari', text: 'Okuma metinleri yüklenemedi. "veri" klasörünün index.html ile aynı yerde olduğundan emin ol.' })); return; }
  if (!Object.keys(D.profiller).length) return tanitim(0);
  if (!P()) return profilSec();
  anaSayfa();
}

function tanitim(i) {
  var e = ekranTemizle(); cikisFn = null;
  var s = [
    { r: '🦅', b: 'Kartal Bakışı\'na hoş geldin!', a: 'Bu program, okuduğunu <b>anlayarak daha hızlı okumayı</b> öğretir. Kartal, yüksekten bakıp ayrıntıyı bir anda görür. Sen de 6 haftada gözünü ve zihnini okumaya böyle hazırlayacaksın.' },
    { r: '📅', b: 'Nasıl çalışır?', a: 'Program <b>30 antrenman günü</b> sürer: haftada 5 gün, her gün <b>15–25 dakika</b>. Her antrenmanda göz ısınması, 2 egzersiz, bir okuma metni ve sorular var. Başta, ortada ve sonda <b>test</b> yaparak gelişimini ölçersin.' },
    { r: '🎯', b: 'Asıl hedef: anlamak', a: 'Hızlı okumak, anlamadan göz gezdirmek değildir. Program hem hızını hem de anlamanı ölçer. Anlaman düşerse hızını kendiliğinden azaltır. <b>Düzenli çalışan herkes gelişir</b>; kendi başlangıcınla yarış, başkasıyla değil.' },
    { r: '🔒', b: 'Ücretsiz ve internetsiz', a: 'İnternet gerekmez, hesap açmazsın. Bütün bilgilerin <b>yalnızca bu cihazda</b> saklanır. Başka cihaza geçmek istersen Ayarlar\'dan yedek alabilirsin.' }
  ];
  var x = s[i];
  var noktalar = el('p', { class: 'orta', text: s.map(function (_, j) { return j === i ? '●' : '○'; }).join(' ') });
  e.appendChild(el('div', { class: 'tanitim kart' }, [
    el('div', { class: 'buyuk-simge', text: x.r }), el('h1', { text: x.b }), el('p', { html: x.a }), noktalar,
    el('div', null, [
      i > 0 ? el('button', { class: 'btn ikincil', text: '◀ Geri', onclick: function () { tanitim(i - 1); } }) : null,
      el('button', { class: 'btn buyuk', text: i < s.length - 1 ? 'İleri ▶' : 'Profilimi oluştur ▶', onclick: function () { i < s.length - 1 ? tanitim(i + 1) : profilOlustur(); } })
    ])
  ]));
}

function profilOlustur() {
  var e = ekranTemizle(); cikisFn = null;
  var ad = el('input', { type: 'text', maxlength: '20', placeholder: 'Örnek: Kartal Ali', autocomplete: 'off' });
  var sinif = el('select');
  ['5', '6', '7', '8', 'Diğer'].forEach(function (s) { sinif.appendChild(el('option', { value: s, text: s === 'Diğer' ? 'Diğer' : s + '. sınıf' })); });
  e.appendChild(el('div', { class: 'kart', style: 'max-width:30rem;margin:1rem auto' }, [
    el('h1', { text: '👤 Profilini oluştur' }),
    el('p', { class: 'soluk', text: 'Gerçek adını yazmak zorunda değilsin; bir takma ad yeterli. Aynı cihazı kardeşlerin de kullanıyorsa herkes kendi profilini açabilir.' }),
    el('div', { class: 'form-satir' }, [el('label', { text: 'Adın veya takma adın' }), ad]),
    el('div', { class: 'form-satir' }, [el('label', { text: 'Sınıfın' }), sinif]),
    el('button', { class: 'btn buyuk tam', text: 'Devam ▶', onclick: function () {
      var a = ad.value.trim(); if (!a) { ad.focus(); ad.style.borderColor = 'var(--kotu)'; return; }
      yeniProfil(a, sinif.value); ayarUygula(); uyarilar(true);
    } }),
    Object.keys(D.profiller).length ? el('button', { class: 'btn ikincil tam', text: 'Vazgeç', onclick: profilSec }) : null
  ]));
  ad.focus();
}

function uyarilar(ilk) {
  var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '⚠️ Başlamadan önce bilmen gerekenler' }));
  var maddeler = [
    ['📅', 'Düzenli çalış', 'Haftada <b>5 gün</b>, her gün <b>15–25 dakika</b>. Her gün aynı saatte çalışmak alışkanlık kazanmanı kolaylaştırır. Program günde yalnızca bir antrenman açar.'],
    ['🎯', 'Önce anla, sonra hızlan', 'Anlamadan okunan metin okunmuş sayılmaz. Hız artarken anlama %70\'in altına düşerse yavaşla.'],
    ['👁️', 'Gözlerini koru', 'Gözlüğün varsa tak. Ekrana bir kol boyu uzaklıkta otur. <b>Gözün ağrır, sulanır, bulanık görürsen ya da başın ağrırsa hemen ara ver.</b> Bu durum tekrar ediyorsa ailene söyle ve bir göz doktoruna görün.'],
    ['⏱️', 'Fazlası zarar', 'Günde 25 dakikadan fazla ekran egzersizi yapma. Her 20 dakikada bir 20 saniye uzağa bak (20-20-20 kuralı).'],
    ['📌', 'Işığa duyarlıysan', 'Hızlı yanıp sönen görüntüler seni rahatsız ediyorsa ya da daha önce ışığa bağlı bir rahatsızlık yaşadıysan Ayarlar\'dan <b>“Işık hassasiyeti”</b> seçeneğini aç ve ailene danış.'],
    ['📖', 'Asıl antrenman kitap', 'Programdaki teknikleri her gün kendi kitabını okurken de kullan. Günde en az 20 dakika kitap okumak programın etkisini katlar.'],
    ['🤝', 'Dürüst ol', 'Testleri kendi gerçek hızınla yap; metne geri bakarak soru cevaplama. Böylece gelişimini doğru görürsün.']
  ];
  maddeler.forEach(function (m) { e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: m[0] + ' ' + m[1], style: 'margin-top:0' }), el('p', { html: m[2], style: 'margin:0' })])); });
  e.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn buyuk', text: ilk ? 'Anladım, başlangıç testine geç ▶' : 'Anladım', onclick: function () { ilk ? antrenmanGiris() : anaSayfa(); } })]));
}

/* ---------- Profil seçimi ---------- */
function profilSec() {
  var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '👥 Kim çalışıyor?' }));
  var iz = el('div', { class: 'izgara' });
  Object.keys(D.profiller).forEach(function (id) {
    var p = D.profiller[id];
    iz.appendChild(el('div', { class: 'kart', onclick: function () { D.aktif = id; kaydet(); ayarUygula(); anaSayfa(); } }, [
      el('div', { class: 'simge', text: '👤' }), el('h3', { text: p.ad }),
      el('p', { class: 'soluk kucuk', text: (p.sinif === 'Diğer' ? '' : p.sinif + '. sınıf • ') + (p.gun < 0 ? 'Henüz başlamadı' : 'Gün ' + p.gun + ' / 30') })
    ]));
  });
  iz.appendChild(el('div', { class: 'kart', onclick: profilOlustur }, [el('div', { class: 'simge', text: '➕' }), el('h3', { text: 'Yeni profil' })]));
  e.appendChild(iz);
}

/* ---------- Ana sayfa ---------- */
function sonrakiGun() { var p = P(); return p.gun + 1; }
function bugunAcikMi() { var p = P(); return p.gun < 30 && (!p.ayar.gunSiniri || p.sonGunTarihi !== bugun()); }
function okumaKayitlari(p) { return (p || P()).kayitlar.filter(function (k) { return (k.tur === 'okuma' || k.tur === 'test') && k.kh; }); }

function anaSayfa() {
  var p = P(); if (!p) return profilSec();
  var e = ekranTemizle(); cikisFn = null;
  var g = sonrakiGun(), gun = PROGRAM[Math.min(g, 30)], hafta = HAFTALAR[gun.hafta];
  e.appendChild(el('h1', { text: 'Hoş geldin ' + p.ad + ' 👋' }));

  // nazik uyarılar
  var son = p.calisilanGunler[p.calisilanGunler.length - 1];
  if (son && gunFarki(son, bugun()) >= 3 && p.gun < 30) e.appendChild(el('div', { class: 'uyari', html: '<b>' + gunFarki(son, bugun()) + ' gündür çalışmadın.</b> Sorun değil, bugün yeniden başlayabilirsin! Düzenli çalışmak gelişimin anahtarı.' }));
  var ok = okumaKayitlari();
  if (ok.length >= 2) {
    var s2 = ok.slice(-2);
    if (s2[0].an < 60 && s2[1].an < 60) e.appendChild(el('div', { class: 'uyari', html: 'Son iki okumada anlaman %60\'ın altında kaldı. Bugün <b>daha yavaş ve dikkatli</b> oku; program hedef hızını zaten düşürdü.' }));
  }

  var kart = el('div', { class: 'kart vurgulu orta' });
  if (p.gun >= 30) {
    kart.appendChild(el('div', { class: 'simge', text: '🦅', style: 'font-size:3.5rem' }));
    kart.appendChild(el('h2', { text: 'Programı tamamladın, tebrikler!' }));
    kart.appendChild(el('p', { text: 'Artık serbest alıştırmalar ve kütüphane ile çalışmaya devam edebilirsin. Haftada 2–3 kez çalışmak kazandığın hızı korur.' }));
    kart.appendChild(el('button', { class: 'btn buyuk', text: '🏅 Başarı belgem', onclick: belge }));
    kart.appendChild(el('button', { class: 'btn ikincil', text: 'Serbest alıştırmalar', onclick: alistirmalar }));
  } else if (bugunAcikMi()) {
    kart.appendChild(el('div', { class: 'soluk', text: g === 0 ? 'İlk adım' : 'Hafta ' + gun.hafta + ' • ' + hafta.baslik }));
    kart.appendChild(el('h2', { text: (g === 0 ? '' : 'Gün ' + g + ' / 30: ') + gun.baslik, style: 'margin-top:.2rem' }));
    kart.appendChild(el('p', { class: 'soluk', text: g === 0 ? 'Önce başlangıç hızını ve anlamanı ölçelim. Yaklaşık 10 dakika.' : hafta.aciklama }));
    kart.appendChild(el('button', { class: 'btn buyuk', text: '▶ Bugünkü antrenmana başla', onclick: antrenmanGiris }));
  } else {
    kart.appendChild(el('div', { class: 'simge', text: '✅', style: 'font-size:3rem' }));
    kart.appendChild(el('h2', { text: 'Bugünkü antrenmanı tamamladın!' }));
    kart.appendChild(el('p', { html: 'Yarın seni <b>Gün ' + g + '</b> bekliyor. Bugün istersen serbest alıştırma yapabilir ya da kendi kitabını okuyabilirsin. Gözlerini de dinlendirmeyi unutma 🌿' }));
    kart.appendChild(el('button', { class: 'btn ikincil', text: '🏋️ Serbest alıştırmalar', onclick: alistirmalar }));
  }
  e.appendChild(kart);

  if (p.baslangic) {
    var sonOk = ok[ok.length - 1];
    var ist = el('div', { class: 'istatistik' }, [
      el('div', null, [el('b', { text: '🔥 ' + p.seri }), el('span', { text: 'günlük seri' })]),
      el('div', null, [el('b', { text: p.baslangic.eoh }), el('span', { text: 'başlangıç etkili hız' })]),
      el('div', null, [el('b', { text: sonOk ? sonOk.eoh : '–' }), el('span', { text: 'son etkili hız' })]),
      el('div', null, [el('b', { text: p.hedef }), el('span', { text: 'hedef hız (kelime/dk)' })])
    ]);
    e.appendChild(el('div', { class: 'kart' }, [el('div', { class: 'satir-arasi' }, [el('h3', { text: '📈 Durumum', style: 'margin:0' }), el('button', { class: 'btn ikincil', text: 'Ayrıntılar', onclick: ilerleme })]), ist, takvim()]));
  }

  var iz = el('div', { class: 'izgara' });
  [['🏋️', 'Serbest alıştırmalar', 'Tüm egzersizler, istediğin ayarla', alistirmalar], ['📚', 'Kütüphane', 'Okuduğun metinleri farklı yöntemlerle tekrar oku', kutuphane],
   ['📒', 'Kelime defterim', Object.keys(p.kelimeler).length + ' kelime', kelimeDefteri], ['🗣️', 'Sesli okuma ölçümü', 'Bir yetişkinle 1 dakikalık akıcılık ölçümü', sesliOlcum],
   ['❓', 'Nasıl kullanılır?', 'Rehber, ipuçları, sağlık uyarıları', rehber]]
    .forEach(function (x) { iz.appendChild(el('div', { class: 'kart', onclick: x[3] }, [el('div', { class: 'simge', text: x[0] }), el('h3', { text: x[1] }), el('p', { class: 'soluk kucuk', text: x[2], style: 'margin:0' })])); });
  e.appendChild(iz);
  rozetGoster();
}

function takvim() {
  var p = P(); var t = el('div', { class: 'gun-takvim', style: 'margin-top:.8rem' });
  for (var g = 1; g <= 30; g++) {
    var c = g <= p.gun ? 'tamam' : (g === p.gun + 1 ? 'simdi' : '');
    if (g === 15 || g === 30) c += ' test';
    t.appendChild(el('span', { class: c, title: 'Gün ' + g + (g === 15 ? ' – Ara Test' : g === 30 ? ' – Bitiş Testi' : ''), text: g <= p.gun ? '✓' : String(g) }));
  }
  return t;
}

/* ---------- Günlük antrenman ---------- */
function antrenmanGiris() {
  var p = P();
  if (p.gun >= 30) return anaSayfa();
  if (!bugunAcikMi()) { anaSayfa(); return; }
  var g = sonrakiGun(), gun = PROGRAM[g];
  var e = ekranTemizle(); cikisFn = null;
  var hafta = HAFTALAR[gun.hafta];
  e.appendChild(el('h1', { text: (g === 0 ? '' : 'Gün ' + g + ': ') + gun.baslik }));
  if (g > 0 && (g - 1) % 5 === 0 && !gun.test) e.appendChild(el('div', { class: 'bilgi', html: '<b>' + hafta.simge + ' ' + gun.hafta + '. Hafta: ' + hafta.baslik + '</b><br>' + hafta.aciklama + '<br><i>Haftanın ipucu: ' + hafta.ipucu + '</i>' }));
  if (gun.test) e.appendChild(el('div', { class: 'bilgi', html: 'Bugün <b>test günü</b>. Her zamanki gibi, anlayarak oku. Sonuç gelişimini gösterecek.' }));
  var liste = el('div', { class: 'kart' }, [el('h3', { text: 'Bugünkü adımlar', style: 'margin-top:0' })]);
  gun.adimlar.forEach(function (a, i) { liste.appendChild(el('p', { style: 'margin:.3rem 0', text: (i + 1) + '. ' + adimSimge(a) + ' ' + adimAdi(a) })); });
  liste.appendChild(el('p', { class: 'soluk kucuk', text: 'Tahmini süre: ' + (gun.test ? '10–15' : '15–25') + ' dakika. Adımlar arasında kısa nefes molası verebilirsin.' }));
  e.appendChild(liste);
  e.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn buyuk', text: '▶ Başlayalım', onclick: function () { adimCalistir(g, 0, []); } })]));
}

function adimCalistir(g, i, sonuclar) {
  var gun = PROGRAM[g], adim = gun.adimlar[i];
  if (!adim) return antrenmanBitti(g, sonuclar);
  var e = ekranTemizle();
  cikisFn = function () { cikisSor(anaSayfa); };
  e.appendChild(el('div', { class: 'adimbar' }, [
    el('span', { text: 'Adım ' + (i + 1) + '/' + gun.adimlar.length }),
    el('div', { class: 'ilerleme' }, [el('i', { style: 'width:' + (i / gun.adimlar.length * 100) + '%' })]),
    el('button', { class: 'btn ikincil', text: '✕', title: 'Çık', style: 'min-height:2.2rem;padding:.2rem .7rem', onclick: function () { cikisSor(anaSayfa); } })
  ]));
  var kap = el('div', { style: 'margin-top:.8rem' }); e.appendChild(kap);
  egzersizCalistir(kap, adim, function (sonuc) {
    if (sonuc && sonuc.kayit) { sonuc.kayit.gun = g; kayitEkle(sonuc.kayit); sonuclar.push(sonuc.kayit); }
    if (!sonuc || !sonuc.satirlar) return adimCalistir(g, i + 1, sonuclar);
    kap.innerHTML = ''; window.scrollTo(0, 0);
    kap.appendChild(sonucKutusu(sonuc.baslik, sonuc.satirlar, sonuc.notlar)); rozetGoster();
    var son = i === gun.adimlar.length - 1;
    kap.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn buyuk', text: son ? 'Antrenmanı bitir ✔' : 'Sonraki adım ▶', onclick: function () { adimCalistir(g, i + 1, sonuclar); } })]));
  });
}

function antrenmanBitti(g, sonuclar) {
  var p = P();
  p.gun = g; p.sonGunTarihi = bugun(); kaydet();
  if (g > 0 && g % 5 === 0 && g < 30) rozetVer('h' + (g / 5));
  if (g === 30) rozetVer('mezun');
  rozetDenetle();
  var e = ekranTemizle(); cikisFn = null;
  var ok = sonuclar.filter(function (k) { return k.kh; })[0];
  e.appendChild(el('div', { class: 'kart orta vurgulu' }, [
    el('div', { text: g === 30 ? '🦅' : '🌟', style: 'font-size:3.5rem' }),
    el('h1', { text: g === 0 ? 'Harika bir başlangıç!' : g === 30 ? 'Programı bitirdin!' : 'Gün ' + g + ' tamam!' }),
    el('p', { html: '🔥 Serin: <b>' + p.seri + ' gün</b>' + (ok ? ' • Bugünkü etkili okuma hızın: <b>' + ok.eoh + ' kelime/dk</b>' : '') })
  ]));
  if (g === 15 || g === 30) e.appendChild(karsilastirma());
  if (g < 30) {
    var y = PROGRAM[g + 1];
    e.appendChild(el('div', { class: 'bilgi', html: '<b>Yarın:</b> ' + (y.test ? y.baslik : 'Gün ' + (g + 1) + ' – ' + y.baslik) + '. Bugün kendi kitabından en az 20 dakika okumayı unutma! 📖' }));
  }
  e.appendChild(el('p', { class: 'orta' }, [
    g === 30 ? el('button', { class: 'btn buyuk', text: '🏅 Başarı belgemi gör', onclick: belge }) : null,
    el('button', { class: 'btn buyuk' + (g === 30 ? ' ikincil' : ''), text: 'Ana sayfa', onclick: anaSayfa }),
    el('button', { class: 'btn ikincil', text: '📈 İlerlemem', onclick: ilerleme })
  ]));
  rozetGoster();
}

function karsilastirma() {
  var p = P(); var testler = p.kayitlar.filter(function (k) { return k.tur === 'test'; });
  var b = p.baslangic, son = testler[testler.length - 1];
  if (!b || !son) return el('div');
  var t = el('table', { class: 'tablo' }, [el('tr', null, [el('th', { text: '' }), el('th', { text: 'Başlangıç' }), el('th', { text: son.test === 'bitis' ? 'Bitiş' : 'Ara test' }), el('th', { text: 'Değişim' })])]);
  [['Okuma hızı (kelime/dk)', 'kh'], ['Anlama (%)', 'an'], ['Etkili okuma hızı', 'eoh']].forEach(function (s) {
    var a = b[s[1]], c = son[s[1]], d = a ? Math.round((c / a - 1) * 100) : 0;
    t.appendChild(el('tr', null, [el('td', { text: s[0] }), el('td', { text: String(a) }), el('td', { text: String(c) }), el('td', { html: '<b style="color:' + (d >= 0 ? 'var(--iyi)' : 'var(--kotu)') + '">' + (d >= 0 ? '+' : '') + d + '%</b>' })]));
  });
  return el('div', { class: 'kart' }, [el('h3', { text: '📊 Gelişimin', style: 'margin-top:0' }), el('div', { class: 'tablo-kap' }, [t])]);
}

/* ---------- Serbest alıştırmalar ---------- */
function alistirmalar() {
  var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '🏋️ Serbest alıştırmalar' }));
  e.appendChild(el('p', { class: 'soluk', text: 'İstediğin egzersizi istediğin kadar yapabilirsin. Programın yerine değil, yanında kullan. Gözlerin yorulursa dinlen.' }));
  var liste = [
    { tur: 'isinma', secenek: { ad: 'Desen', alan: 'desen', d: [['karma', 'Karma'], ['yatay', 'Sağa-sola'], ['dikey', 'Yukarı-aşağı'], ['capraz', 'Çapraz'], ['daire', 'Daire'], ['sekiz', 'Sekiz']] } },
    { tur: 'schulte', secenek: { ad: 'Boyut', alan: 'n', d: [[3, '3×3'], [4, '4×4'], [5, '5×5']], sayi: true }, ikinci: { ad: 'Tür', alan: 'tip', d: [['sayi', 'Sayı'], ['harf', 'Harf']] } },
    { tur: 'harfavi', secenek: { ad: 'Harfler', alan: 'set', d: HARF_SETLERI.map(function (s, i) { return [i, s.join(' – ')]; }), sayi: true } },
    { tur: 'aynifarkli' },
    { tur: 'simsek', secenek: { ad: 'İçerik', alan: 'icerik', d: [['kelime', 'Tek kelime'], ['grup2', 'İkili grup'], ['grup3', 'Üçlü grup'], ['sayi', 'Sayı']] } },
    { tur: 'gorus' },
    { tur: 'tekrarli', metinSec: true },
    { tur: 'gozatma', metinSec: true },
    { tur: 'tarama', metinSec: true },
    { tur: 'kelime' },
    { tur: 'dinlen' }
  ];
  var iz = el('div', { class: 'izgara' });
  liste.forEach(function (x) {
    var E = EGZ[x.tur], ayar = {};
    var kart = el('div', { class: 'kart', style: 'cursor:default' }, [el('div', { class: 'simge', text: E.simge }), el('h3', { text: E.ad }), el('p', { class: 'soluk kucuk', text: E.kisa })]);
    [x.secenek, x.ikinci].forEach(function (s) {
      if (!s) return;
      var sel = el('select', { 'aria-label': s.ad, style: 'width:100%;margin:.2rem 0', onchange: function () { ayar[s.alan] = s.sayi ? +sel.value : sel.value; } });
      s.d.forEach(function (o) { sel.appendChild(el('option', { value: o[0], text: s.ad + ': ' + o[1] })); });
      ayar[s.alan] = s.d[0][0]; kart.appendChild(sel);
    });
    if (x.metinSec) {
      var sel = el('select', { style: 'width:100%;margin:.2rem 0', onchange: function () { ayar.metin = sel.value; } });
      window.METINLER.filter(function (m) { return m.id[0] !== 'T'; }).forEach(function (m) { sel.appendChild(el('option', { value: m.id, text: m.baslik })); });
      ayar.metin = 'G01'; kart.appendChild(sel);
    }
    kart.appendChild(el('button', { class: 'btn tam', text: 'Başla', onclick: function () { tekEgzersiz({ tur: x.tur, ayar: Object.assign({}, ayar) }, alistirmalar); } }));
    iz.appendChild(kart);
  });
  e.appendChild(iz);
}

function tekEgzersiz(adim, geri) {
  var e = ekranTemizle();
  cikisFn = function () { cikisFn = null; geri(); };
  e.appendChild(el('p', null, [el('button', { class: 'btn ikincil', text: '◀ Geri', onclick: function () { cikisFn = null; geri(); } })]));
  var kap = el('div'); e.appendChild(kap);
  egzersizCalistir(kap, adim, function (sonuc) {
    if (sonuc && sonuc.kayit) { sonuc.kayit.serbest = true; kayitEkle(sonuc.kayit); }
    kap.innerHTML = ''; window.scrollTo(0, 0);
    if (sonuc && sonuc.satirlar) kap.appendChild(sonucKutusu(sonuc.baslik, sonuc.satirlar, sonuc.notlar));
    rozetGoster();
    kap.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn buyuk', text: '↻ Tekrar', onclick: function () { tekEgzersiz(adim, geri); } }), el('button', { class: 'btn ikincil', text: 'Geri dön', onclick: function () { cikisFn = null; geri(); } })]));
  });
}

/* ---------- Kütüphane ---------- */
function kutuphane() {
  var e = ekranTemizle(); cikisFn = null; var p = P();
  e.appendChild(el('h1', { text: '📚 Okuma kütüphanesi' }));
  e.appendChild(el('p', { class: 'soluk', text: 'Bir metin ve yöntem seç. Programda henüz sırası gelmemiş metinleri okursan, o gün metni ikinci kez okumuş olursun ve ölçüm biraz yüksek çıkabilir. Bu yüzden önce okuduğun metinleri tekrar etmeni öneririz.' }));
  var okunan = {}; p.kayitlar.forEach(function (k) { if (k.metin) okunan[k.metin] = (okunan[k.metin] || 0) + 1; });
  var yontem = el('select'); Object.keys(YONTEMLER).forEach(function (y) { yontem.appendChild(el('option', { value: y, text: YONTEMLER[y].simge + ' ' + YONTEMLER[y].ad })); });
  var grup = el('select'); [[1, 'tek tek'], [2, 'ikili'], [3, 'üçlü']].forEach(function (o) { grup.appendChild(el('option', { value: o[0], text: 'Grup: ' + o[1] })); }); grup.value = 2;
  var AMAC = { ders: [0.85, 'Ders çalışmak / iyice öğrenmek', 'Yavaş ve dikkatli oku; önemli yerlerde dur, kendine soru sor.'], genel: [1, 'Genel bilgi edinmek', 'Hedef hızında, anlayarak oku.'], goz: [1.4, 'Hızlıca göz gezdirmek', 'Ayrıntıya takılma; ana fikri ve önemli kelimeleri yakala.'] };
  var amac = el('select'), amacBilgi = el('p', { class: 'soluk kucuk' });
  Object.keys(AMAC).forEach(function (a) { amac.appendChild(el('option', { value: a, text: AMAC[a][1] })); }); amac.value = 'genel';
  function amacYaz() { var a = AMAC[amac.value]; amacBilgi.innerHTML = '📌 ' + a[2] + ' Bu amaçla hız ayarlı yöntemlerde hızın: <b>' + yuvarla(hedefHiz() * a[0], 5) + ' kelime/dk</b> (hedefin ' + hedefHiz() + ').'; }
  amac.onchange = amacYaz; amacYaz();
  var carpan = function () { return AMAC[amac.value][0]; };
  e.appendChild(el('div', { class: 'kart' }, [el('div', { class: 'form-satir' }, [el('label', { text: 'Okuma yöntemi' }), yontem, ' ', grup]),
    el('div', { class: 'form-satir' }, [el('label', { text: 'Okuma amacın' }), amac]), amacBilgi,
    el('p', { class: 'soluk kucuk', html: 'İyi okur her metni aynı hızda okumaz; <b>amaca göre</b> hız seçer. Testler (T1–T3) kütüphanede yok; onlar ölçme içindir.' })]));
  e.appendChild(kendiMetinKarti(yontem, grup, carpan));
  var tablo = el('table', { class: 'tablo' }, [el('tr', null, [el('th', { text: 'Metin' }), el('th', { text: 'Kelime' }), el('th', { text: 'Zorluk', title: 'Ateşman okunabilirlik formülüne göre' }), el('th', { text: 'Okundu' }), el('th', { text: '' })])]);
  window.METINLER.filter(function (m) { return m.id[0] !== 'T'; }).forEach(function (m) {
    var ob = okunabilirlik(m.metin);
    tablo.appendChild(el('tr', null, [el('td', { text: m.baslik }), el('td', { text: String(kelimeSay(m.metin)) }), el('td', { text: ob.etiket + ' · ' + ob.puan, title: 'Ateşman okunabilirlik puanı (0–100): yüksek puan daha kolay demektir' }), el('td', { text: okunan[m.id] ? '✓ ' + okunan[m.id] : '' }),
      el('td', null, [el('button', { class: 'btn', style: 'min-height:2.3rem;padding:.3rem .8rem', text: 'Oku', onclick: function () {
        tekEgzersiz({ tur: 'okuma', ayar: { metin: m.id, yontem: yontem.value, k: +grup.value, hiz: yuvarla(hedefHiz() * carpan(), 5), serbestAyar: true } }, kutuphane);
      } })])]));
  });
  e.appendChild(el('div', { class: 'kart tablo-kap' }, [tablo]));
}

/* ---------- İlerleme ---------- */
function cizgiGrafik(seriler, ops) {
  ops = ops || {}; var W = 640, H = 230, sol = 42, alt = 26, ust = 12, sag = 10;
  var n = Math.max.apply(null, seriler.map(function (s) { return s.d.length; }));
  var tum = []; seriler.forEach(function (s) { tum = tum.concat(s.d); });
  var maks = ops.maks || Math.max(50, Math.ceil(Math.max.apply(null, tum) / 50) * 50), min = 0;
  function x(i) { return sol + (n <= 1 ? (W - sol - sag) / 2 : i * (W - sol - sag) / (n - 1)); }
  function y(v) { return ust + (H - ust - alt) * (1 - (v - min) / (maks - min)); }
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(ops.etiket || 'grafik') + '">';
  for (var k = 0; k <= 4; k++) { var v = min + (maks - min) * k / 4, yy = y(v); svg += '<line x1="' + sol + '" x2="' + (W - sag) + '" y1="' + yy + '" y2="' + yy + '" stroke="var(--cizgi)"/><text x="' + (sol - 6) + '" y="' + (yy + 4) + '" font-size="11" text-anchor="end" fill="var(--soluk)">' + Math.round(v) + '</text>'; }
  for (var i = 0; i < n; i++) if (n <= 12 || i % Math.ceil(n / 12) === 0) svg += '<text x="' + x(i) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" fill="var(--soluk)">' + (i + 1) + '</text>';
  seriler.forEach(function (s) {
    var pts = s.d.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ');
    svg += '<polyline points="' + pts + '" fill="none" stroke="' + s.renk + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    s.d.forEach(function (v, i) { svg += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4" fill="' + s.renk + '"><title>' + s.ad + ': ' + v + '</title></circle>'; });
  });
  svg += '</svg>';
  var lej = el('p', { class: 'kucuk', html: seriler.map(function (s) { return '<span style="color:' + s.renk + '">●</span> ' + s.ad; }).join(' &nbsp; ') });
  var d = el('div', { class: 'grafik', html: svg }); d.appendChild(lej); return d;
}

function ilerleme() {
  var p = P(); var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('div', { class: 'satir-arasi' }, [el('h1', { text: '📈 İlerlemem' }), el('div', { class: 'yazdirma' }, [el('button', { class: 'btn ikincil', text: '🖨️ Rapor', onclick: rapor })])]));
  var ok = okumaKayitlari();
  if (!ok.length) { e.appendChild(el('div', { class: 'bilgi', text: 'Henüz okuma kaydın yok. Başlangıç testini yapınca gelişimin burada görünecek.' })); return; }
  var enIyi = ok.reduce(function (a, b) { return b.eoh > a.eoh ? b : a; });
  e.appendChild(el('div', { class: 'kart' }, [el('div', { class: 'istatistik' }, [
    el('div', null, [el('b', { text: String(p.gun < 0 ? 0 : p.gun) }), el('span', { text: 'tamamlanan gün / 30' })]),
    el('div', null, [el('b', { text: '🔥 ' + p.seri }), el('span', { text: 'seri (en uzun ' + p.enUzunSeri + ')' })]),
    el('div', null, [el('b', { text: p.baslangic ? p.baslangic.eoh : '–' }), el('span', { text: 'başlangıç etkili hız' })]),
    el('div', null, [el('b', { text: enIyi.eoh }), el('span', { text: 'en iyi etkili hız' })]),
    el('div', null, [el('b', { text: String(ok.length) }), el('span', { text: 'okunan metin' })]),
    el('div', null, [el('b', { text: String(Object.keys(p.kelimeler).length) }), el('span', { text: 'yeni kelime' })])
  ]), takvim()]));
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Hız gelişimi (kelime/dk)', style: 'margin-top:0' }),
    cizgiGrafik([{ ad: 'Okuma hızı', renk: '#1f6f8b', d: ok.map(function (k) { return k.kh; }) }, { ad: 'Etkili okuma hızı (hız × anlama)', renk: '#e8a33d', d: ok.map(function (k) { return k.eoh; }) }], { etiket: 'Hız grafiği' }),
    el('p', { class: 'soluk kucuk', text: 'Yatay eksen: kaçıncı okuma. Turuncu çizginin yükselmesi, hem hızlandığını hem de anladığını gösterir.' })]));
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Anlama (%)', style: 'margin-top:0' }),
    cizgiGrafik([{ ad: 'Anlama', renk: '#2e8b57', d: ok.map(function (k) { return k.an; }) }], { maks: 100, etiket: 'Anlama grafiği' }),
    el('p', { class: 'soluk kucuk', text: 'Hedef: anlamanı %70\'in üstünde tutmak.' })]));
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Hız mı, anlama mı? (dağılım)', style: 'margin-top:0' }), dagilimGrafik(ok)]));
  if (p.kayitlar.filter(function (k) { return k.tur === 'test'; }).length > 1) e.appendChild(karsilastirma());
  var tk = p.kayitlar.filter(function (k) { return k.tur === 'tekrar'; }), ss = p.kayitlar.filter(function (k) { return k.tur === 'sesli'; });
  var th = p.kayitlar.filter(function (k) { return k.tahmin && k.an != null && k.tur !== 'kendi'; });
  if (tk.length || ss.length || th.length) {
    var ek = el('div', { class: 'kart' }, [el('h3', { text: '🔁 🗣️ 🤔 Diğer ölçümler', style: 'margin-top:0' })]);
    if (tk.length) ek.appendChild(el('p', { html: '<b>Tekrarlı okuma:</b> ' + tk.map(function (k) { var m = metinBul(k.metin); return (m ? m.baslik : '') + ' ' + k.kh1 + '→' + k.kh; }).join(' • ') }));
    if (ss.length) { var sn_ = ss[ss.length - 1]; ek.appendChild(el('p', { html: '<b>Sesli okuma (son):</b> dakikada ' + sn_.dks + ' doğru kelime, doğruluk %' + sn_.dogruluk + ', akıcılık ' + sn_.prozodi + '/16 (' + ss.length + ' ölçüm)' })); }
    if (th.length) { var isabet = th.filter(function (k) { return k.tahmin === tahminSeviye(k.an); }).length; ek.appendChild(el('p', { html: '<b>Kendini tahmin:</b> ' + th.length + ' okumanın ' + isabet + '\'inde ne kadar anladığını tam isabetle tahmin ettin.' })); }
    e.appendChild(ek);
  }

  // rekorlar
  var R = p.rekorlar, rs = [];
  [['schulte3', 'Schulte 3×3', 'ms'], ['schulte4', 'Schulte 4×4', 'ms'], ['schulte5', 'Schulte 5×5', 'ms'], ['schulte4h', 'Schulte 4×4 harf', 'ms'], ['schulte5h', 'Schulte 5×5 harf', 'ms'],
   ['harfavi', 'Harf avı (puan)', ''], ['aynifarkli', 'Aynı-Farklı (doğru)', ''], ['simsekMs_kelime', 'Şimşek kelime', 'ms2'], ['simsekMs_grup2', 'Şimşek ikili grup', 'ms2'], ['simsekMs_grup3', 'Şimşek üçlü grup', 'ms2'],
   ['gorus', 'Görüş alanı seviyesi', ''], ['tarama', 'Tarama (kelime başına)', 'ms']].forEach(function (x) {
    if (R[x[0]] != null) rs.push(el('tr', null, [el('td', { text: x[1] }), el('td', { text: x[2] === 'ms' ? sn(R[x[0]]) : x[2] === 'ms2' ? R[x[0]] + ' ms' : String(R[x[0]]) })]));
  });
  if (rs.length) e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: '🏆 Kişisel rekorlarım', style: 'margin-top:0' }), el('table', { class: 'tablo' }, rs)]));

  var rz = el('div', { class: 'rozetler' });
  ROZETLER.forEach(function (r) { rz.appendChild(el('div', { class: 'rozet' + (p.rozetler[r.k] ? '' : ' yok'), title: r.d }, [el('span', { class: 'r', text: r.r }), el('b', { text: r.a }), el('div', { class: 'soluk', text: r.d })])); });
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: '🎖️ Rozetlerim', style: 'margin-top:0' }), rz]));

  var tb = el('table', { class: 'tablo' }, [el('tr', null, ['Tarih', 'Gün', 'Metin', 'Yöntem', 'Hız', 'Anlama', 'Etkili hız'].map(function (b) { return el('th', { text: b }); }))]);
  ok.slice().reverse().forEach(function (k) {
    var m = metinBul(k.metin);
    tb.appendChild(el('tr', null, [new Date(k.t).toLocaleDateString('tr-TR'), k.serbest ? 'serbest' : String(k.gun), m ? m.baslik : k.metin, k.tur === 'test' ? 'Test' : (YONTEMLER[k.yontem] || {}).ad || '', String(k.kh), '%' + k.an, String(k.eoh)].map(function (v) { return el('td', { text: v }); })));
  });
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Tüm okumalarım', style: 'margin-top:0' }), el('div', { class: 'tablo-kap' }, [tb])]));
}

/* ---------- Rapor ve belge ---------- */
function rapor() {
  var p = P(); var e = ekranTemizle(); cikisFn = null;
  var ok = okumaKayitlari();
  e.appendChild(el('p', { class: 'yazdirma' }, [el('button', { class: 'btn', text: '🖨️ Yazdır / PDF kaydet', onclick: function () { window.print(); } }), el('button', { class: 'btn ikincil', text: '◀ Geri', onclick: ilerleme })]));
  e.appendChild(el('h1', { text: 'Kartal Bakışı – Öğrenci Gelişim Raporu' }));
  e.appendChild(el('p', { html: '<b>Öğrenci:</b> ' + esc(p.ad) + (p.sinif !== 'Diğer' ? ' • <b>Sınıf:</b> ' + p.sinif : '') + ' • <b>Rapor tarihi:</b> ' + tarihYaz(new Date().toISOString()) + '<br><b>Programa başlama:</b> ' + tarihYaz(p.olusturma) + ' • <b>Tamamlanan gün:</b> ' + Math.max(0, p.gun) + ' / 30 • <b>Çalışılan gün sayısı:</b> ' + p.calisilanGunler.length + ' • <b>En uzun seri:</b> ' + p.enUzunSeri + ' gün' }));
  if (p.baslangic) e.appendChild(karsilastirma());
  if (ok.length) {
    e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Hız gelişimi', style: 'margin-top:0' }), cizgiGrafik([{ ad: 'Okuma hızı', renk: '#1f6f8b', d: ok.map(function (k) { return k.kh; }) }, { ad: 'Etkili okuma hızı', renk: '#e8a33d', d: ok.map(function (k) { return k.eoh; }) }])]));
    var ort = Math.round(ok.reduce(function (a, k) { return a + k.an; }, 0) / ok.length);
    e.appendChild(el('p', { html: '<b>Ortalama anlama:</b> %' + ort + ' • <b>Okunan metin:</b> ' + ok.length + ' • <b>Öğrenilen kelime:</b> ' + Object.keys(p.kelimeler).length + ' • <b>Rozet:</b> ' + Object.keys(p.rozetler).length + ' / ' + ROZETLER.length }));
  }
  e.appendChild(el('div', { class: 'bilgi kucuk', html: '<b>Ölçüler hakkında:</b> Okuma hızı = dakikada okunan kelime. Anlama = 5 sorudaki doğru oranı. Etkili okuma hızı = okuma hızı × anlama oranı. Hız ayarlı yöntemlerde (rehberli, grup, tek nokta) hız, programın ayarladığı hızdır. Gelişim en doğru biçimde Başlangıç, Ara ve Bitiş testlerinin karşılaştırılmasıyla görülür.' }));
  e.appendChild(el('p', { class: 'kucuk', html: '<br>Veli / Öğretmen görüşü: ......................................................................................................<br><br>İmza: ..............................' }));
}

function belge() {
  var p = P(); var e = ekranTemizle(); cikisFn = null;
  var testler = p.kayitlar.filter(function (k) { return k.tur === 'test'; }), son = testler[testler.length - 1], b = p.baslangic;
  e.appendChild(el('p', { class: 'yazdirma' }, [el('button', { class: 'btn', text: '🖨️ Yazdır', onclick: function () { window.print(); } }), el('button', { class: 'btn ikincil', text: '◀ Ana sayfa', onclick: anaSayfa })]));
  var art = b && son ? Math.round((son.eoh / b.eoh - 1) * 100) : null;
  e.appendChild(el('div', { class: 'belge' }, [
    el('div', { text: '🦅', style: 'font-size:3.5rem' }),
    el('h1', { text: 'Başarı Belgesi' }),
    el('p', { style: 'font-size:1.2rem', html: '<b style="font-size:1.6rem">' + esc(p.ad) + '</b><br>“Kartal Bakışı – Anlayarak Hızlı Okuma” programını ' + (p.gun >= 30 ? 'başarıyla tamamlamıştır.' : 'sürdürmektedir (' + Math.max(0, p.gun) + '/30 gün).') }),
    b && son ? el('p', { html: 'Etkili okuma hızı: <b>' + b.eoh + '</b> → <b>' + son.eoh + '</b> kelime/dk' + (art != null ? ' (' + (art >= 0 ? '+' : '') + art + '%)' : '') + '<br>Okuma hızı: ' + b.kh + ' → ' + son.kh + ' kelime/dk • Anlama: %' + b.an + ' → %' + son.an }) : null,
    el('p', { html: 'Öğrenilen kelime: ' + Object.keys(p.kelimeler).length + ' • Rozet: ' + Object.keys(p.rozetler).length + ' • En uzun seri: ' + p.enUzunSeri + ' gün' }),
    el('p', { text: tarihYaz(new Date().toISOString()) }),
    el('p', { class: 'kucuk', html: '<br>Veli / Öğretmen: ..............................' })
  ]));
}

/* ---------- Kelime defteri ---------- */
function kelimeDefteri() {
  var p = P(); var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '📒 Kelime defterim' }));
  var ks = Object.keys(p.kelimeler).sort(function (a, b) { return a.localeCompare(b, 'tr'); });
  if (!ks.length) { e.appendChild(el('div', { class: 'bilgi', text: 'Antrenmanlardaki Kelime Hazinesi adımında öğrendiğin kelimeler burada birikir.' })); return; }
  e.appendChild(el('p', { class: 'soluk', text: ks.length + ' kelime. Her gün birkaçını konuşurken ya da yazarken kullanmaya çalış.' }));
  var t = el('table', { class: 'tablo' }, [el('tr', null, [el('th', { text: 'Kelime' }), el('th', { text: 'Anlamı' }), el('th', { text: 'Metin' })])]);
  ks.forEach(function (k) { var x = p.kelimeler[k], m = metinBul(x.m); t.appendChild(el('tr', null, [el('td', { html: '<b>' + esc(k) + '</b>' + (x.d ? '' : ' <span title="İlk denemede yanlış">🔁</span>') }), el('td', { text: x.a }), el('td', { class: 'soluk', text: m ? m.baslik : '' })])); });
  e.appendChild(el('div', { class: 'kart tablo-kap' }, [t]));
  e.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn', text: '📚 Kelimelerle alıştırma yap', onclick: function () { tekEgzersiz({ tur: 'kelime', ayar: { adet: 6 } }, kelimeDefteri); } })]));
}

/* ---------- Ayarlar ---------- */
function ayarlar() {
  var p = P(); var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '⚙️ Ayarlar ve yedekleme' }));
  function anahtar(etiket, aciklama, alan, ters) {
    var c = el('input', { type: 'checkbox', onchange: function () { p.ayar[alan] = ters ? !c.checked : c.checked; kaydet(); } });
    c.checked = ters ? p.ayar[alan] === false : !!p.ayar[alan];
    return el('label', null, [c, el('span', { html: '<b>' + etiket + '</b><br><span class="soluk kucuk">' + aciklama + '</span>' })]);
  }
  e.appendChild(el('div', { class: 'kart liste-kontrol' }, [
    el('h3', { text: 'Çalışma', style: 'margin-top:0' }),
    anahtar('Işık hassasiyeti', 'Hızlı yanıp sönen gösterimleri yavaşlatır (Şimşek kelime, Görüş alanı).', 'yanip', true),
    anahtar('Günde bir antrenman sınırı', 'Açıkken her gün yalnızca bir program günü açılır (önerilir). Sınıfta toplu kullanımda kapatılabilir.', 'gunSiniri')
  ]));
  var boy = el('select', { onchange: function () { p.ayar.boyut = +boy.value; kaydet(); ayarUygula(); } });
  [[0.9, 'Küçük'], [1, 'Normal'], [1.15, 'Büyük'], [1.3, 'Çok büyük'], [1.5, 'En büyük']].forEach(function (o) { boy.appendChild(el('option', { value: o[0], text: o[1] })); }); boy.value = p.ayar.boyut;
  var tema = el('select', { onchange: function () { p.ayar.tema = tema.value; kaydet(); ayarUygula(); } });
  [['acik', 'Açık'], ['koyu', 'Koyu']].forEach(function (o) { tema.appendChild(el('option', { value: o[0], text: o[1] })); }); tema.value = p.ayar.tema;
  function secim(etiket, alan, ops, vars) {
    var sl = el('select', { onchange: function () { p.ayar[alan] = isNaN(+sl.value) || sl.value === '' ? sl.value : +sl.value; if (sl.value === 'true' || sl.value === 'false') p.ayar[alan] = sl.value === 'true'; kaydet(); ayarUygula(); } });
    ops.forEach(function (o) { sl.appendChild(el('option', { value: String(o[0]), text: o[1] })); }); sl.value = String(p.ayar[alan] != null ? p.ayar[alan] : vars);
    return el('div', { class: 'form-satir' }, [el('label', { text: etiket }), sl]);
  }
  var ornek = el('div', { class: 'metin', style: 'margin:.6rem 0' }, [el('p', { text: 'Örnek metin: Kartal, yüksekten süzülürken yerdeki küçük ayrıntıları bile görebilir. Sen de okurken dikkatini toplayıp anlamı yakalamaya çalış.' })]);
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Görünüm ve okuma rahatlığı', style: 'margin-top:0' }),
    el('div', { class: 'form-satir' }, [el('label', { text: 'Yazı boyutu' }), boy]), el('div', { class: 'form-satir' }, [el('label', { text: 'Tema' }), tema]),
    secim('Metin yazı tipi', 'font', [['serif', 'Tırnaklı (kitap gibi)'], ['sans', 'Tırnaksız (sade)'], ['acik', 'Geniş harfli (okuması kolay)']], 'serif'),
    secim('Satır aralığı', 'satir', [[1.6, 'Dar'], [1.85, 'Normal'], [2.1, 'Geniş'], [2.4, 'Çok geniş']], 1.85),
    secim('Satır uzunluğu', 'genislik', [['32em', 'Kısa satırlar'], ['40em', 'Normal'], ['48em', 'Uzun satırlar']], '40em'),
    secim('Harf aralığı', 'harfAralik', [[false, 'Normal'], [true, 'Biraz açık']], false),
    ornek,
    el('p', { class: 'soluk kucuk', text: 'Bu ayarlar yalnızca okuma rahatlığı içindir; hızı kendi başına artırmaz. Gözünü en az yoran ayarı seç.' })]));

  var ad = el('input', { type: 'text', value: p.ad, maxlength: '20' });
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Profil', style: 'margin-top:0' }), el('div', { class: 'form-satir' }, [el('label', { text: 'Ad / takma ad' }), ad, ' ',
    el('button', { class: 'btn', text: 'Kaydet', onclick: function () { if (ad.value.trim()) { p.ad = ad.value.trim(); kaydet(); ayarUygula(); uyar('Kaydedildi', 'Adın güncellendi.'); } } })])]));

  var dosya = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: function () {
    var f = dosya.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function () {
      try {
        var v = JSON.parse(r.result); var pr = v.profil || v;
        if (!pr.id || !pr.kayitlar || !pr.ayar) throw 0;
        var var_ = !!D.profiller[pr.id];
        var yap = function () { D.profiller[pr.id] = pr; D.aktif = pr.id; kaydet(); ayarUygula(); uyar('Yüklendi', '“' + esc(pr.ad) + '” profili geri yüklendi.'); anaSayfa(); };
        var_ ? onayla('Bu profil zaten var', 'Bu cihazdaki “' + esc(D.profiller[pr.id].ad) + '” kaydı yedekteki bilgilerle değiştirilsin mi?', yap, 'Değiştir') : yap();
      } catch (x) { uyar('Dosya okunamadı', 'Bu dosya Kartal Bakışı yedeği değil gibi görünüyor.'); }
    };
    r.readAsText(f);
  } });
  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: '💾 Yedekleme', style: 'margin-top:0' }),
    el('p', { class: 'soluk', text: 'Bilgilerin yalnızca bu cihazda, bu tarayıcıda saklanır. Tarayıcı geçmişini/çerezleri temizlersen silinebilir. Ara sıra yedek al; başka cihaza geçerken yedeği orada geri yükle.' }),
    el('button', { class: 'btn', text: '⬇ Yedek dosyası indir', onclick: function () {
      var veri = JSON.stringify({ program: 'Kartal Bakışı', surum: 1, tarih: new Date().toISOString(), profil: p }, null, 1);
      var a = el('a', { href: URL.createObjectURL(new Blob([veri], { type: 'application/json' })), download: 'kartal-bakisi-yedek-' + p.ad.replace(/[^\wçğıöşüÇĞİÖŞÜ]+/g, '_') + '-' + bugun() + '.json' });
      document.body.appendChild(a); a.click(); a.remove();
    } }),
    el('button', { class: 'btn ikincil', text: '⬆ Yedekten geri yükle', onclick: function () { dosya.click(); } }), dosya]));

  e.appendChild(el('div', { class: 'kart' }, [el('h3', { text: 'Tehlikeli bölge', style: 'margin-top:0;color:var(--kotu)' }),
    el('button', { class: 'btn ikincil', text: '↺ Programı baştan başlat', onclick: function () {
      onayla('Program sıfırlansın mı?', 'Bütün kayıtların, rozetlerin ve kelime defterin silinir; başlangıç testinden yeniden başlarsın. Bu geri alınamaz. İstersen önce yedek al.', function () {
        var a = p.ad, s = p.sinif, ay = p.ayar; delete D.profiller[p.id]; var y = yeniProfil(a, s); y.ayar = ay; kaydet(); anaSayfa();
      }, 'Sıfırla');
    } }),
    el('button', { class: 'btn tehlike', text: '🗑 Bu profili sil', onclick: function () {
      onayla('Profil silinsin mi?', '“' + esc(p.ad) + '” profili ve bütün kayıtları bu cihazdan kalıcı olarak silinecek. Bu geri alınamaz.', function () {
        delete D.profiller[p.id]; D.aktif = null; kaydet(); ayarUygula(); Object.keys(D.profiller).length ? profilSec() : tanitim(0);
      }, 'Sil');
    } })]));
}

/* ---------- Rehber ---------- */
function rehber() {
  var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '❓ Nasıl kullanılır?' }));
  var b = [
    ['🦅 Bu program nedir?', 'Kartal Bakışı, <b>anlayarak hızlı okuma</b> programıdır. 6 hafta boyunca haftada 5 gün, günde 15–25 dakika çalışırsın. Göz ve dikkat egzersizleri, farklı okuma yöntemleri, 36 bilgilendirici metin, anlama soruları ve kelime çalışmaları içerir. İnternet gerekmez, ücretsizdir.'],
    ['📅 Nasıl çalışmalıyım?', '<ol><li>Her gün (haftada en az 5 gün) programı aç, <b>Bugünkü antrenmana başla</b>\'ya bas.</li><li>Adımları sırayla yap; her adımın başında ne yapacağın yazar. Emin değilsen <b>Nasıl yapılır?</b>\'a dokun.</li><li>Antrenman bitince program o günü kaydeder; ertesi gün yeni gün açılır.</li><li>Gün atlarsan sorun değil; kaldığın yerden devam edersin.</li><li>Her gün ayrıca kendi kitabından en az 20 dakika oku ve öğrendiğin teknikleri kullan.</li></ol>'],
    ['📏 Ölçüler ne demek?', '<b>Okuma hızı:</b> dakikada okuduğun kelime sayısı (kelime/dk).<br><b>Anlama:</b> metinden sonra sorulan 5 sorudaki doğru oranın.<br><b>Etkili okuma hızı:</b> okuma hızı × anlama. Örneğin dakikada 200 kelime okuyup %80 anlarsan etkili hızın 160\'tır. Program asıl olarak bu sayıyı artırmayı hedefler.<br><b>Hedef hız:</b> anlaman %80 ve üstündeyse yükselir, %60\'ın altındaysa düşer.'],
    ['🧠 Hızlı okuma hakkında doğru bilinenler', '<ul><li>Hiç kimse anlamadan “fotoğraf çeker gibi” sayfa okuyamaz. Abartılı vaatlere inanma.</li><li>Okumayı en çok yavaşlatan şeyler: <b>geri dönüp tekrar okumak</b>, kelimeleri tek tek okumak, dikkatin dağılması ve bilinmeyen kelimeler. Program bunların hepsi üzerinde çalışır.</li><li>İyi okur, okuma hızını <b>amaca göre</b> ayarlar: ders çalışırken daha yavaş ve dikkatli, bir bilgiyi ararken hızlı (tarama), genel fikir için göz atarak.</li><li>Ne kadar çok okursan o kadar hızlanırsın. Kelime hazinen genişledikçe hızın da artar.</li></ul>'],
    ['🏋️ Egzersizler ne işe yarar?', '<b>Göz ısınması:</b> dikkati toplar, okumaya hazırlar.<br><b>Schulte tablosu ve Görüş alanı:</b> dikkat, odaklanma ve görsel tarama oyunları (tek başına hız kazandırmaz).<br><b>Harf avı ve Aynı-Farklı:</b> dikkat ve harfleri hızlı ayırt etme.<br><b>Şimşek kelime:</b> kelimeleri bir bakışta tanıma.<br><b>Rehberli okuma:</b> geri dönmeyi önler, düzenli akış kazandırır.<br><b>Kelime gruplarıyla okuma:</b> anlam birimleri hâlinde okuma.<br><b>Tek noktada okuma:</b> odaklanma.<br><b>Göz atma ve Tarama:</b> amaca göre okuma stratejileri.<br><b>Kelime hazinesi:</b> takılmadan okumak için.<br><b>Göz dinlendirme:</b> göz sağlığını korur.'],
    ['🆕 Diğer araçlar', '<b>🔁 Tekrarlı okuma:</b> Aynı metni üç kez okursun; akıcılığın her turda artar. Okuma akıcılığını geliştirmede araştırmalarla desteklenen bir yöntemdir.<br><b>👂 Dinleyerek okuma:</b> Cihaz metni seslendirir, sen okunan kelimeyi gözünle izlersin (Kütüphane → yöntem).<br><b>📄 Kendi metnim:</b> Ders kitabından bir metni yapıştırıp istediğin yöntemle okuyabilirsin.<br><b>🎯 Okuma amacı:</b> Ders çalışırken yavaş, göz gezdirirken hızlı: Kütüphane\'de amacını seç, hız ona göre ayarlanır.<br><b>🤔 Ne kadar anladım?</b> Her okumadan sonra anlamanı tahmin edersin; sorularla karşılaştırılır. Kendi anlamasını doğru tahmin etmek iyi okurların becerisidir.<br><b>🗣️ Sesli okuma ölçümü:</b> Bir yetişkinle 1 dakikalık sesli okuma; dakikada doğru okunan kelime, doğruluk ve akıcılık ölçeği.<br><b>👩‍🏫 Sınıf görünümü:</b> Öğretmen, öğrencilerin yedek dosyalarını tek tabloda görür ve Excel\'e aktarır.'],
    ['🚫 Neden bazı “hızlı okuma” iddialarına yer vermedik?', '<ul><li>“Dakikada 1000+ kelime anlayarak okuma” gibi vaatlerin bilimsel dayanağı yoktur; hız arttıkça anlama düşer.</li><li>Göz egzersizleri ve görüş alanı çalışmaları dikkat ve odaklanma oyunlarıdır; okuma hızını tek başına artırmaz. Okumada asıl belirleyici olan dil ve anlama becerisidir: kelime bilgisi, bol okuma, akıcılık.</li><li>Kelimelerin ilk harflerini kalın yazma (“biyonik okuma”) gibi yöntemlerin hız kazandırdığı araştırmalarda gösterilmemiştir.</li><li>“İç sesi tamamen susturmak” mümkün değildir ve gerekli değildir; anlamayı destekler.</li></ul>'],
    ['⚠️ Sağlık ve güvenlik', '<ul><li>Gözlüğün varsa tak; ekranla aranda bir kol boyu mesafe olsun; ortam aydınlık olsun.</li><li>Günde 25 dakikadan fazla ekran egzersizi yapma. 20-20-20 kuralına uy.</li><li><b>Gözün ağrır, sulanır, bulanık görürsen, başın ağrır ya da başın dönerse hemen bırak ve dinlen.</b> Tekrarlarsa ailene söyle ve bir göz doktoruna görün.</li><li>Işığa duyarlıysan Ayarlar\'dan “Işık hassasiyeti”ni aç.</li><li>Yatarken, araç içinde ya da karanlıkta çalışma.</li></ul>'],
    ['👨‍👩‍👧 Veliler ve öğretmenler için', '<ul><li>Program, öğrencinin kendi başlangıcına göre gelişimini izler; öğrencileri birbiriyle karşılaştırmak için tasarlanmamıştır.</li><li><b>İlerlemem → Rapor</b> ile yazdırılabilir gelişim raporu, program sonunda <b>Başarı belgesi</b> alınabilir.</li><li>Sınıfta tek bilgisayarda çok öğrenci kullanacaksa her öğrenci kendi profilini açar; gerekirse Ayarlar\'dan günlük sınır kapatılabilir.</li><li>Öğrenciyi düzenli çalışması için cesaretlendirin; hızdan çok anlamayı övün.</li><li>Okuma güçlüğü (harfleri karıştırma, satır atlama, okurken çok çabuk yorulma) belirgin ve sürekliyse bir uzmana danışın; bu program bir tedavi aracı değildir.</li></ul>'],
    ['🔒 Gizlilik', 'Program hiçbir bilgiyi internete göndermez. Bütün bilgiler yalnızca bu cihazdaki tarayıcıda saklanır. Gerçek ad yerine takma ad kullanılabilir.'],
    ['💻 Teknik bilgiler', 'Program klasöründeki <b>index.html</b> dosyasına çift tıklayarak açılır (Chrome, Edge, Safari, Firefox). Klasörün içindeki dosyaları ayırma. Başka bilgisayara kopyalarken klasörün tamamını kopyala. Kayıtlar tarayıcıya bağlıdır: farklı tarayıcıda açarsan kayıtlarını göremezsin; o zaman Ayarlar\'dan yedek alıp geri yükle.']
  ];
  b.forEach(function (x, i) { var d = el('details', null, [el('summary', { text: x[0] }), el('div', { html: x[1] })]); if (i === 0) d.open = true; e.appendChild(d); });
  e.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn ikincil', text: '⚠️ Başlangıç uyarılarını tekrar göster', onclick: function () { uyarilar(false); } })]));
}

baslat();
