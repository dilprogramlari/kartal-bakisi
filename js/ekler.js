/* Kartal Bakışı – araştırmaya dayalı ek özellikler
   tekrarlı okuma, üstbiliş tahmini, kendi metnim, okunabilirlik, sesli okuma ölçümü,
   öğretmen sınıf görünümü, hız-anlama dağılım grafiği */
'use strict';

/* ---------- Üstbiliş: "Ne kadar anladım?" tahmini ---------- */
var TAHMINLER = [['😟', 'Çok az'], ['😕', 'Biraz'], ['🙂', 'Yarısı kadar'], ['😊', 'Çoğunu'], ['🤩', 'Tamamını']];
function tahminSor(kap, sonra) {
  kap.innerHTML = ''; window.scrollTo(0, 0);
  var iz = el('div', { class: 'secenekler-izgara', style: 'grid-template-columns:repeat(auto-fit,minmax(120px,1fr))' });
  TAHMINLER.forEach(function (t, i) {
    iz.appendChild(el('button', { class: 'secenek', html: '<span style="font-size:1.8rem">' + t[0] + '</span><br>' + t[1], onclick: function () { sonra(i + 1); } }));
  });
  kap.appendChild(el('div', { class: 'kart orta' }, [
    el('h2', { text: '🤔 Sence metni ne kadar anladın?', style: 'margin-top:0' }),
    el('p', { class: 'soluk', text: 'Dürüstçe tahmin et. Sonra sorularla karşılaştıracağız. Kendi anlamanı doğru tahmin edebilmek iyi okurların en önemli becerilerinden biridir.' }),
    iz]));
}
function tahminSeviye(an) { return 1 + Math.round(an / 25); }
function tahminNotu(t, an) {
  if (!t) return null;
  var f = t - tahminSeviye(an);
  if (f === 0) return ['basari', '🎯 Tahminin isabetli! Ne kadar anladığını iyi biliyorsun.'];
  if (f >= 2) return ['uyari', 'Anladığını sandığından daha azını anlamışsın. Okurken her paragraftan sonra bir an durup <b>“Burada ne anlatıldı?”</b> diye kendine sor.'];
  if (f <= -2) return ['bilgi', 'Sandığından daha iyi anlamışsın! Kendine daha çok güvenebilirsin.'];
  return null;
}

/* ---------- Sorusu olmayan (kendi) metinler için okuma sonu ---------- */
function kendiMetinSonu(kap, m, kh, tahmin, gecen, bitti) {
  kap.innerHTML = '';
  var ozet = el('textarea', { rows: '5', style: 'width:100%;font:inherit;padding:.7rem;border-radius:.6rem;border:1px solid var(--cizgi);background:var(--kart);color:var(--yazi)', placeholder: 'Bu metin neyi anlatıyordu? Aklında kalanlar neler?' });
  kap.appendChild(el('div', { class: 'kart' }, [
    el('h2', { text: '✍️ Aklında kalanları yaz', style: 'margin-top:0' }),
    el('p', { class: 'soluk', text: 'Bu metnin soruları yok. Metne bakmadan, aklında kalanları 2–3 cümleyle yaz. Okuduğunu hatırlamaya çalışmak, öğrendiklerinin kalıcı olmasını sağlar.' }),
    ozet,
    el('p', null, [el('button', { class: 'btn buyuk', text: 'Bitir ✔', onclick: function () {
      var an = tahmin * 20, satir = [['Okuma hızı', kh + ' kelime/dk'], ['Kendi tahminin', TAHMINLER[tahmin - 1][1]], ['Yazdığın', kelimeSay(ozet.value || '') + ' kelime']];
      bitti({ baslik: 'Kendi metnini okudun 📄', satirlar: satir,
        notlar: [['bilgi', 'Yazdıklarını metinle karşılaştır: ana fikri yakalamış mısın, önemli bir ayrıntıyı atlamış mısın? Kendi metinlerindeki ölçüm, programdaki ölçümlerle karşılaştırılmaz; çünkü her metnin zorluğu farklıdır.']],
        kayit: { tur: 'kendi', metin: m.baslik, yontem: 'serbest', kh: kh, tahmin: tahmin, an: an, sure: Math.round(gecen), kelime: kelimeSay(m.metin), ozet: ozet.value.slice(0, 600) } });
    } })])
  ]));
  ozet.focus();
}

/* ---------- Tekrarlı okuma ---------- */
EGZ.tekrarli = {
  ad: 'Tekrarlı Okuma', simge: '🔁', kisa: 'Aynı metni üç kez oku, akıcılığının arttığını gör.',
  calistir: function (kap, ayar, bitti, z) {
    var m = metinBul(ayar.metin) || rastgele(window.METINLER.filter(function (x) { return x.id[0] === 'G'; }));
    var K = kelimeSay(m.metin), tur = ayar.tur || 3, sonuclar = [];
    kap.appendChild(aciklamaKutusu('🔁', 'Tekrarlı Okuma: ' + m.baslik,
      'Aynı metni <b>' + tur + ' kez</b> okuyacaksın. Her turda süren ölçülür. Amaç, her turda biraz daha <b>akıcı</b> okumak. Sonunda sorular gelecek.',
      'Tekrarlı okuma, okuma akıcılığını geliştirmede etkisi araştırmalarla en iyi gösterilmiş yöntemlerden biridir. İkinci ve üçüncü okumada kelimeleri daha hızlı tanırsın; gözün ve zihnin akıcı okumanın nasıl bir his olduğunu öğrenir. Bu hissi yeni metinlere taşımaya çalış.',
      function () { okut(1); }));
    function okut(n) {
      kap.innerHTML = ''; window.scrollTo(0, 0);
      var mk = metinKur(m, 'gizli'), t0, t = el('span', { class: 'sayac', text: '0 sn' });
      var bitir = el('button', { class: 'btn buyuk tam', text: '✔ Bitirdim', style: 'display:none', onclick: function () {
        z.hepsi(); var ms = performance.now() - t0; sonuclar.push(Math.round(K / (ms / 60000)));
        if (n < tur) arasi(n); else tahminSor(kap, function (th) { sorulariSor(kap, m, function (an, d) { son(an, d, th); }); });
      } });
      kap.appendChild(el('div', { class: 'satir-arasi' }, [el('b', { text: n + '. okuma' + (n > 1 ? ' – geçen seferden biraz daha akıcı' : '') }), t]));
      var bas = el('button', { class: 'btn buyuk', text: '▶ ' + n + '. okumaya başla', onclick: function () {
        bas.parentNode.remove(); mk.kutu.classList.remove('gizli'); bitir.style.display = ''; t0 = performance.now();
        z.aralik(function () { t.textContent = Math.floor((performance.now() - t0) / 1000) + ' sn'; }, 500);
      } });
      kap.appendChild(el('p', { class: 'orta' }, [bas]));
      kap.appendChild(mk.kutu);
      kap.appendChild(el('div', { style: 'position:sticky;bottom:.5rem;max-width:40em;margin:0 auto' }, [bitir]));
    }
    function arasi(n) {
      kap.innerHTML = '';
      var fark = n > 1 ? Math.round((sonuclar[n - 1] / sonuclar[n - 2] - 1) * 100) : null;
      kap.appendChild(el('div', { class: 'kart orta' }, [
        el('h2', { text: n + '. okuma: ' + sonuclar[n - 1] + ' kelime/dk', style: 'margin-top:0' }),
        fark != null ? el('p', { html: 'Bir önceki okumana göre <b>' + (fark >= 0 ? '+' : '') + fark + '%</b>' }) : null,
        el('p', { class: 'soluk', text: 'Şimdi aynı metni bir kez daha oku. Takıldığın yerlerde bu sefer daha rahat geçmeye çalış; ama acele etme, anlamaya devam et.' }),
        el('button', { class: 'btn buyuk', text: (n + 1) + '. okumaya geç ▶', onclick: function () { okut(n + 1); } })
      ]));
    }
    function son(an, d, th) {
      var artis = Math.round((sonuclar[sonuclar.length - 1] / sonuclar[0] - 1) * 100);
      var satir = sonuclar.map(function (h, i) { return [(i + 1) + '. okuma', h + ' kelime/dk']; });
      satir.push(['Artış', (artis >= 0 ? '+' : '') + artis + '%']); satir.push(['Anlama', '%' + an + ' (' + d + '/5)']);
      bitti({ baslik: 'Tekrarlı okuma bitti 🔁', satirlar: satir,
        notlar: [artis >= 15 ? ['basari', 'Üçüncü okumada belirgin biçimde akıcılaştın. İşte akıcı okumanın hissi bu!'] : ['bilgi', 'Her okumada kelimeleri biraz daha hızlı tanırsın. Bu çalışmayı ders kitabındaki zor metinlerde de uygulayabilirsin.'], tahminNotu(th, an)],
        kayit: { tur: 'tekrar', metin: m.id, kh1: sonuclar[0], kh: sonuclar[sonuclar.length - 1], an: an, tahmin: th } });
    }
  }
};

/* ---------- Okunabilirlik (Ateşman, 1997) ---------- */
function okunabilirlik(metin) {
  var kelimeler = metin.trim().split(/\s+/).filter(Boolean);
  var cumle = (metin.match(/[.!?…]+(\s|$)/g) || []).length || 1;
  var hece = (kucuk(metin).match(/[aeıioöuüâîû]/g) || []).length;
  var puan = 198.825 - 40.175 * (hece / kelimeler.length) - 2.610 * (kelimeler.length / cumle);
  puan = Math.round(Math.max(0, Math.min(100, puan)));
  var etiket = puan >= 90 ? 'Çok kolay' : puan >= 70 ? 'Kolay' : puan >= 50 ? 'Orta' : puan >= 30 ? 'Zor' : 'Çok zor';
  return { puan: puan, etiket: etiket };
}

/* ---------- Kendi metinleri ---------- */
function kendiMetinler() { var p = P(); p.kendiMetinler = p.kendiMetinler || []; return p.kendiMetinler; }
function kendiMetinKarti(yontemSec, grupSec, amacCarpan) {
  var baslik = el('input', { type: 'text', placeholder: 'Metnin başlığı (ör. Fen – Hücre konusu)', style: 'width:100%' });
  var alan = el('textarea', { rows: '6', style: 'width:100%;font:inherit;padding:.7rem;border-radius:.6rem;border:1px solid var(--cizgi);background:var(--kart);color:var(--yazi);margin-top:.5rem', placeholder: 'Ders kitabından, bir dergiden ya da istediğin bir yerden metni buraya yapıştır…' });
  var bilgi = el('p', { class: 'soluk kucuk' });
  alan.addEventListener('input', function () { var n = kelimeSay(alan.value || ''); bilgi.textContent = n ? n + ' kelime' + (n >= 40 ? ' • Zorluk: ' + okunabilirlik(alan.value).etiket : '') : ''; });
  var dosya = el('input', { type: 'file', accept: '.txt,text/plain', style: 'display:none', onchange: function () {
    var f = dosya.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function () { alan.value = String(r.result).slice(0, 20000); if (!baslik.value) baslik.value = f.name.replace(/\.txt$/i, ''); alan.dispatchEvent(new Event('input')); };
    r.readAsText(f, 'utf-8');
  } });
  var liste = el('div');
  function oku(m) {
    window.KENDI = window.KENDI || {}; window.KENDI[m.id] = m;
    tekEgzersiz({ tur: 'okuma', ayar: { metin: m.id, yontem: yontemSec.value, k: +grupSec.value, hiz: yuvarla(hedefHiz() * amacCarpan(), 5), serbestAyar: true } }, kutuphane);
  }
  function listele() {
    liste.innerHTML = '';
    kendiMetinler().forEach(function (m, i) {
      liste.appendChild(el('div', { class: 'satir-arasi', style: 'border-top:1px solid var(--cizgi);padding-top:.4rem' }, [
        el('span', { text: '📄 ' + m.baslik + ' (' + kelimeSay(m.metin) + ' kelime)' }),
        el('span', null, [el('button', { class: 'btn', style: 'min-height:2.2rem;padding:.2rem .7rem', text: 'Oku', onclick: function () { oku(m); } }),
          el('button', { class: 'btn ikincil', style: 'min-height:2.2rem;padding:.2rem .7rem', text: '🗑', title: 'Sil', onclick: function () { kendiMetinler().splice(i, 1); kaydet(); listele(); } })])
      ]));
    });
  }
  listele();
  return el('details', { class: 'kart' }, [el('summary', { text: '📄 Kendi metnimle çalış (yapıştır veya .txt yükle)' }),
    el('p', { class: 'soluk kucuk', text: 'Ders kitabındaki bir metni ya da okuduğun kitaptan bir bölümü buraya yapıştırıp seçtiğin yöntemle okuyabilirsin. Soru olmadığı için okuma sonunda aklında kalanları yazacaksın.' }),
    baslik, alan, bilgi,
    el('p', null, [el('button', { class: 'btn', text: '▶ Oku ve kaydet', onclick: function () {
      var metin = (alan.value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n\n').trim();
      if (kelimeSay(metin) < 30) { uyar('Metin çok kısa', 'En az 30 kelimelik bir metin yapıştır.'); return; }
      var m = { id: 'K' + Date.now().toString(36), baslik: baslik.value.trim() || 'Kendi metnim', metin: metin, sorular: [], kelimeler: [] };
      kendiMetinler().unshift(m); if (kendiMetinler().length > 10) kendiMetinler().pop(); kaydet(); oku(m);
    } }), el('button', { class: 'btn ikincil', text: '📂 .txt dosyası seç', onclick: function () { dosya.click(); } }), dosya]),
    liste]);
}

/* ---------- Sesli okuma ölçümü (veli / öğretmen ile) ---------- */
var PROZODI = [
  ['Hız', 'Çok yavaş, heceleyerek', 'Yavaş, sık duraksıyor', 'Çoğunlukla uygun hızda', 'Konuşur gibi, uygun hızda'],
  ['Doğruluk', 'Çok sayıda kelimeyi yanlış okuyor', 'Bazı kelimeleri yanlış okuyor', 'Az hata yapıyor, düzeltiyor', 'Neredeyse hatasız'],
  ['Vurgu ve tonlama', 'Tek düze, anlamsız', 'Yer yer anlamlı', 'Çoğunlukla anlamlı', 'Anlama uygun, canlı'],
  ['Noktalama ve duraklar', 'Noktalamaya uymuyor', 'Bazen uyuyor', 'Çoğunlukla uyuyor', 'Her zaman uyuyor']
];
function sesliOlcum() {
  var e = ekranTemizle(); cikisFn = null;
  e.appendChild(el('h1', { text: '🗣️ Sesli okuma ölçümü' }));
  e.appendChild(el('div', { class: 'bilgi', html: 'Bu ölçüm bir <b>yetişkinle (veli ya da öğretmen)</b> birlikte yapılır. Öğrenci metni <b>1 dakika</b> boyunca sesli okur; yetişkin, yanlış okunan kelimelere ekranda dokunur. Sonunda <b>dakikada doğru okunan kelime</b> ve <b>doğruluk oranı</b> hesaplanır; yetişkin ayrıca okumanın akıcılığını kısa bir ölçekle değerlendirir.' }));
  var sec = el('select', { style: 'width:100%' });
  window.METINLER.filter(function (m) { return m.id[0] !== 'T'; }).forEach(function (m) { sec.appendChild(el('option', { value: m.id, text: m.baslik + ' (' + okunabilirlik(m.metin).etiket + ')' })); });
  e.appendChild(el('div', { class: 'kart' }, [el('div', { class: 'form-satir' }, [el('label', { text: 'Metin (öğrencinin daha önce okumadığı bir metin seçin)' }), sec]),
    el('details', null, [el('summary', { text: 'Yetişkin için yönerge' }), el('div', { html: '<ol><li>Öğrenciye “Bu metni sesli, her zamanki gibi oku. Hızlı okumaya çalışma, anlayarak oku.” deyin.</li><li><b>Başla</b>\'ya basınca 60 saniye başlar.</li><li>Öğrencinin <b>yanlış okuduğu, atladığı ya da 3 saniyeden uzun takıldığı</b> kelimeye dokunun (kırmızı olur). Yanlışlıkla dokunursanız tekrar dokunun. Öğrencinin kendi düzelttiği kelimeler doğru sayılır.</li><li>Süre bitince öğrencinin <b>okuduğu son kelimeye</b> dokunun.</li><li>Son olarak akıcılık ölçeğini doldurun.</li></ol>' })]),
    el('button', { class: 'btn buyuk', text: '▶ Başla (60 sn)', onclick: function () { olc(metinBul(sec.value)); } })]));
  var onceki = P().kayitlar.filter(function (k) { return k.tur === 'sesli'; });
  if (onceki.length) {
    var t = el('table', { class: 'tablo' }, [el('tr', null, ['Tarih', 'Metin', 'Doğru kelime/dk', 'Doğruluk', 'Akıcılık'].map(function (b) { return el('th', { text: b }); }))]);
    onceki.slice().reverse().forEach(function (k) { var m = metinBul(k.metin); t.appendChild(el('tr', null, [new Date(k.t).toLocaleDateString('tr-TR'), m ? m.baslik : '', String(k.dks), '%' + k.dogruluk, k.prozodi + '/16'].map(function (v) { return el('td', { text: v }); }))); });
    e.appendChild(el('div', { class: 'kart tablo-kap' }, [el('h3', { text: 'Önceki ölçümler', style: 'margin-top:0' }), t]));
  }
  function olc(m) {
    var e2 = ekranTemizle(); var z = zamanlayici(); aktifTemizle = z.hepsi;
    cikisFn = function () { cikisSor(sesliOlcum); };
    var kalan = 60, asama = 'oku', yanlis = 0, sonI = null, t0 = performance.now(), gecen = 60000;
    var say = el('span', { class: 'sayac', text: '60 sn' }), durum = el('b', { text: 'Öğrenci okuyor – yanlış kelimelere dokunun' });
    var mk = metinKur(m); mk.kutu.style.fontSize = '1.3rem';
    var bitir = el('button', { class: 'btn ikincil', text: 'Okuma bitti', onclick: sureBitti });
    e2.appendChild(el('div', { class: 'satir-arasi', style: 'position:sticky;top:3.4rem;z-index:5;background:var(--bg);padding:.4rem 0' }, [durum, el('span', null, [say, ' ', bitir])]));
    e2.appendChild(mk.kutu);
    mk.spanlar.forEach(function (s, i) {
      s.style.cursor = 'pointer';
      s.addEventListener('click', function () {
        if (asama === 'oku') { s.classList.toggle('yanlis'); }
        else if (asama === 'son') { sonI = i; mk.spanlar.forEach(function (x, j) { x.style.opacity = j > i ? .3 : 1; }); s.classList.add('bulundu'); puanla(); }
      });
    });
    z.aralik(function () { kalan--; say.textContent = kalan + ' sn'; if (kalan <= 0) sureBitti(); }, 1000);
    function sureBitti() {
      if (asama !== 'oku') return; gecen = Math.min(60000, performance.now() - t0); z.hepsi(); asama = 'son';
      bitir.remove(); say.textContent = '⏱ ' + Math.round(gecen / 1000) + ' sn';
      durum.textContent = 'Şimdi öğrencinin okuduğu SON kelimeye dokunun';
      durum.style.color = 'var(--kotu)';
    }
    function puanla() {
      asama = 'bitti';
      yanlis = mk.spanlar.slice(0, sonI + 1).filter(function (s) { return s.classList.contains('yanlis'); }).length;
      var okunan = sonI + 1, dogru = okunan - yanlis, dks = Math.round(dogru / (gecen / 60000)), dogruluk = Math.round(dogru / okunan * 100);
      var secimler = [];
      var form = el('div', { class: 'kart' }, [el('h2', { text: 'Akıcılık ölçeği', style: 'margin-top:0' }), el('p', { class: 'soluk', text: 'Her satırda öğrencinin okumasına en uygun ifadeyi seçin.' })]);
      PROZODI.forEach(function (sat, i) {
        var s = el('select', { style: 'width:100%' }); sat.slice(1).forEach(function (o, j) { s.appendChild(el('option', { value: j + 1, text: (j + 1) + ' – ' + o })); }); s.value = 3;
        secimler.push(s); form.appendChild(el('div', { class: 'form-satir' }, [el('label', { text: sat[0] }), s]));
      });
      form.appendChild(el('button', { class: 'btn buyuk', text: 'Sonucu kaydet ✔', onclick: function () {
        var pz = secimler.reduce(function (a, s) { return a + +s.value; }, 0);
        kayitEkle({ tur: 'sesli', metin: m.id, dks: dks, dogruluk: dogruluk, yanlis: yanlis, okunan: okunan, prozodi: pz, sure: Math.round(gecen) });
        cikisFn = null; var e3 = ekranTemizle();
        var duzey = dogruluk >= 95 ? ['basari', 'Doğruluk %95 ve üstü: Bu metni <b>rahatça, kendi başına</b> okuyabiliyor.'] : dogruluk >= 90 ? ['bilgi', 'Doğruluk %90–94: Metin biraz zorlayıcı; <b>destekle</b> okumaya uygun. Tekrarlı okuma ve dinleyerek okuma yararlı olur.'] : ['uyari', 'Doğruluk %90\'ın altında: Bu metin şu an <b>zor</b> geliyor. Daha kolay metinlerle, tekrarlı ve dinleyerek okumayla çalışmak iyi olur. Okuma güçlüğü sürüyorsa bir uzmana danışın.'];
        e3.appendChild(sonucKutusu('🗣️ Sesli okuma sonucu', [['Doğru okunan kelime/dk', String(dks)], ['Doğruluk', '%' + dogruluk + ' (' + yanlis + ' hata / ' + okunan + ' kelime)'], ['Akıcılık ölçeği', pz + ' / 16']],
          [duzey, ['bilgi kucuk', 'Sesli okuma, sessiz okumadan doğal olarak daha yavaştır. Bu ölçümü 2–3 haftada bir, <b>daha önce okunmamış</b> benzer zorlukta metinlerle tekrarlayarak gelişimi izleyin.']]));
        e3.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn buyuk', text: 'Tamam', onclick: sesliOlcum })]));
        rozetGoster();
      } }));
      e2.appendChild(form);
      e2.insertBefore(el('div', { class: 'basari', html: '<b>' + okunan + '</b> kelime okundu, <b>' + yanlis + '</b> hata. Dakikada doğru okunan kelime: <b>' + dks + '</b>. Şimdi aşağıdaki ölçeği doldurun.' }), mk.kutu);
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/* ---------- Öğretmen: sınıf görünümü (yedek dosyalarından) ---------- */
function sinifGorunumu() {
  var e = ekranTemizle(); cikisFn = null; var ogr = [];
  e.appendChild(el('h1', { text: '👩‍🏫 Öğretmen: sınıf görünümü' }));
  e.appendChild(el('div', { class: 'bilgi', html: 'Öğrencilerden <b>Ayarlar → Yedek dosyası indir</b> ile aldıkları dosyaları (ör. e-posta, USB veya okul ağı ile) toplayın, burada <b>hepsini birden</b> seçin. Dosyalar yalnızca bu ekranda okunur; hiçbir yere kaydedilmez veya gönderilmez.' }));
  var tablo = el('div', { class: 'kart tablo-kap' });
  var dosya = el('input', { type: 'file', multiple: 'multiple', accept: '.json,application/json', onchange: function () {
    var fs = Array.prototype.slice.call(dosya.files), kalan = fs.length;
    fs.forEach(function (f) {
      var r = new FileReader();
      r.onload = function () { try { var v = JSON.parse(r.result); var p = v.profil || v; if (p.kayitlar) ogr.push(p); } catch (x) { } if (--kalan === 0) ciz(); };
      r.readAsText(f);
    });
  } });
  e.appendChild(el('div', { class: 'kart' }, [el('label', { class: 'btn', style: 'cursor:pointer' }, ['📂 Yedek dosyalarını seç', dosya]), ' ',
    el('button', { class: 'btn ikincil', text: '⬇ Tabloyu indir (Excel/CSV)', onclick: csv })]));
  dosya.style.display = 'none';
  e.appendChild(tablo);
  function satir(p) {
    var ok = okumaKayitlari(p), testler = p.kayitlar.filter(function (k) { return k.tur === 'test'; }), son = testler[testler.length - 1], b = p.baslangic;
    var ort = ok.length ? Math.round(ok.reduce(function (a, k) { return a + k.an; }, 0) / ok.length) : '';
    var sonGun = p.calisilanGunler[p.calisilanGunler.length - 1];
    var sesli = p.kayitlar.filter(function (k) { return k.tur === 'sesli'; }).pop();
    return [p.ad, p.sinif, Math.max(0, p.gun), b ? b.eoh : '', son && son.test !== 'baslangic' ? son.eoh : '', b && son && son.test !== 'baslangic' ? Math.round((son.eoh / b.eoh - 1) * 100) + '%' : '', ort === '' ? '' : '%' + ort,
      p.calisilanGunler.length, sonGun ? new Date(sonGun + 'T12:00:00').toLocaleDateString('tr-TR') : '', sesli ? sesli.dks : '', Object.keys(p.kelimeler || {}).length];
  }
  var BAS = ['Öğrenci', 'Sınıf', 'Gün', 'Başlangıç EOH', 'Son test EOH', 'Değişim', 'Ort. anlama', 'Çalıştığı gün', 'Son çalışma', 'Sesli DKS', 'Kelime'];
  function ciz() {
    tablo.innerHTML = '';
    if (!ogr.length) { tablo.appendChild(el('p', { class: 'soluk', text: 'Okunabilen yedek dosyası bulunamadı.' })); return; }
    var t = el('table', { class: 'tablo' }, [el('tr', null, BAS.map(function (b) { return el('th', { text: b }); }))]);
    ogr.forEach(function (p) { t.appendChild(el('tr', null, satir(p).map(function (v) { return el('td', { text: String(v) }); }))); });
    tablo.appendChild(el('h3', { text: ogr.length + ' öğrenci', style: 'margin-top:0' })); tablo.appendChild(t);
    tablo.appendChild(el('p', { class: 'soluk kucuk', text: 'EOH: etkili okuma hızı (hız × anlama). DKS: sesli okumada dakikada doğru okunan kelime. Öğrencileri birbiriyle değil, her öğrenciyi kendi başlangıcıyla karşılaştırın.' }));
  }
  function csv() {
    if (!ogr.length) { uyar('Önce dosya seçin', 'Tabloyu indirmek için önce öğrenci yedek dosyalarını seçin.'); return; }
    var satirlar = [BAS].concat(ogr.map(satir)).map(function (r) { return r.map(function (v) { v = String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(';'); });
    var a = el('a', { href: URL.createObjectURL(new Blob(['﻿' + satirlar.join('\r\n')], { type: 'text/csv;charset=utf-8' })), download: 'kartal-bakisi-sinif-' + bugun() + '.csv' });
    document.body.appendChild(a); a.click(); a.remove();
  }
}

/* ---------- Hız – anlama dağılım grafiği ---------- */
function dagilimGrafik(ok) {
  var W = 640, H = 260, sol = 44, alt = 34, ust = 12, sag = 12;
  var hizlar = ok.map(function (k) { return k.kh; });
  var minH = Math.max(0, Math.floor(Math.min.apply(null, hizlar) * 0.85 / 25) * 25);
  var maksH = Math.max(minH + 50, Math.ceil(Math.max.apply(null, hizlar) * 1.08 / 25) * 25);
  function x(v) { return sol + (W - sol - sag) * (v - minH) / (maksH - minH); }
  function y(v) { return ust + (H - ust - alt) * (1 - v / 100); }
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Hız ve anlama dağılımı">';
  svg += '<rect x="' + sol + '" y="' + y(100) + '" width="' + (W - sol - sag) + '" height="' + (y(70) - y(100)) + '" fill="#2e8b57" opacity=".08"/>';
  [0, 20, 40, 60, 80, 100].forEach(function (v) { svg += '<line x1="' + sol + '" x2="' + (W - sag) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="var(--cizgi)"/><text x="' + (sol - 6) + '" y="' + (y(v) + 4) + '" font-size="11" text-anchor="end" fill="var(--soluk)">%' + v + '</text>'; });
  for (var i = 0; i <= 4; i++) { var v = minH + (maksH - minH) * i / 4; svg += '<text x="' + x(v) + '" y="' + (H - 16) + '" font-size="11" text-anchor="middle" fill="var(--soluk)">' + Math.round(v) + '</text>'; }
  svg += '<text x="' + ((W + sol) / 2) + '" y="' + (H - 2) + '" font-size="11" text-anchor="middle" fill="var(--soluk)">okuma hızı (kelime/dk) →</text>';
  ok.forEach(function (k, i) {
    var son = i === ok.length - 1, renk = k.an >= 70 ? '#2e8b57' : '#c0392b';
    svg += '<circle cx="' + x(k.kh) + '" cy="' + y(k.an) + '" r="' + (son ? 8 : 5) + '" fill="' + renk + '" opacity="' + (0.35 + 0.65 * (i + 1) / ok.length) + '"' + (son ? ' stroke="#e8a33d" stroke-width="3"' : '') + '><title>' + (i + 1) + '. okuma: ' + k.kh + ' kelime/dk, %' + k.an + '</title></circle>';
  });
  svg += '</svg>';
  var d = el('div', { class: 'grafik', html: svg });
  d.appendChild(el('p', { class: 'soluk kucuk', html: 'Her nokta bir okuman. Yeşil bant: anlama %70 ve üstü (hedef bölge). Noktaların zamanla <b>sağa doğru (daha hızlı)</b> kayarken <b>yeşil bantta kalması</b> en iyi gelişimdir. Turuncu çerçeveli nokta son okuman.' }));
  return d;
}
