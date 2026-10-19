/* 7주 커스텀: 장 목록 아코디언 — 큰 단어(시선·사람·공간·물건·기준)를 누르면 그 장이 바로 아래에 펼쳐짐, 한 번에 한 장 (학생 요청).
   - 페이지가 열릴 때 각 장(section)을 해당 단어 바로 아래 접이 칸으로 옮김(내용은 그대로)
   - 처음엔 1장만 펼침. 열린 단어를 다시 누르면 접힘. 위 메뉴(#s2 등)를 눌러도 그 장을 펼치고 이동 */
(function () {
  var D = document, nav = D.querySelector('.sw-index'); if (!nav) return;
  var items = [];
  [].forEach.call(nav.querySelectorAll('a[href^="#s"]'), function (a) {
    var sec = D.getElementById(a.getAttribute('href').slice(1)); if (!sec) return;
    var box = D.createElement('div'); box.className = 'sw-acc'; box.id = 'acc-' + sec.id;
    a.setAttribute('aria-controls', box.id); a.setAttribute('aria-expanded', 'false'); a.setAttribute('role', 'button');
    a.after(box); box.appendChild(sec);
    items.push({ a: a, box: box, sec: sec });
  });
  if (!items.length) return;
  D.documentElement.classList.add('has-acc');

  function setH(it) { it.box.style.setProperty('--acc-h', it.sec.scrollHeight + 'px'); }
  function open(it, scroll) {
    items.forEach(function (o) { if (o !== it && o.box.classList.contains('is-open')) close(o); });
    setH(it); it.box.classList.add('is-open'); it.a.classList.add('is-open'); it.a.setAttribute('aria-expanded', 'true');
    setTimeout(function () { window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('resize')); }, 650);   /* 펼친 뒤 등장 효과·카드 배치 다시 계산 */
    if (scroll) setTimeout(function () { var y = it.a.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--ca-gnb-h')) || 48) - 8; scrollTo({ top: y, behavior: 'smooth' }); }, 80);
  }
  function close(it) { setH(it); it.box.classList.remove('is-open'); it.a.classList.remove('is-open'); it.a.setAttribute('aria-expanded', 'false'); }

  items.forEach(function (it) {
    it.a.addEventListener('click', function (e) { e.preventDefault(); if (it.box.classList.contains('is-open')) close(it); else open(it, true); });
  });
  /* 위 메뉴·다른 곳의 #s2~#s6 링크도 아코디언으로 */
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#s"]'); if (!a || a.closest('.sw-index')) return;
    var it = items.filter(function (o) { return '#' + o.sec.id === a.getAttribute('href'); })[0]; if (!it) return;
    e.preventDefault(); open(it, true);
  }, true);
  /* 열린 칸 높이는 내용이 바뀌면(사진 로드·창 크기) 다시 맞춤 */
  addEventListener('resize', function () { items.forEach(function (it) { if (it.box.classList.contains('is-open')) setH(it); }); });
  addEventListener('load', function () { items.forEach(setH); });

  open(items[0], false);
})();

/* 7주 커스텀: 위 메뉴의 '정보원의 취향'을 누르면 상세 화면을 닫고 맨 위(메인)로 (학생 요청) */
(function () {
  var a = document.querySelector('.ca-gnb-name a'); if (!a) return;
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var d = document.querySelector('.ca-detail.is-on');
    if (d) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }
    setTimeout(function () { scrollTo({ top: 0, behavior: 'smooth' }); }, d ? 350 : 0);
  });
})();

/* 7주 커스텀: 사진 위 마우스를 따라다니는 빛 점 — 사진 위에 올리면 커서 자리에 부드러운 흰 빛이 따라다님(사진 밖으로는 안 번짐). 터치·동작 줄이기에서는 안 나옴 (학생 요청) */
(function () {
  var D = document, R = D.documentElement;
  if (!window.matchMedia || !matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var spot = D.createElement('div'); spot.className = 'ca-spot'; spot.setAttribute('aria-hidden', 'true'); D.body.appendChild(spot);
  function hide() { spot.classList.remove('is-on'); }
  D.addEventListener('mousemove', function (e) {
    var img = e.target.closest && e.target.closest('.ca-fig img, .ca-d-grid img, .ca-cell img');
    if (!img) return hide();
    var r = img.getBoundingClientRect();
    spot.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;--x:' + (e.clientX - r.left) + 'px;--y:' + (e.clientY - r.top) + 'px';
    spot.classList.add('is-on');
  }, { passive: true });
  D.addEventListener('mouseleave', hide); addEventListener('scroll', hide, { passive: true }); addEventListener('blur', hide);
})();
