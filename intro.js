/* 7주 커스텀: 온보딩 인트로 — 히어로 문장을 지금 타자 효과 그대로(한 글자 90ms · 깜빡이는 커서 · 흰 바탕 판) 화면 가운데에 친 뒤,
   1.2초 쉬고 서서히 걷혀 첫 화면으로 (학생 요청: "히어로의 문장을 현재 효과 유지해서 인트로 화면으로").
   - 들어올 때마다(새로고침 포함) 나옴. 클릭·키·휠·건너뛰기면 바로 넘어감
   - 인트로가 나오면 히어로 제목은 다시 치지 않음(type.js가 .has-intro를 보고 건너뜀)
   - 동작 줄이기: 타자 없이 문장 전체를 잠깐 보여 주고 넘어감 */
(function () {
  var D = document, R = D.documentElement;
  var src = D.querySelector('.ca-top--hero .ca-h1'); if (!src) return;
  var full = '정보원의 시간';   /* 7주 커스텀: 인트로 문장만 '정보원의 시간'으로 (히어로 제목은 그대로) */

  var reduce = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || R.classList.contains('m0');
  var DELAY = 500, STEP = 90, HOLD = 1200;

  R.classList.add('has-intro');
  var el = D.createElement('div');
  el.className = 'ca-intro'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', full);
  el.innerHTML = '<p class="ca-intro-t" aria-hidden="true"><span class="ca-intro-in"><span class="ca-intro-txt"></span><span class="ca-caret"></span></span></p>'
    + '<button type="button" class="ca-intro-go">건너뛰기 <span aria-hidden="true">→</span></button>';
  D.body.appendChild(el);
  var txt = el.querySelector('.ca-intro-txt'), caret = el.querySelector('.ca-caret');
  /* 문장 길이에 맞춰 칸 폭을 미리 고정 → 화면 가운데에 놓이면서도 글자가 제자리에서 쳐짐 */
  var box = el.querySelector('.ca-intro-t');
  txt.textContent = full; box.style.width = 'auto';
  var w = Math.ceil(el.querySelector('.ca-intro-in').getBoundingClientRect().width) + 8;
  box.style.width = Math.min(w, innerWidth - 2 * parseFloat(getComputedStyle(el).paddingLeft || 0)) + 'px';
  txt.textContent = '';

  var closed = false, timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function close() {
    if (closed) return; closed = true; timers.forEach(clearTimeout);
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { removeEventListener(t, close, true); });
    el.classList.add('is-out');
    setTimeout(function () { el.remove(); R.classList.remove('has-intro'); window.dispatchEvent(new Event('ca-intro-done')); }, reduce ? 0 : 900);
  }
  ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { addEventListener(t, close, true); });

  if (reduce) { txt.textContent = full; caret.remove(); later(close, 1500); return; }
  var chars = Array.from(full), i = 0;
  function tick() {
    txt.textContent = chars.slice(0, ++i).join('');
    if (i < chars.length) later(tick, STEP);
    else { caret.classList.add('is-done'); later(close, HOLD + 400); }
  }
  later(tick, DELAY);
})();
