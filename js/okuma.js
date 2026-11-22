/* Kartal Bakışı – okuma yöntemleri, anlama soruları, göz atma ve tarama */
'use strict';

var YONTEMLER = {
  serbest: { ad: 'Serbest süreli okuma', simge: '⏱️', kisa: 'Kendi hızında oku, süren ölçülsün.' },
  rehberli: { ad: 'Rehberli okuma', simge: '🖍️', kisa: 'Satır izleyiciyi takip et, geri dönme.' },
  grup: { ad: 'Kelime gruplarıyla okuma', simge: '🧩', kisa: 'Kelimeleri tek tek değil, gruplar hâlinde oku.' },
  rsvp: { ad: 'Tek noktada okuma', simge: '🎯', kisa: 'Kelimeler ekranın ortasında art arda akar.' },
  dinle: { ad: 'Dinleyerek okuma', simge: '🎧', kisa: 'Metni dinlerken okunan kelimeyi gözünle izle.' }
};

function metinKur(m, sinif) {
  var kutu = el('div', { class: 'metin' + (sinif ? ' ' + sinif : '') });
  kutu.appendChild(el('h2', { text: m.baslik }));
  var spanlar = [], paragraflar = [];
  m.metin.split(/\n\s*\n/).forEach(function (par) {
    var p = el('p'), bu = [];
    par.trim().split(/\s+/).forEach(function (w, i) {
      if (i) p.appendChild(document.createTextNode(' '));
      var s = el('span', { class: 'k', text: w }); p.appendChild(s); spanlar.push(s); bu.push(s);
    });
    kutu.appendChild(p); paragraflar.push(bu);
  });
  return { kutu: kutu, spanlar: spanlar, paragraflar: paragraflar };
}
function hedefHiz() { var p = P(); return (p && p.hedef) || 150; }
function hedefGuncelle(kh, an) {
  var p = P(); if (!p) return null;
  var h = p.hedef || kh, y;
  if (an >= 80) y = Math.min(Math.max(h, kh) * 1.07, h * 1.15); // bir okumada en fazla %15 artış
  else if (an >= 60) y = h;
  else y = Math.min(h, kh) * 0.92;
  y = Math.max(80, Math.min(700, yuvarla(y, 5)));
  p.hedef = y; kaydet(); return y;
}
function geriBildirim(kh, an, oncekiler) {
  var n = [];
  if (an >= 80) n.push(['basari', 'Çok iyi anladın! Bir sonraki okumada hedef hızın biraz artacak.']);
  else if (an >= 60) n.push(['bilgi', 'Anlaman iyi. Hızını şimdilik böyle koru; anlama %80\'i geçince hız artacak.']);
  else n.push(['uyari', '<b>Biraz yavaşla.</b> Anlamadan okunan metin okunmuş sayılmaz. Hedef hızın bir basamak düşürüldü.']);
  if (oncekiler.length) {
    var son = oncekiler[oncekiler.length - 1];
    if (kh > son.kh * 1.1 && an < son.an - 20) n.push(['uyari', 'Hızın arttı ama anlaman düştü. Hızlanırken de <b>ne okuduğunu düşünmeyi</b> unutma.']);
    else if (son.eoh && kh * an / 100 > son.eoh) n.push(['basari', '📈 Etkili okuma hızın bir önceki okumandan yüksek!']);
  }
  return n;
}

/* Anlama soruları */
function sorulariSor(kap, m, bitti, yalnizIlk) {
  kap.innerHTML = '';
  var sorular = yalnizIlk ? m.sorular.slice(0, 1) : m.sorular, secim = {};
  kap.appendChild(el('h2', { text: '📝 Anlama soruları – ' + m.baslik }));
  kap.appendChild(el('p', { class: 'soluk', text: 'Metne geri dönmeden, hatırladıklarına göre cevapla.' }));
  sorular.forEach(function (q, i) {
    var k = el('div', { class: 'soru' }, [el('div', { class: 's', text: (i + 1) + '. ' + q.s })]);
    q.c.forEach(function (c, j) {
      k.appendChild(el('button', { class: 'secenek', 'data-j': j, text: 'ABCD'[j] + ') ' + c, onclick: function () {
        if (kap.dataset.bitti) return; secim[i] = j;
        $$('.secenek', k).forEach(function (b) { b.classList.toggle('secili', +b.dataset.j === j); });
        kontrol.disabled = Object.keys(secim).length < sorular.length;
      } }));
    });
    kap.appendChild(k);
  });
  var kontrol = el('button', { class: 'btn buyuk', text: 'Cevaplarımı kontrol et', disabled: 'disabled', onclick: function () {
    kap.dataset.bitti = 1; var d = 0;
    sorular.forEach(function (q, i) {
      var kart = $$('.soru', kap)[i];
      $$('.secenek', kart).forEach(function (b) { var j = +b.dataset.j; if (j === q.d) b.classList.add('dogru'); else if (j === secim[i]) b.classList.add('yanlis'); });
      if (secim[i] === q.d) d++;
    });
    kontrol.remove();
    kap.appendChild(el('div', { class: 'kart orta' }, [el('p', { html: '<b>' + d + ' / ' + sorular.length + '</b> doğru. Yeşil olanlar doğru cevaplar.' }),
      el('button', { class: 'btn buyuk', text: 'Sonucumu gör ▶', onclick: function () { delete kap.dataset.bitti; bitti(Math.round(d / sorular.length * 100), d); } })]));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  } });
  kap.appendChild(el('p', { class: 'orta' }, [kontrol]));
}

/* Geri sayım 3-2-1 */
function geriSay(kap, z, sonra) {
  var s = 3, d = el('div', { class: 'flas', style: 'font-size:4rem', text: '3' });
  kap.appendChild(d);
  z.aralik(function () { s--; if (s <= 0) { d.remove(); z.hepsi(); sonra(); } else d.textContent = s; }, 700);
}

EGZ.okuma = {
  ad: 'Metin Okuma', simge: '📖', kisa: 'Metni oku, soruları cevapla.',
  calistir: function (kap, ayar, bitti, z) {
    var m = metinBul(ayar.metin); if (!m) { bitti(null); return; }
    var yon = ayar.yontem || 'serbest', Y = YONTEMLER[yon], K = kelimeSay(m.metin);
    var hiz = ayar.hiz || hedefHiz(), k = ayar.k || (yon === 'grup' ? 2 : 1);
    var ekstra = null;
    var aciklama, nasil;
    if (ayar.test) {
      aciklama = '<b>' + ayar.test + '</b>: Metni <b>her zamanki gibi</b>, anlayarak oku. Bitirince <b>Bitirdim</b>\'e bas. Sonra 5 soru cevaplayacaksın.';
      nasil = 'Bu bir ölçme. Hızlı okumaya zorlama, alışık olduğun gibi oku. Gerçek hızını bilmek, gelişimini doğru görmeni sağlar. Metin ' + K + ' kelime.';
    } else if (yon === 'serbest') {
      aciklama = 'Metni anlayarak, kendi hızında oku. <b>Başla</b>\'ya basınca süre başlar; bitirince <b>Bitirdim</b>\'e bas. (' + K + ' kelime)';
      nasil = 'İpuçları: Geri dönüp aynı satırı tekrar okumamaya çalış. Kelimeleri içinden seslendirme; gözünle oku. Parmağını ya da kalemini satırın altında rehber olarak gezdirebilirsin.';
    } else if (yon === 'rehberli') {
      aciklama = 'Satır izleyici dakikada <b>' + hiz + ' kelime</b> hızla ilerleyecek. Gözünle aydınlık satırı takip et; geride kalan satıra <b>geri dönme</b>.';
      nasil = 'Rehberli okuma, gözün geri dönmesini (en büyük zaman kaybı) engeller. İlk başta biraz hızlı gelebilir; anlamaya odaklan, zihnin hıza alışır. Gerekirse <b>Duraklat</b> düğmesini kullan.';
    } else if (yon === 'grup') {
      aciklama = 'Kelimeler <b>' + k + '\'li gruplar</b> hâlinde vurgulanacak (dakikada ' + hiz + ' kelime). Her grubu tek bakışta oku.';
      nasil = 'İyi okurlar kelimeleri tek tek değil, anlam grupları hâlinde okur: “güzel bir gün”, “okulun bahçesinde” gibi. Gözünü grubun ortasına yerleştir ve bütün grubu birden gör.';
    } else if (yon === 'dinle') {
      aciklama = 'Cihaz metni sesli okuyacak, okunan kelime vurgulanacak. Sen de <b>gözünle aynı anda</b> takip et.';
      nasil = 'Dinleyerek okuma; kelimeleri doğru tanımanı, akıcı okumayı ve vurguyu öğrenmeni kolaylaştırır. Özellikle zorlandığın metinlerde işe yarar. Sesi duyamıyorsan cihazın sesini aç. (Türkçe ses her cihazda yüklü olmayabilir.)';
    } else {
      aciklama = 'Kelimeler ekranın ortasında ' + (k > 1 ? k + '\'li gruplar hâlinde ' : '') + 'dakikada <b>' + hiz + ' kelime</b> hızla akacak. Gözünü kırmızı çizgilerin arasına sabitle.';
      nasil = 'Bu yöntemde gözün hiç hareket etmez; odaklanmayı güçlendirir. Turuncu harf gözünün odak noktasıdır. Bir şeyi kaçırırsan <b>↶ Geri sar</b> düğmesine (ya da klavyede ← tuşuna) bas; önceki cümleye dönersin. Araştırmalar, gerektiğinde geri dönebilmenin anlamayı koruduğunu gösteriyor.';
    }
    if (ayar.serbestAyar && yon === 'dinle') {
      var hs = el('select', { onchange: function () { ayar.oran = +hs.value; } });
      [[0.8, 'Yavaş'], [1, 'Normal'], [1.2, 'Hızlı'], [1.4, 'Çok hızlı']].forEach(function (o) { hs.appendChild(el('option', { value: o[0], text: 'Okuma sesi: ' + o[1] })); }); hs.value = 1;
      ekstra = el('div', { class: 'form-satir' }, [hs]);
    } else if (ayar.serbestAyar && yon !== 'serbest') {
      var sec = el('select', { onchange: function () { hiz = +sec.value; } });
      [80, 100, 120, 140, 160, 180, 200, 230, 260, 300, 350, 400, 450, 500, 600].concat([hiz]).filter(function (x, i, a) { return a.indexOf(x) === i; }).sort(function (a, b) { return a - b; })
        .forEach(function (v) { sec.appendChild(el('option', { value: v, text: v + ' kelime/dk' + (v === hedefHiz() ? ' (hedefin)' : '') })); });
      sec.value = hiz;
      ekstra = el('div', { class: 'form-satir' }, [el('label', { text: 'Hız' }), sec]);
    }
    kap.appendChild(aciklamaKutusu(ayar.test ? '📏' : Y.simge, (ayar.test ? ayar.test + ' – ' : Y.ad + ': ') + m.baslik, aciklama, nasil, basla, ekstra));

    var baslangicZ, gecen = 0;
    function basla() {
      kap.innerHTML = '';
      if (yon === 'serbest') return serbest();
      if (yon === 'dinle') return dinle();
      geriSay(kap, z, yon === 'rsvp' ? rsvp : vurgulu);
    }
    function serbest() {
      var mk = metinKur(m, 'gizli');
      var t = el('span', { class: 'sayac', text: '0 sn' });
      var bitir = el('button', { class: 'btn buyuk tam', text: '✔ Bitirdim', onclick: function () { gecen = performance.now() - baslangicZ; z.hepsi(); sorular(); } });
      kap.appendChild(el('div', { class: 'satir-arasi' }, [el('b', { text: 'Anlayarak oku' }), t]));
      kap.appendChild(mk.kutu);
      kap.appendChild(el('div', { style: 'position:sticky;bottom:.5rem;max-width:40em;margin:0 auto' }, [bitir]));
      bitir.style.display = 'none';
      var bas = el('button', { class: 'btn buyuk', text: '▶ Okumaya başla (süre başlar)', onclick: function () {
        bas.remove(); mk.kutu.classList.remove('gizli'); bitir.style.display = ''; baslangicZ = performance.now();
        z.aralik(function () { t.textContent = Math.floor((performance.now() - baslangicZ) / 1000) + ' sn'; }, 500);
      } });
      kap.insertBefore(el('p', { class: 'orta' }, [bas]), mk.kutu);
    }
    function kontrolCubugu(durdur) {
      var dur = false;
      var b = el('button', { class: 'btn ikincil', text: '⏸ Duraklat', onclick: function () { dur = !dur; b.textContent = dur ? '▶ Devam' : '⏸ Duraklat'; durdur(dur); } });
      return b;
    }
    function vurgulu() {
      var mk = metinKur(m, 'rehber');
      var dur = false;
      var cubuk = el('div', { class: 'satir-arasi', style: 'position:sticky;top:3.4rem;z-index:5;background:var(--bg);padding:.3rem 0' }, [el('b', { text: hiz + ' kelime/dk' }), kontrolCubugu(function (d) { dur = d; if (!d) ileri(); })]);
      kap.appendChild(cubuk); kap.appendChild(mk.kutu);
      // birimleri hazırla: satırlar (rehberli) ya da k'li gruplar
      var birimler = [];
      if (yon === 'rehberli') {
        var sonTop = null, bu = null;
        mk.spanlar.forEach(function (s) { var t = s.offsetTop; if (sonTop === null || Math.abs(t - sonTop) > 4) { bu = []; birimler.push(bu); sonTop = t; } bu.push(s); });
      } else {
        mk.paragraflar.forEach(function (p) { for (var i = 0; i < p.length; i += k) birimler.push(p.slice(i, i + k)); });
      }
      var i = 0, onceki = null; baslangicZ = performance.now();
      function ileri() {
        if (dur) return;
        if (onceki) onceki.forEach(function (s) { s.classList.remove('satir'); });
        if (i >= birimler.length) { gecen = performance.now() - baslangicZ; z.sure(sorular, 400); return; }
        var b = birimler[i++]; b.forEach(function (s) { s.classList.add('satir'); }); onceki = b;
        var r = b[0].getBoundingClientRect();
        if (r.top > window.innerHeight * .6 || r.top < 60) window.scrollBy({ top: r.top - window.innerHeight * .35, behavior: 'smooth' });
        var kelimeAgirlik = b.reduce(function (t, s) { return t + Math.max(.7, Math.min(1.6, s.textContent.length / 6)); }, 0);
        z.sure(ileri, kelimeAgirlik * 60000 / hiz);
      }
      ileri();
    }
    function dinle() {
      if (!('speechSynthesis' in window)) { kap.appendChild(el('div', { class: 'uyari', text: 'Bu tarayıcı sesli okumayı desteklemiyor. Başka bir okuma yöntemi seç.' })); return; }
      var sesler = speechSynthesis.getVoices(), tr = sesler.filter(function (v) { return /^tr/i.test(v.lang); })[0];
      var mk = metinKur(m, 'rehber'); var dur = false;
      if (!tr && sesler.length) kap.appendChild(el('div', { class: 'uyari kucuk', text: 'Bu cihazda Türkçe ses bulunamadı; okuma başka bir dilin sesiyle yapılabilir. Cihaz ayarlarından Türkçe ses ekleyebilirsin.' }));
      kap.appendChild(el('div', { class: 'satir-arasi', style: 'position:sticky;top:3.4rem;z-index:5;background:var(--bg);padding:.3rem 0' }, [el('b', { text: '🎧 Dinle ve gözünle izle' }),
        kontrolCubugu(function (d) { dur = d; d ? speechSynthesis.pause() : speechSynthesis.resume(); })]));
      kap.appendChild(mk.kutu);
      var pi = 0, onceki = null; baslangicZ = performance.now();
      var eskiT = aktifTemizle; aktifTemizle = function () { speechSynthesis.cancel(); if (eskiT) eskiT(); };
      function paragraf() {
        if (pi >= mk.paragraflar.length) { if (onceki) onceki.classList.remove('satir'); gecen = performance.now() - baslangicZ; z.sure(sorular, 400); return; }
        var sp = mk.paragraflar[pi++], yazi = '', baslar = [];
        sp.forEach(function (s, i) { if (i) yazi += ' '; baslar.push(yazi.length); yazi += s.textContent; });
        var u = new SpeechSynthesisUtterance(yazi); u.lang = 'tr-TR'; if (tr) u.voice = tr; u.rate = ayar.oran || 1;
        u.onboundary = function (e) {
          if (e.name && e.name !== 'word') return;
          var i = 0; while (i + 1 < baslar.length && baslar[i + 1] <= e.charIndex) i++;
          if (onceki) onceki.classList.remove('satir'); onceki = sp[i]; onceki.classList.add('satir');
          var r = onceki.getBoundingClientRect(); if (r.top > window.innerHeight * .7 || r.top < 60) window.scrollBy({ top: r.top - window.innerHeight * .35, behavior: 'smooth' });
        };
        u.onend = function () { paragraf(); };
        u.onerror = function () { paragraf(); };
        speechSynthesis.speak(u);
      }
      speechSynthesis.cancel(); paragraf();
    }
    function rsvp() {
      var w = m.metin.trim().split(/\s+/), parca = [];
      for (var i = 0; i < w.length; i += k) parca.push(w.slice(i, i + k).join(' '));
      var kutu = el('div', { class: 'rsvp' }); var bar = el('div', { class: 'ilerleme' }, [el('i', { style: 'width:0' })]);
      var dur = false;
      kap.appendChild(el('h2', { text: m.baslik, class: 'orta' }));
      kap.appendChild(bar); kap.appendChild(kutu);
      var zid = null;
      function gerisar() {
        // içinde bulunulan cümlenin başına, oradaysa bir önceki cümlenin başına dön
        var i = Math.max(0, j - 2);
        while (i > 0 && !/[.!?]["”’]?$/.test(parca[i - 1])) i--;
        if (j - i <= 2 && i > 0) { i--; while (i > 0 && !/[.!?]["”’]?$/.test(parca[i - 1])) i--; }
        j = i; geriSayisi++;
        if (!dur) { clearTimeout(zid); ileri(); }
      }
      kap.appendChild(el('p', { class: 'orta' }, [el('button', { class: 'btn ikincil', text: '↶ Geri sar', onclick: gerisar }), kontrolCubugu(function (d) { dur = d; if (!d) ileri(); })]));
      function tus(e) { if (e.key === 'ArrowLeft') { e.preventDefault(); gerisar(); } }
      document.addEventListener('keydown', tus);
      var eskiT = aktifTemizle; aktifTemizle = function () { document.removeEventListener('keydown', tus); if (eskiT) eskiT(); };
      var j = 0, geriSayisi = 0; baslangicZ = performance.now();
      function goster(s) {
        kutu.innerHTML = '';
        if (k === 1 && s.length > 1) {
          var harf = s.replace(/[^A-Za-zÇĞİÖŞÜçğıöşüâîû]/g, '').length, o = Math.max(0, Math.min(s.length - 1, Math.floor((harf - 1) * 0.35)));
          kutu.appendChild(document.createTextNode(s.slice(0, o)));
          kutu.appendChild(el('span', { text: s[o], style: 'color:var(--vurgu);font-weight:700' }));
          kutu.appendChild(document.createTextNode(s.slice(o + 1)));
        } else kutu.textContent = s;
      }
      function ileri() {
        if (dur) return;
        if (j >= parca.length) { document.removeEventListener('keydown', tus); gecen = performance.now() - baslangicZ; z.sure(sorular, 300); return; }
        var s = parca[j++]; goster(s); bar.firstChild.style.width = (j / parca.length * 100) + '%';
        var ek = /[.!?]["”’]?$/.test(s) ? 1.8 : /[,;:]$/.test(s) ? 1.35 : 1;
        zid = z.sure(ileri, k * 60000 / hiz * ek);
      }
      ileri();
    }
    function sorular() {
      var dakika = gecen / 60000, kh = Math.round(K / dakika);
      if (yon !== 'serbest' && yon !== 'dinle') kh = hiz; // hız ayarlı yöntemlerde okuma hızı = ayarlanan hız (duraklatma sayılmaz)
      tahminSor(kap, function (tahmin) {
      if (!m.sorular || !m.sorular.length) return kendiMetinSonu(kap, m, kh, tahmin, gecen, bitti);
      sorulariSor(kap, m, function (an, d) {
        var p = P();
        var onceki = p.kayitlar.filter(function (x) { return (x.tur === 'okuma' || x.tur === 'test') && x.kh; });
        var eoh = Math.round(kh * an / 100);
        var notlar = geriBildirim(kh, an, onceki);
        if (yon === 'serbest' && kh > 800) notlar.unshift(['uyari', 'Çok hızlı bitirdin. Metni gerçekten okuduysan harika! Göz gezdirdiysen sonuç gerçek hızını göstermez.']);
        var kayit = { tur: ayar.test ? 'test' : 'okuma', metin: m.id, yontem: yon, kh: kh, an: an, eoh: eoh, sure: Math.round(gecen), kelime: K, tahmin: tahmin };
        var tn = tahminNotu(tahmin, an); if (tn) notlar.push(tn);
        if (ayar.testKodu) kayit.test = ayar.testKodu;
        var yeniHedef;
        if (ayar.testKodu === 'baslangic') {
          p.baslangic = { kh: kh, an: an, eoh: eoh, t: new Date().toISOString() };
          yeniHedef = Math.max(90, yuvarla(kh * (an >= 60 ? 1.1 : 1), 5)); p.hedef = yeniHedef; kaydet();
          notlar = [['bilgi', 'Bu senin <b>başlangıç noktan</b>. Program bu değerlere göre sana uygun hedefler belirleyecek. Gelişimini İlerlemem sayfasında izleyebilirsin.']];
        } else if (yon === 'dinle') yeniHedef = hedefHiz();
        else yeniHedef = hedefGuncelle(kh, an);
        var satir = [['Okuma hızı', kh + ' kelime/dk'], ['Anlama', '%' + an + ' (' + d + '/5)'], ['Etkili okuma hızı', eoh + ' kelime/dk']];
        if (p.baslangic && ayar.testKodu !== 'baslangic') {
          var art = Math.round((eoh / p.baslangic.eoh - 1) * 100);
          satir.push(['Başlangıca göre', (art >= 0 ? '+' : '') + art + '%']);
        }
        notlar.push(['bilgi kucuk', '<b>Etkili okuma hızı</b> = okuma hızı × anlama oranı. Programın asıl ölçüsü budur. Sonraki hedef hızın: <b>' + yeniHedef + ' kelime/dk</b>.']);
        bitti({ baslik: (ayar.test ? ayar.test + ' sonucu' : 'Okuma sonucu'), satirlar: satir, notlar: notlar, kayit: kayit });
      });
      });
    }
  }
};

/* ---------- Göz atma (ana fikri yakala) ---------- */
EGZ.gozatma = {
  ad: 'Göz Atma', simge: '🦅', kisa: 'Kısa sürede metnin ana fikrini yakala.',
  calistir: function (kap, ayar, bitti, z) {
    var m = metinBul(ayar.metin) || rastgele(window.METINLER); var K = kelimeSay(m.metin);
    var s = Math.max(15, Math.round(K / (hedefHiz() * 2.5) * 60));
    kap.appendChild(aciklamaKutusu('🦅', 'Göz Atma: ' + m.baslik,
      'Metnin hepsini okumaya <b>vaktin yok</b>: yalnızca <b>' + s + ' saniye</b>! Bu sürede metnin neyi anlattığını yakala. Sonra ana fikir sorusu gelecek.',
      '<b>Kartal gibi yukarıdan bak:</b><br>1) Başlığı oku.<br>2) İlk paragrafı hızlıca oku.<br>3) Diğer paragrafların yalnızca <b>ilk cümlelerine</b> bak.<br>4) Son paragrafa göz at.<br>Bu yöntem; ders kitabına çalışmadan önce, sınavda paragraf sorularında ve araştırma yaparken çok işine yarar.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var mk = metinKur(m); var t = el('span', { class: 'sayac', text: s + ' sn' });
      kap.appendChild(el('div', { class: 'satir-arasi', style: 'position:sticky;top:3.4rem;background:var(--bg);z-index:5;padding:.3rem 0' }, [el('b', { text: 'Göz at: başlık → ilk paragraf → ilk cümleler → son paragraf' }), t]));
      kap.appendChild(mk.kutu);
      var kalan = s;
      z.aralik(function () { kalan--; t.textContent = kalan + ' sn'; if (kalan <= 0) { z.hepsi(); sor(); } }, 1000);
    }
    function sor() {
      sorulariSor(kap, m, function (an) {
        rekor('gozatma', an);
        bitti({ baslik: an === 100 ? 'Ana fikri yakaladın! 🦅' : 'Bu sefer kaçtı', satirlar: [['Süre', s + ' sn'], ['Ana fikir', an === 100 ? 'Doğru ✔' : 'Yanlış ✘']],
          notlar: [an === 100 ? ['basari', 'Göz atma stratejisini doğru kullandın.'] : ['bilgi', 'Bir dahaki sefere her paragrafın <b>ilk cümlesine</b> odaklan; ana fikir çoğu zaman oradadır.']],
          kayit: { tur: 'egzersiz', ad: 'gozatma', metin: m.id, puan: an } });
      }, true);
    }
  }
};

/* ---------- Tarama (aranan kelimeyi bul) ---------- */
EGZ.tarama = {
  ad: 'Tarama', simge: '📡', kisa: 'Metinde istenen kelimeyi en kısa sürede bul.',
  calistir: function (kap, ayar, bitti, z) {
    var m = metinBul(ayar.metin) || rastgele(window.METINLER);
    var hedefler = (m.tarama || []).slice(0, 3);
    if (!hedefler.length) { var hv = m.metin.split(/\s+/).map(temizKelime).filter(function (w) { return w.length >= 6; }); hedefler = karistir(hv).slice(0, 3); }
    kap.appendChild(aciklamaKutusu('📡', 'Tarama: ' + m.baslik,
      'Yukarıda bir kelime yazacak. Metnin içinde o kelimeyi <b>bul ve üzerine dokun</b>. ' + hedefler.length + ' kelime arayacaksın.',
      'Tarama, metnin tamamını okumadan <b>istediğin bilgiyi bulma</b> becerisidir: sözlükte kelime, haritada şehir, ders kitabında tarih bulmak gibi. Gözünü satırlarda <b>Z harfi</b> çizer gibi hızla gezdir; yalnızca aradığın kelimenin şekline odaklan.',
      basla));
    function basla() {
      kap.innerHTML = '';
      var mk = metinKur(m, 'tara'), i = 0, yanlis = 0, t0 = performance.now(), ara = [];
      var hedefYazi = el('b', { style: 'font-size:1.4rem' }); var t = el('span', { class: 'sayac' });
      kap.appendChild(el('div', { class: 'satir-arasi', style: 'position:sticky;top:3.4rem;background:var(--bg);z-index:5;padding:.4rem 0' }, [el('span', null, ['Bul: ', hedefYazi]), t]));
      kap.appendChild(mk.kutu);
      function yaz() { hedefYazi.textContent = '“' + hedefler[i] + '”  (' + (i + 1) + '/' + hedefler.length + ')'; }
      yaz(); var tA = performance.now();
      z.aralik(function () { t.textContent = sn(performance.now() - t0); }, 100);
      mk.spanlar.forEach(function (s) {
        s.addEventListener('click', function () {
          if (i >= hedefler.length) return;
          if (temizKelime(s.textContent) === temizKelime(hedefler[i])) {
            s.classList.add('bulundu'); ara.push(performance.now() - tA); i++; tA = performance.now();
            if (i >= hedefler.length) {
              z.hepsi(); var top = performance.now() - t0;
              rekor('tarama', Math.round(top / hedefler.length), true);
              z.sure(function () {
                bitti({ baslik: 'Tarama tamam 📡', satirlar: [['Toplam süre', sn(top)], ['Kelime başına', sn(top / hedefler.length)], ['Yanlış dokunuş', String(yanlis)]],
                  kayit: { tur: 'egzersiz', ad: 'tarama', metin: m.id, sure: Math.round(top), puan: yanlis } });
              }, 600);
            } else yaz();
          } else { yanlis++; s.classList.add('yanlis'); z.sure(function () { s.classList.remove('yanlis'); }, 350); }
        });
      });
    }
  }
};
