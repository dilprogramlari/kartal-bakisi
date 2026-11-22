/* Kartal Bakışı – 6 haftalık (30 gün) program planı */
'use strict';

var HAFTALAR = [
  { no: 0, baslik: 'Hazırlık', simge: '🐣', aciklama: 'Programı tanı, başlangıç hızını ve anlamanı ölç.' },
  { no: 1, baslik: 'Temel', simge: '👀', aciklama: 'Gözlerini ısıt, dikkatini topla, kendi hızında düzenli okumaya alış.',
    ipucu: 'Okurken geri dönmemeye ve kelimeleri içinden seslendirmemeye çalış.' },
  { no: 2, baslik: 'Görüş Alanı', simge: '🔭', aciklama: 'Bir bakışta daha geniş alanı görmeyi öğren; satır izleyiciyle oku.',
    ipucu: 'Gözünü kelimenin başına değil, ortasına yerleştir.' },
  { no: 3, baslik: 'Kelime Grupları', simge: '🧩', aciklama: 'Kelimeleri tek tek değil, ikişer ikişer anlam grupları hâlinde oku.',
    ipucu: '“okulun bahçesinde” iki kelime ama tek bir anlam: tek bakışta gör.' },
  { no: 4, baslik: 'Akış', simge: '🌊', aciklama: 'Üçlü gruplar, tek noktada okuma ve tarama ile akıcılığını artır.',
    ipucu: 'Hız artınca anlamayı kontrol et: her paragraftan sonra “ne anlattı?” diye kendine sor.' },
  { no: 5, baslik: 'Stratejiler', simge: '🧭', aciklama: 'Göz atma ve tarama stratejilerini öğren; amaca göre hız seç.',
    ipucu: 'İyi okur her metni aynı hızda okumaz: ders metnine yavaş, habere hızlı.' },
  { no: 6, baslik: 'Pekiştirme', simge: '🦅', aciklama: 'Öğrendiklerini birleştir; bitiş testinde gelişimini gör.',
    ipucu: 'Öğrendiğin teknikleri kitap okurken de kullan; asıl antrenman günlük okumandır.' }
];

function A(tur, ayar) { return { tur: tur, ayar: ayar || {} }; }
var DESENLER = ['yatay', 'dikey', 'capraz', 'daire', 'sekiz', 'karma'];

function gunPlani(no) {
  var isinma = A('isinma', { desen: DESENLER[(no - 1 + 6) % 6], sure: no <= 5 ? 40 : 45 });
  var G = function (n) { return 'G' + ('0' + n).slice(-2); };
  var okuma = function (yontem, k) { return A('okuma', { metin: G(no), yontem: yontem, k: k }); };
  var p = {
    1: [A('schulte', { n: 3 }), A('harfavi', { set: 0 }), okuma('serbest')],
    2: [A('aynifarkli'), A('schulte', { n: 3 }), okuma('serbest')],
    3: [A('harfavi', { set: 1 }), A('tekrarli', { metin: 'G02' }), okuma('serbest')],
    4: [A('schulte', { n: 4 }), A('harfavi', { set: 2 }), okuma('serbest')],
    5: [A('schulte', { n: 4 }), A('aynifarkli'), okuma('rehberli')],
    6: [A('schulte', { n: 4 }), A('gorus'), okuma('rehberli')],
    7: [A('simsek', { icerik: 'kelime' }), A('gorus'), okuma('rehberli')],
    8: [A('schulte', { n: 4, tip: 'harf' }), A('simsek', { icerik: 'kelime' }), okuma('rehberli')],
    9: [A('gorus'), A('simsek', { icerik: 'grup2' }), okuma('rehberli')],
    10: [A('schulte', { n: 5 }), A('simsek', { icerik: 'sayi' }), okuma('rehberli')],
    11: [A('simsek', { icerik: 'grup2' }), A('schulte', { n: 4 }), okuma('grup', 2)],
    12: [A('gorus'), A('tekrarli', { metin: 'G11' }), okuma('grup', 2)],
    13: [A('schulte', { n: 5 }), A('aynifarkli'), okuma('rehberli')],
    14: [A('simsek', { icerik: 'grup2' }), A('gorus'), okuma('grup', 2)],
    15: [A('okuma', { metin: 'T2', yontem: 'serbest', test: 'Ara Test', testKodu: 'ara' })],
    16: [A('simsek', { icerik: 'grup3' }), A('tarama', { metin: 'G01' }), okuma('grup', 3)],
    17: [A('schulte', { n: 5 }), A('tarama', { metin: 'G02' }), okuma('rsvp', 1)],
    18: [A('simsek', { icerik: 'grup3' }), A('gorus'), okuma('grup', 3)],
    19: [A('tarama', { metin: 'G03' }), A('schulte', { n: 5, tip: 'harf' }), okuma('rsvp', 2)],
    20: [A('simsek', { icerik: 'grup3' }), A('tarama', { metin: 'G04' }), okuma('rehberli')],
    21: [A('gozatma', { metin: 'E1' }), A('schulte', { n: 5 }), okuma('rehberli')],
    22: [A('tarama', { metin: 'G05' }), A('tekrarli', { metin: 'G21' }), okuma('grup', 3)],
    23: [A('gozatma', { metin: 'G15' }), A('gorus'), okuma('rehberli')],
    24: [A('tarama', { metin: 'G06' }), A('schulte', { n: 5 }), okuma('serbest')],
    25: [A('gozatma', { metin: 'E2' }), A('simsek', { icerik: 'grup3' }), okuma('rehberli')],
    26: [A('schulte', { n: 5 }), A('tarama', { metin: 'G07' }), okuma('grup', 3)],
    27: [A('gozatma', { metin: 'E3' }), A('gorus'), okuma('rsvp', 2)],
    28: [A('simsek', { icerik: 'grup3' }), A('tarama', { metin: 'G08' }), okuma('serbest')],
    29: [A('schulte', { n: 5 }), A('gozatma', { metin: 'G30' }), okuma('rehberli')],
    30: [A('okuma', { metin: 'T3', yontem: 'serbest', test: 'Bitiş Testi', testKodu: 'bitis' })]
  }[no];
  var anaMetin = p.filter(function (a) { return a.tur === 'okuma'; })[0].ayar.metin;
  return [A('hazirlik'), isinma].concat(p, [A('kelime', { metinler: [anaMetin] }), A('dinlen')]);
}

var PROGRAM = [{ gun: 0, hafta: 0, baslik: 'Hazırlık ve Başlangıç Testi', test: true,
  adimlar: [A('hazirlik'), A('okuma', { metin: 'T1', yontem: 'serbest', test: 'Başlangıç Testi', testKodu: 'baslangic' }), A('kelime', { metinler: ['T1'] }), A('dinlen')] }];
(function () {
  for (var g = 1; g <= 30; g++) {
    var h = Math.ceil(g / 5);
    var plan = gunPlani(g);
    var ok = plan.filter(function (a) { return a.tur === 'okuma'; })[0].ayar;
    PROGRAM.push({ gun: g, hafta: h, test: !!ok.test, baslik: ok.test ? ok.test : HAFTALAR[h].baslik + ' haftası, ' + (g - (h - 1) * 5) + '. gün', adimlar: plan });
  }
})();

function adimAdi(a) {
  var E = EGZ[a.tur]; var ad = E ? E.ad : a.tur;
  if (a.tur === 'schulte') ad += ' ' + a.ayar.n + '×' + a.ayar.n + (a.ayar.tip === 'harf' ? ' (harf)' : '');
  if (a.tur === 'okuma') { var m = metinBul(a.ayar.metin); ad = (a.ayar.test ? a.ayar.test : YONTEMLER[a.ayar.yontem].ad + (a.ayar.k > 1 && a.ayar.yontem !== 'rehberli' ? ' (' + a.ayar.k + '\'li)' : '')) + (m ? ': ' + m.baslik : ''); }
  if (a.tur === 'simsek') ad += ' (' + { kelime: 'kelime', grup2: 'ikili grup', grup3: 'üçlü grup', sayi: 'sayı' }[a.ayar.icerik] + ')';
  return ad;
}
function adimSimge(a) { if (a.tur === 'okuma') return a.ayar.test ? '📏' : YONTEMLER[a.ayar.yontem].simge; return EGZ[a.tur] ? EGZ[a.tur].simge : '•'; }
