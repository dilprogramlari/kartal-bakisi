/* Kartal Bakışı – göz, dikkat ve görüş alanı egzersizleri
   Her egzersiz: calistir(kap, ayar, bitti, z)
   bitti({baslik, satirlar:[[ad,deger]], notlar:[[sinif,html]], kayit:{...}}) */
'use strict';

var EGZ = window.EGZ = {};
var ALFABE = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
function yanipAcik() { var p = P(); return !p || p.ayar.yanip !== false; }

/* ---------- 0. Hazırlık kontrolü ---------- */
EGZ.hazirlik = {
  ad: 'Hazırlık Kontrolü', simge: '✅', kisa: 'Çalışmaya uygun ortamı hazırla.',
  calistir: function (kap, ayar, bitti) {
    var maddeler = [
      'Dik oturdum, sırtım dayalı, ayaklarım yerde.',
      'Ortam aydınlık; ekranda parlama yok.',
      'Ekranla gözüm arasında yaklaşık bir kol boyu (50–70 cm) mesafe var.',
      'Gözlüğüm varsa taktım.',
      'Telefon bildirimleri kapalı, ortam sessiz.',
      'Yanımda su var; dinlenmiş hissediyorum.'
    ];
    var liste = el('div', { class: 'liste-kontrol' });
    var dugme = el('button', { class: 'btn buyuk', text: 'Hazırım ▶', disabled: 'disabled', onclick: function () { bitti(null); } });
    maddeler.forEach(function (m) {
      var c = el('input', { type: 'checkbox', onchange: function () { dugme.disabled = $$('input', liste).some(function (x) { return !x.checked; }); } });
      liste.appendChild(el('label', null, [c, el('span', { text: m })]));
    });
    kap.appendChild(el('div', { class: 'kart' }, [
      el('h2', { text: '✅ Başlamadan önce', style: 'margin-top:0' }),
      el('p', { class: 'soluk', text: 'Her maddeyi kontrol et ve işaretle. Bu 30 saniye, çalışmanın verimini çok artırır.' }),
      liste,
      el('div', { class: 'uyari kucuk', html: 'Çalışma sırasında gözün ağrır, sulanır ya da başın ağrırsa <b>hemen ara ver</b>. Bu durum sık oluyorsa ailene söyle ve bir göz doktoruna görün.' }),
      dugme
    ]));
  }
};

/* ---------- 1. Göz ısınması ---------- */
EGZ.isinma = {
  ad: 'Göz Isınması', simge: '👁️', kisa: 'Hareket eden noktayı yalnızca gözlerinle izle.',
  calistir: function (kap, ayar, bitti, z) {
    var desen = ayar.desen || 'karma', sure = (ayar.sure || 40) * 1000;
    var adlar = { yatay: 'sağa-sola', dikey: 'yukarı-aşağı', capraz: 'çapraz', sekiz: 'yatay sekiz', daire: 'daire', karma: 'karma' };
    kap.appendChild(aciklamaKutusu('👁️', 'Göz Isınması (' + adlar[desen] + ')',
      'Başını <b>oynatmadan</b>, yalnızca gözlerinle turuncu noktayı izle. ' + (sure / 1000) + ' saniye sürer.',
      'Okurken gözlerimiz satır üzerinde küçük sıçramalar yapar. Bu kısa ısınma, dikkatini toplayıp okumaya hazırlanman içindir (tek başına hız kazandırmaz). Başını sabit tutmak için çeneni hafifçe eline dayayabilirsin. Gözün yorulursa birkaç saniye kapat ve devam et.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var sayac = el('span', { class: 'sayac' });
      var kutu = el('div', { class: 'sahne-kutu' }); var top = el('div', { class: 'top-nokta' }); kutu.appendChild(top);
      kap.appendChild(el('div', { class: 'satir-arasi' }, [el('b', { text: 'Noktayı gözlerinle izle' }), sayac]));
      kap.appendChild(kutu);
      var t0 = performance.now(), sira = ['yatay', 'dikey', 'capraz', 'daire', 'sekiz'];
      function konum(d, t) {
        var w = t / 4000 * 2 * Math.PI;
        switch (d) {
          case 'yatay': return [.5 + .44 * Math.sin(w), .5];
          case 'dikey': return [.5, .5 + .42 * Math.sin(w)];
          case 'capraz': var s = Math.sin(w); return Math.floor(t / 8000) % 2 ? [.5 + .42 * s, .5 + .4 * s] : [.5 + .42 * s, .5 - .4 * s];
          case 'daire': return [.5 + .4 * Math.cos(w), .5 + .38 * Math.sin(w)];
          case 'sekiz': return [.5 + .44 * Math.sin(w), .5 + .35 * Math.sin(2 * w)];
        }
      }
      (function ciz() {
        var t = performance.now() - t0;
        if (t >= sure) { bitti({ baslik: 'Göz ısınması tamam 👍', satirlar: [['Süre', Math.round(sure / 1000) + ' sn']], notlar: [['bilgi', 'Şimdi gözlerini 3 saniye kapat, sonra devam et.']], kayit: { tur: 'egzersiz', ad: 'isinma' } }); return; }
        var d = desen === 'karma' ? sira[Math.floor(t / 8000) % sira.length] : desen;
        var k = konum(d, t);
        top.style.left = (k[0] * 100) + '%'; top.style.top = (k[1] * 100) + '%';
        sayac.textContent = Math.ceil((sure - t) / 1000) + ' sn';
        z.raf(ciz);
      })();
    }
  }
};

/* ---------- 2. Schulte tablosu ---------- */
EGZ.schulte = {
  ad: 'Schulte Tablosu', simge: '🔢', kisa: 'Sayıları sırayla bul; gözünü merkezde tutmaya çalış.',
  calistir: function (kap, ayar, bitti, z) {
    var n = ayar.n || 3, tip = ayar.tip || 'sayi', N = n * n;
    var ogeler = []; for (var i = 0; i < N; i++) ogeler.push(tip === 'harf' ? ALFABE[i] : String(i + 1));
    var ilk = tip === 'harf' ? 'A' : '1', son = ogeler[N - 1];
    kap.appendChild(aciklamaKutusu('🔢', 'Schulte Tablosu ' + n + '×' + n + (tip === 'harf' ? ' (harf)' : ''),
      (tip === 'harf' ? 'Harfleri alfabe sırasıyla (' + ilk + ', ' + ogeler[1] + ', ' + ogeler[2] + '…)' : 'Sayıları 1\'den ' + N + '\'e kadar sırayla') + ' bul ve dokun. Olabildiğince hızlı ama dikkatli ol.',
      'Bu bir <b>dikkat ve görsel tarama</b> oyunudur: gözünü düzenli gezdirmeyi ve odaklanmayı çalıştırır. Gözünü tablonun ortasına yakın tut, sayıları <b>göz ucuyla</b> yakalamaya çalış. Başta gözlerin gezinebilir; çalıştıkça merkezden daha geniş bir alanı görmeye başlarsın.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var sira = 0, hata = 0, t0 = performance.now();
      var sayac = el('span', { class: 'sayac', text: '0,0 sn' });
      var bilgi = el('b', { text: 'Bul: ' + ogeler[0] });
      var izg = el('div', { class: 'schulte', style: 'grid-template-columns:repeat(' + n + ',1fr)' });
      karistir(ogeler).forEach(function (o) {
        var b = el('button', { text: o, onclick: function () {
          if (o === ogeler[sira]) {
            b.classList.add('tamam'); sira++;
            if (sira === N) {
              var ms = performance.now() - t0; z.hepsi();
              var yeniRekor = rekor('schulte' + n + (tip === 'harf' ? 'h' : ''), Math.round(ms), true);
              bitti({ baslik: 'Tablo tamam!', satirlar: [['Süre', sn(ms)], ['Hata', String(hata)], ['En iyi', sn(P().rekorlar['schulte' + n + (tip === 'harf' ? 'h' : '')])]],
                notlar: [yeniRekor ? ['basari', '🏆 Yeni rekor! Kendini geçtin.'] : null, ms / N > 2500 ? ['bilgi', 'İpucu: Gözünü merkeze sabitlemeye çalış; aradığını göz ucuyla yakala.'] : null],
                kayit: { tur: 'egzersiz', ad: 'schulte' + n, sure: Math.round(ms), puan: hata } });
              return;
            }
            bilgi.textContent = 'Bul: ' + ogeler[sira];
          } else { hata++; b.classList.add('hata'); z.sure(function () { b.classList.remove('hata'); }, 250); }
        } });
        izg.appendChild(b);
      });
      if (n % 2 === 0) izg.appendChild(el('div', { class: 'nokta' }));
      kap.appendChild(el('div', { class: 'satir-arasi' }, [bilgi, sayac]));
      kap.appendChild(izg);
      z.aralik(function () { sayac.textContent = sn(performance.now() - t0); }, 100);
    }
  }
};

/* ---------- 3. Harf avı ---------- */
var HARF_SETLERI = [['b', 'd', 'p'], ['m', 'n', 'u'], ['ı', 'i', 'l'], ['ö', 'o', 'c'], ['ş', 's', 'ç'], ['ğ', 'g', 'q'], ['ü', 'u', 'v'], ['e', 'a', 'c']];
EGZ.harfavi = {
  ad: 'Harf Avı', simge: '🔍', kisa: 'Benzer harfler arasında hedef harfin hepsini bul.',
  calistir: function (kap, ayar, bitti, z) {
    var set = HARF_SETLERI[ayar.set != null ? ayar.set : Math.floor(Math.random() * HARF_SETLERI.length)];
    var hedef = set[0], sure = (ayar.sure || 45) * 1000;
    var dar = window.innerWidth < 560, sut = dar ? 8 : 10, sat = dar ? 10 : 8, N = sut * sat, H = 12 + Math.floor(Math.random() * 4);
    kap.appendChild(aciklamaKutusu('🔍', 'Harf Avı',
      'Tablodaki bütün <b style="font-size:1.6rem;font-family:Georgia">' + hedef + '</b> harflerini bul ve dokun. Süren ' + (sure / 1000) + ' saniye.',
      'Benzer harfleri ayırt etmek (b–d–p gibi) okurken <b>dikkat</b> ve <b>görsel ayırt etme</b> becerini güçlendirir. Satır satır, soldan sağa tarayarak ilerle.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var harfler = []; for (var i = 0; i < N; i++) harfler.push(i < H ? hedef : rastgele(set.slice(1)));
      harfler = karistir(harfler);
      var bulunan = 0, yanlis = 0, t0 = performance.now(), bitti_ = false;
      var sayac = el('span', { class: 'sayac' }); var durum = el('b', { text: 'Aranan: ' + hedef + '  •  Bulunan: 0' });
      var izg = el('div', { class: 'harfizgara', style: 'grid-template-columns:repeat(' + sut + ',1fr)' });
      harfler.forEach(function (h) {
        var b = el('button', { text: h, onclick: function () {
          if (bitti_ || b.classList.contains('bulundu')) return;
          if (h === hedef) { b.classList.add('bulundu'); bulunan++; durum.textContent = 'Aranan: ' + hedef + '  •  Bulunan: ' + bulunan; if (bulunan === H) son(); }
          else { yanlis++; b.classList.add('yanlis'); z.sure(function () { b.classList.remove('yanlis'); }, 300); }
        } });
        izg.appendChild(b);
      });
      kap.appendChild(el('div', { class: 'satir-arasi' }, [durum, sayac]));
      kap.appendChild(izg);
      kap.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn ikincil', text: 'Bitirdim', onclick: son })]));
      z.aralik(function () { var k = sure - (performance.now() - t0); sayac.textContent = Math.max(0, Math.ceil(k / 1000)) + ' sn'; if (k <= 0) son(); }, 200);
      function son() {
        if (bitti_) return; bitti_ = true; z.hepsi();
        var ms = performance.now() - t0, puan = Math.max(0, bulunan - yanlis);
        rekor('harfavi', puan);
        bitti({ baslik: 'Harf avı bitti', satirlar: [['Bulunan', bulunan + ' / ' + H], ['Yanlış dokunuş', String(yanlis)], ['Süre', sn(ms)]],
          notlar: [bulunan === H && yanlis === 0 ? ['basari', 'Kusursuz! Hepsini hatasız buldun.'] : yanlis > 3 ? ['bilgi', 'Hızdan önce doğruluk: dokunmadan önce harfe bir an bak.'] : null],
          kayit: { tur: 'egzersiz', ad: 'harfavi', puan: puan, sure: Math.round(ms) } });
      }
    }
  }
};

/* ---------- 4. Aynı mı, farklı mı? ---------- */
var BENZER = { b: 'd', d: 'b', m: 'n', n: 'm', 'ı': 'i', i: 'ı', o: 'ö', 'ö': 'o', u: 'ü', 'ü': 'u', s: 'ş', 'ş': 's', c: 'ç', 'ç': 'c', g: 'ğ', 'ğ': 'g', e: 'a', a: 'e', k: 'h', l: 't', t: 'l', r: 'n', p: 'b', y: 'v', v: 'y', z: 's' };
function bozKelime(w) {
  for (var deneme = 0; deneme < 20; deneme++) {
    var i = 1 + Math.floor(Math.random() * (w.length - 1)), sonuc;
    if (Math.random() < .5 && i < w.length - 1 && w[i] !== w[i + 1]) sonuc = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    else if (BENZER[w[i]]) sonuc = w.slice(0, i) + BENZER[w[i]] + w.slice(i + 1);
    if (sonuc && sonuc !== w) return sonuc;
  }
  return w.slice(0, -1) + (w.slice(-1) === 'a' ? 'e' : 'a');
}
EGZ.aynifarkli = {
  ad: 'Aynı mı, Farklı mı?', simge: '⚖️', kisa: 'İki kelimeye bir bakışta karar ver.',
  calistir: function (kap, ayar, bitti, z) {
    var adet = ayar.adet || 20;
    kap.appendChild(aciklamaKutusu('⚖️', 'Aynı mı, Farklı mı?',
      'Ekranda iki kelime göreceksin. Tıpatıp aynıysa <b>Aynı</b>, bir harf bile farklıysa <b>Farklı</b> düğmesine bas. ' + adet + ' çift var.',
      'Klavyeden de oynayabilirsin: <b>A</b> veya <b>←</b> = Aynı, <b>L</b> veya <b>→</b> = Farklı. Kelimeyi harf harf değil, <b>bütün olarak</b> görmeye çalış. Bu, okurken kelimeleri hızlı tanımanı sağlar.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var havuz = kelimeHavuzu().filter(function (w) { return w.length >= 5; });
      var ciftler = karistir(havuz).slice(0, adet).map(function (w, i) { var ayni = i % 2 === 0; return { a: w, b: ayni ? w : bozKelime(w), ayni: ayni }; });
      ciftler = karistir(ciftler);
      var i = 0, dogru = 0, sureler = [], t;
      var bar = el('div', { class: 'ilerleme' }, [el('i', { style: 'width:0' })]);
      var cift = el('div', { class: 'cift' });
      var geri = el('p', { class: 'orta soluk', html: '&nbsp;' });
      var bA = el('button', { class: 'btn buyuk', text: '= Aynı', onclick: function () { cevap(true); } });
      var bF = el('button', { class: 'btn buyuk ikincil', text: '≠ Farklı', onclick: function () { cevap(false); } });
      kap.appendChild(bar); kap.appendChild(cift);
      kap.appendChild(el('div', { class: 'orta' }, [bA, bF])); kap.appendChild(geri);
      function tus(e) {
        var k = e.key.toLocaleLowerCase('tr');
        if (k === 'a' || e.key === 'ArrowLeft') cevap(true);
        else if (k === 'l' || e.key === 'ArrowRight') cevap(false);
      }
      document.addEventListener('keydown', tus);
      var eskiTemizle = aktifTemizle; aktifTemizle = function () { document.removeEventListener('keydown', tus); if (eskiTemizle) eskiTemizle(); };
      function goster() {
        var c = ciftler[i]; cift.innerHTML = '';
        cift.appendChild(el('span', { text: c.a })); cift.appendChild(el('span', { text: c.b }));
        bar.firstChild.style.width = (i / adet * 100) + '%'; t = performance.now();
      }
      function cevap(ayni) {
        if (i >= adet) return;
        var c = ciftler[i]; sureler.push(performance.now() - t);
        if (c.ayni === ayni) { dogru++; geri.innerHTML = '<span style="color:var(--iyi)">✔ Doğru</span>'; }
        else geri.innerHTML = '<span style="color:var(--kotu)">✘ ' + (c.ayni ? 'İkisi aynıydı' : 'Farklıydı: ' + esc(c.a) + ' / ' + esc(c.b)) + '</span>';
        i++;
        if (i >= adet) {
          document.removeEventListener('keydown', tus);
          var ort = sureler.reduce(function (a, b) { return a + b; }, 0) / sureler.length;
          rekor('aynifarkli', dogru);
          bitti({ baslik: 'Aynı mı, Farklı mı? bitti', satirlar: [['Doğru', dogru + ' / ' + adet], ['Ortalama karar süresi', sn(ort)]],
            notlar: [dogru === adet ? ['basari', 'Hepsi doğru! Harika bir dikkat.'] : dogru < adet * .7 ? ['bilgi', 'Acele etme; önce doğru, sonra hızlı.'] : null],
            kayit: { tur: 'egzersiz', ad: 'aynifarkli', puan: dogru, sure: Math.round(ort) } });
          return;
        }
        goster();
      }
      goster();
    }
  }
};

/* ---------- 5. Şimşek kelime (taşistoskop) ---------- */
function sayiCeldirici(s) {
  var c = {}; var deneme = 0;
  while (Object.keys(c).length < 3 && deneme++ < 50) {
    var a = s.split(''), i = Math.floor(Math.random() * a.length);
    if (Math.random() < .5 && i < a.length - 1 && a[i] !== a[i + 1]) { var t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; }
    else a[i] = String((+a[i] + 1 + Math.floor(Math.random() * 8)) % 10);
    var y = a.join(''); if (y !== s) c[y] = 1;
  }
  return Object.keys(c);
}
EGZ.simsek = {
  ad: 'Şimşek Kelime', simge: '⚡', kisa: 'Bir anlığına gösterilen kelimeyi yakala.',
  calistir: function (kap, ayar, bitti, z) {
    var icerik = ayar.icerik || 'kelime', tur = ayar.tur || 10;
    var adlar = { kelime: 'tek kelime', grup2: 'iki kelimelik grup', grup3: 'üç kelimelik grup', sayi: 'sayı' };
    var bas = { kelime: 300, grup2: 450, grup3: 600, sayi: 400 }[icerik];
    var p = P(); var anahtar = 'simsekMs_' + icerik; if (p && p.rekorlar[anahtar]) bas = Math.min(bas, Math.round(p.rekorlar[anahtar] * 1.3));
    var enAz = yanipAcik() ? 50 : 250;
    kap.appendChild(aciklamaKutusu('⚡', 'Şimşek Kelime (' + adlar[icerik] + ')',
      'Önce ortadaki kırmızı noktaya bak. Ardından bir ' + adlar[icerik] + ' <b>bir anlığına</b> görünecek. Gördüğünü seçeneklerden bul. ' + tur + ' tur.',
      'Bu çalışma, gözünün bir bakışta <b>daha fazla harf ve kelime</b> almasını sağlar. Doğru bildikçe gösterim süresi kısalır, yanılınca uzar. Tahmin etmekten çekinme; zihnin gördüğünden fazlasını yakalar.' + (yanipAcik() ? '' : '<br><i>Işık hassasiyeti ayarın açık: gösterimler daha yavaş.</i>'),
      basla));
    function uret() {
      if (icerik === 'sayi') { var L = 4 + Math.min(3, Math.floor(dogru / 3)); var s = ''; for (var i = 0; i < L; i++) s += Math.floor(Math.random() * 10); return { h: s, c: sayiCeldirici(s) }; }
      if (icerik === 'kelime') { var hv = kelimeHavuzu(); var w = rastgele(hv); return { h: w, c: benzerCeldiriciler(w, hv, 3) }; }
      var g = kelimeGruplari(icerik === 'grup2' ? 2 : 3); var h = rastgele(g);
      var parca = h.split(' '); var hv2 = kelimeHavuzu();
      var cel = [0, 1, 2].map(function (k) { var q = parca.slice(); var j = (k + Math.floor(Math.random() * q.length)) % q.length; var alt = benzerCeldiriciler(temizKelime(q[j]) || q[j], hv2, 1)[0] || bozKelime(q[j]); q[j] = alt; return q.join(' '); });
      return { h: h, c: cel.filter(function (x, i, a) { return x !== h && a.indexOf(x) === i; }) };
    }
    var ms = bas, dogru = 0, n = 0, enIyi = null;
    function basla() {
      kap.innerHTML = '';
      var bilgi = el('div', { class: 'satir-arasi' }, [el('b', { text: 'Tur 1 / ' + tur }), el('span', { class: 'sayac' })]);
      var flas = el('div', { class: 'flas' }); var sec = el('div', { class: 'secenekler-izgara' });
      kap.appendChild(bilgi); kap.appendChild(flas); kap.appendChild(sec);
      function tur_() {
        if (n >= tur) {
          if (enIyi) rekor(anahtar, enIyi, true);
          bitti({ baslik: 'Şimşek Kelime bitti', satirlar: [['Doğru', dogru + ' / ' + tur], ['En kısa başarılı gösterim', enIyi ? enIyi + ' ms' : '–'], ['Kişisel en iyi', P().rekorlar[anahtar] ? P().rekorlar[anahtar] + ' ms' : '–']],
            notlar: [['bilgi', '1 saniye = 1000 milisaniye (ms). ' + (enIyi ? enIyi + ' ms, saniyenin yaklaşık ' + Math.max(1, Math.round(1000 / enIyi)) + '\'de biri demek!' : '')]],
            kayit: { tur: 'egzersiz', ad: 'simsek_' + icerik, puan: dogru, sure: enIyi || 0 } });
          return;
        }
        bilgi.firstChild.textContent = 'Tur ' + (n + 1) + ' / ' + tur; bilgi.lastChild.textContent = ms + ' ms';
        sec.innerHTML = ''; flas.innerHTML = ''; flas.appendChild(el('span', { class: 'sabit' }));
        var o = uret();
        z.sure(function () {
          flas.textContent = o.h;
          z.sure(function () {
            flas.textContent = yanipAcik() ? '■■■■■■' : '';
            z.sure(function () {
              flas.textContent = '?';
              karistir([o.h].concat(o.c.slice(0, 3))).forEach(function (s) {
                sec.appendChild(el('button', { class: 'secenek', text: s, onclick: function () {
                  if (sec.dataset.bitti) return; sec.dataset.bitti = 1;
                  var ok = s === o.h; n++;
                  if (ok) { dogru++; if (!enIyi || ms < enIyi) enIyi = ms; ms = Math.max(enAz, Math.round(ms * .82)); }
                  else ms = Math.min(1500, Math.round(ms * 1.25));
                  $$('.secenek', sec).forEach(function (b) { if (b.textContent === o.h) b.classList.add('dogru'); else if (b.textContent === s) b.classList.add('yanlis'); });
                  z.sure(function () { delete sec.dataset.bitti; tur_(); }, ok ? 500 : 1100);
                } }));
              });
            }, 140);
          }, ms);
        }, 700);
      }
      tur_();
    }
  }
};

/* ---------- 6. Görüş alanı genişletme ---------- */
EGZ.gorus = {
  ad: 'Görüş Alanı', simge: '🔭', kisa: 'Merkeze bakarken iki yandaki harfleri yakala.',
  calistir: function (kap, ayar, bitti, z) {
    var tur = ayar.tur || 12, seviye = ayar.seviye || 2, enIyi = 0, dogru = 0, n = 0;
    var harfler = 'BCÇDFGHKLMNPRSŞTVYZ'.split('');
    kap.appendChild(aciklamaKutusu('🔭', 'Görüş Alanı Genişletme',
      'Gözünü <b>ortadaki kırmızı noktadan ayırma</b>. Noktanın sağında ve solunda bir anlığına iki harf belirecek. Hangi iki harfi gördüğünü seç.',
      'Bildikçe harfler merkezden <b>uzaklaşır</b>. Amaç gözünü kaydırmadan, göz ucuyla daha geniş bir alanı fark edebilmek. Bu bir dikkat ve odaklanma çalışmasıdır; okuma hızını tek başına artırmaz ama okurken gözünü sabit ve dikkatli tutmana yardım eder. Gözünü kaydırırsan harfleri kaçırırsın; dürüst ol, merkeze bak!',
      basla));
    function basla() {
      kap.innerHTML = '';
      var bilgi = el('div', { class: 'satir-arasi' }, [el('b'), el('span', { class: 'sayac' })]);
      var alan = el('div', { class: 'gorus' }, [el('div', { class: 'merkez' })]);
      var sec = el('div', { class: 'secenekler-izgara' });
      kap.appendChild(bilgi); kap.appendChild(alan); kap.appendChild(sec);
      function tur_() {
        if (n >= tur) {
          rekor('gorus', enIyi);
          bitti({ baslik: 'Görüş alanı çalışması bitti', satirlar: [['Doğru', dogru + ' / ' + tur], ['Ulaştığın en geniş seviye', String(enIyi) + ' / 9'], ['Kişisel en iyi', String(P().rekorlar.gorus || enIyi)]],
            kayit: { tur: 'egzersiz', ad: 'gorus', puan: enIyi } });
          return;
        }
        bilgi.firstChild.textContent = 'Tur ' + (n + 1) + ' / ' + tur; bilgi.lastChild.textContent = 'Seviye ' + seviye;
        sec.innerHTML = ''; $$('.harf', alan).forEach(function (h) { h.remove(); });
        var a = rastgele(harfler), b = rastgele(harfler), uz = 3 + seviye * 4.5;
        z.sure(function () {
          var hA = el('span', { class: 'harf', text: a, style: 'left:' + (50 - uz) + '%' });
          var hB = el('span', { class: 'harf', text: b, style: 'left:' + (50 + uz) + '%' });
          alan.appendChild(hA); alan.appendChild(hB);
          z.sure(function () {
            hA.remove(); hB.remove();
            var dogruS = a + ' – ' + b, ss = {}; ss[dogruS] = 1;
            var tur3 = 0;
            while (Object.keys(ss).length < 4) {
              var digerA = rastgele(harfler.filter(function (h) { return h !== a; })), digerB = rastgele(harfler.filter(function (h) { return h !== b; }));
              var x = [digerA + ' – ' + b, a + ' – ' + digerB, digerA + ' – ' + digerB][tur3++ % 3]; ss[x] = 1;
            }
            karistir(Object.keys(ss)).forEach(function (s) {
              sec.appendChild(el('button', { class: 'secenek', text: s, onclick: function () {
                if (sec.dataset.bitti) return; sec.dataset.bitti = 1; n++;
                var ok = s === dogruS;
                if (ok) { dogru++; enIyi = Math.max(enIyi, seviye); seviye = Math.min(9, seviye + 1); } else seviye = Math.max(1, seviye - 1);
                $$('.secenek', sec).forEach(function (bt) { if (bt.textContent === dogruS) bt.classList.add('dogru'); else if (bt.textContent === s) bt.classList.add('yanlis'); });
                z.sure(function () { delete sec.dataset.bitti; tur_(); }, ok ? 500 : 1000);
              } }));
            });
          }, yanipAcik() ? 220 : 400);
        }, 900);
      }
      tur_();
    }
  }
};

/* ---------- 7. Kelime hazinesi ---------- */
EGZ.kelime = {
  ad: 'Kelime Hazinesi', simge: '📚', kisa: 'Metinlerdeki yeni kelimelerin anlamını eşleştir.',
  calistir: function (kap, ayar, bitti, z) {
    var tum = []; (window.METINLER || []).forEach(function (m) { (m.kelimeler || []).forEach(function (k) { tum.push({ k: k.k, a: k.a, m: m }); }); });
    var kaynak = ayar.metinler ? tum.filter(function (x) { return ayar.metinler.indexOf(x.m.id) >= 0; }) : karistir(tum).slice(0, 5);
    if (!kaynak.length) { bitti(null); return; }
    kaynak = kaynak.slice(0, ayar.adet || 5);
    kap.appendChild(aciklamaKutusu('📚', 'Kelime Hazinesi',
      'Okuduğun metinlerde geçen ' + kaynak.length + ' kelimenin anlamını bulacaksın. Kelimeyi cümle içinde gör, doğru anlamı seç.',
      'Kelime hazinesi geniş olan öğrenci <b>daha hızlı</b> okur; çünkü bilmediği kelimede takılıp kalmaz. Öğrendiğin kelimeler <b>Kelime Defterim</b>\'e eklenir.',
      basla));
    function cumle(x) {
      var c = x.m.metin.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]*/g) || [];
      var s = c.filter(function (s) { return kucuk(s).indexOf(kucuk(x.k)) >= 0; })[0];
      return s ? esc(s).replace(new RegExp('(' + x.k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<b style="background:var(--isik)">$1</b>') : '';
    }
    function basla() {
      var i = 0, dogru = 0;
      function goster() {
        kap.innerHTML = '';
        if (i >= kaynak.length) {
          bitti({ baslik: 'Kelime hazinen büyüyor 📚', satirlar: [['Doğru', dogru + ' / ' + kaynak.length], ['Kelime Defterindeki kelime', String(Object.keys(P().kelimeler).length)]],
            notlar: [['bilgi', 'Bu kelimeleri bugün bir cümlede kullanmaya çalış. Kullanılan kelime unutulmaz!']], kayit: { tur: 'egzersiz', ad: 'kelime', puan: dogru } });
          return;
        }
        var x = kaynak[i];
        var cel = karistir(tum.filter(function (y) { return y.a !== x.a; })).slice(0, 3).map(function (y) { return y.a; });
        var sec = el('div');
        kap.appendChild(el('div', { class: 'adimbar' }, [el('span', { text: (i + 1) + ' / ' + kaynak.length }), el('div', { class: 'ilerleme' }, [el('i', { style: 'width:' + (i / kaynak.length * 100) + '%' })])]));
        kap.appendChild(el('div', { class: 'kart' }, [
          el('h2', { text: x.k, style: 'margin-top:0;font-size:1.8rem;font-family:Georgia' }),
          el('p', { class: 'soluk', html: '“' + cumle(x) + '”' }),
          el('p', { text: 'Bu kelimenin anlamı hangisi?' }), sec]));
        karistir([x.a].concat(cel)).forEach(function (s) {
          sec.appendChild(el('button', { class: 'secenek', text: s, onclick: function () {
            if (sec.dataset.bitti) return; sec.dataset.bitti = 1;
            var ok = s === x.a; if (ok) dogru++;
            var p = P(); p.kelimeler[x.k] = { a: x.a, m: x.m.id, t: new Date().toISOString(), d: ok }; kaydet();
            $$('.secenek', sec).forEach(function (b) { if (b.textContent === x.a) b.classList.add('dogru'); else if (b.textContent === s) b.classList.add('yanlis'); });
            z.sure(function () { i++; goster(); }, ok ? 700 : 1600);
          } }));
        });
      }
      goster();
    }
  }
};

/* ---------- 8. Göz dinlendirme ---------- */
EGZ.dinlen = {
  ad: 'Göz Dinlendirme', simge: '🌿', kisa: '20-20-20 kuralı ve avuçlama ile gözlerini dinlendir.',
  calistir: function (kap, ayar, bitti, z) {
    var asamalar = [
      { s: 20, b: '🌳 Uzağa bak', a: 'Pencereden ya da odanın en uzak noktasından (en az 6 metre) bir yere bak. Gözlerini kırpıştır.' },
      { s: 20, b: '🤲 Avuçlama', a: 'Ellerini birbirine sürterek ısıt. Gözlerini kapat ve avuçlarınla bastırmadan ört. Karanlığın tadını çıkar, derin nefes al.' }
    ];
    var i = 0;
    function goster() {
      kap.innerHTML = '';
      if (i >= asamalar.length) { bitti({ baslik: 'Gözlerin dinlendi 🌿', satirlar: [['Süre', '40 sn']], notlar: [['bilgi', '<b>20-20-20 kuralı:</b> Ekrana bakarken her 20 dakikada bir, 20 saniye boyunca, 20 adım (yaklaşık 6 m) uzağa bak.']], kayit: { tur: 'egzersiz', ad: 'dinlen' } }); return; }
      var a = asamalar[i], kalan = a.s;
      var say = el('div', { class: 'sayac', style: 'font-size:3rem', text: kalan });
      kap.appendChild(el('div', { class: 'kart orta' }, [el('h2', { text: a.b, style: 'margin-top:0' }), el('p', { text: a.a }), say,
        el('p', null, [el('button', { class: 'btn ikincil', text: 'Geç', onclick: function () { z.hepsi(); i++; goster(); } })])]));
      z.aralik(function () { kalan--; say.textContent = kalan; if (kalan <= 0) { z.hepsi(); i++; goster(); } }, 1000);
    }
    goster();
  }
};
