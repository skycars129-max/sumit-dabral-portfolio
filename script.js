/* Portfolio interactions: gallery render, filters, lightbox, ambient timecode. */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gallery = $('#gallery');
  var filtersEl = $('#filters');
  var current = 'all';

  var ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    stack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>'
  };

  function counts() {
    var c = { all: DATA.works.length };
    DATA.works.forEach(function (w) { c[w.cat] = (c[w.cat] || 0) + 1; });
    return c;
  }

  /* ---------- filters ---------- */
  function renderFilters() {
    var c = counts();
    filtersEl.innerHTML = '';
    DATA.filters.forEach(function (f) {
      var n = c[f.key] || 0;
      if (n === 0 && f.key !== 'all') return;
      var b = document.createElement('button');
      b.className = 'filter';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(f.key === current));
      b.dataset.key = f.key;
      b.innerHTML = f.label + '<span class="filter__n">' + String(n).padStart(2, '0') + '</span>';
      b.addEventListener('click', function () {
        current = f.key;
        Array.prototype.forEach.call(filtersEl.children, function (child) {
          child.setAttribute('aria-selected', String(child.dataset.key === current));
        });
        renderGallery();
      });
      filtersEl.appendChild(b);
    });
  }

  /* ---------- gallery ---------- */
  function badgeFor(w) {
    if (w.media[0] && w.media[0].type === 'video') return { cls: '', svg: ICON.play };
    if (w.media.length > 1) return { cls: ' card__badge--stack', svg: ICON.stack };
    return { cls: ' card__badge--stack', svg: ICON.expand };
  }

  function topLabel(w) {
    var isVid = w.media[0] && w.media[0].type === 'video';
    var kind = isVid ? 'VIDEO' : (w.media.length > 1 ? 'SET · ' + String(w.media.length).padStart(2, '0') : 'STILL');
    return kind;
  }

  function renderGallery() {
    var list = current === 'all' ? DATA.works : DATA.works.filter(function (w) { return w.cat === current; });
    gallery.innerHTML = '';
    list.forEach(function (w, i) {
      var badge = badgeFor(w);
      var card = document.createElement('article');
      card.className = 'card reveal';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Open ' + w.title);
      card.innerHTML =
        '<img class="card__media card__media--' + w.fit + '" loading="lazy" alt="' + w.title + '" src="' + w.poster + '">' +
        '<div class="card__ph" hidden>No preview</div>' +
        '<div class="card__scrim"></div>' +
        '<div class="card__top"><span>' + String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0') + '</span><span>' + topLabel(w) + '</span></div>' +
        '<div class="card__badge' + badge.cls + '">' + badge.svg + '</div>' +
        '<div class="card__cap"><span class="card__title">' + w.title + '</span><span class="card__meta">' + w.meta + '</span></div>';

      var im = card.querySelector('.card__media');
      im.addEventListener('error', function () {
        im.remove();
        card.querySelector('.card__ph').hidden = false;
      });

      card.addEventListener('click', function () { openLightbox(w, 0, card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(w, 0, card); }
      });
      gallery.appendChild(card);
    });
    observeReveal();
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox');
  var lbStage = $('#lbStage');
  var lbTitle = $('#lbTitle');
  var lbCount = $('#lbCount');
  var lbPrev = $('#lbPrev');
  var lbNext = $('#lbNext');
  var lbClose = $('#lbClose');
  var lbState = { work: null, idx: 0, opener: null };

  function renderStage() {
    var w = lbState.work;
    var item = w.media[lbState.idx];
    lbStage.innerHTML = '';
    if (item.type === 'video') {
      var frame = document.createElement('div');
      frame.className = 'lb__frame';
      frame.innerHTML = '<iframe src="https://drive.google.com/file/d/' + item.driveId +
        '/preview" allow="autoplay; fullscreen" allowfullscreen title="' + w.title + '"></iframe>';
      lbStage.appendChild(frame);
    } else {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = w.title + ' — frame ' + (lbState.idx + 1);
      lbStage.appendChild(img);
    }
    lbTitle.textContent = w.title;
    lbCount.textContent = w.media.length > 1
      ? String(lbState.idx + 1).padStart(2, '0') + ' / ' + String(w.media.length).padStart(2, '0')
      : w.meta;
    var single = w.media.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }

  function openLightbox(w, idx, opener) {
    lbState = { work: w, idx: idx, opener: opener || null };
    renderStage();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbStage.innerHTML = ''; // stops the Drive iframe
    document.body.style.overflow = '';
    if (lbState.opener) lbState.opener.focus();
  }

  function step(d) {
    var n = lbState.work.media.length;
    lbState.idx = (lbState.idx + d + n) % n;
    renderStage();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === lbStage) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft' && !lbPrev.hidden) step(-1);
    else if (e.key === 'ArrowRight' && !lbNext.hidden) step(1);
  });

  /* ---------- discipline shortcuts ---------- */
  function selectFilter(key) {
    if (!DATA.filters.some(function (f) { return f.key === key; })) key = 'all';
    current = key;
    Array.prototype.forEach.call(filtersEl.children, function (child) {
      child.setAttribute('aria-selected', String(child.dataset.key === current));
    });
    renderGallery();
  }

  function bindDisciplines() {
    var work = document.getElementById('work');
    document.querySelectorAll('.discipline[data-filter], .proj[data-filter]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (b.tagName === 'A') e.preventDefault();
        selectFilter(b.dataset.filter);
        if (work) work.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var io = null;
  function observeReveal() {
    if (reduceMotion) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) { io.observe(el); });
  }

  function tagReveal() {
    var sel = '.section__head, .tl, .about > *, .toolkit__col, .contact__card, .gallery__note';
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
  }

  /* ---------- scroll progress bar ---------- */
  function scrollProgress() {
    var bar = document.querySelector('#progress span');
    if (!bar) return;
    var root = document.documentElement;
    var tick = function () {
      var max = root.scrollHeight - root.clientHeight;
      var p = max > 0 ? (window.pageYOffset || root.scrollTop) / max : 0;
      p = Math.max(0, Math.min(1, p));
      bar.style.width = (p * 100).toFixed(2) + '%';
      root.style.setProperty('--sp', p.toFixed(3));
    };
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { tick(); queued = false; });
    }, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---------- nav scroll-spy ---------- */
  function scrollSpy() {
    var map = {};
    Array.prototype.forEach.call(document.querySelectorAll('.nav__links a[href^="#"]'), function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) map[sec.id] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        ids.forEach(function (id) { map[id].classList.toggle('is-active', id === en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ids.forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- hero title-card entrance ---------- */
  function heroIntro() {
    var name = document.querySelector('.hero__name');
    if (name) {
      if (reduceMotion) {
        name.classList.add('is-cast');
      } else {
        var i = 0;
        var frag = document.createDocumentFragment();
        Array.prototype.forEach.call(name.childNodes, function (node) {
          if (node.nodeType === 3) {
            node.textContent.split('').forEach(function (chr) {
              var s = document.createElement('span');
              s.className = 'ch';
              s.textContent = chr === ' ' ? ' ' : chr;
              s.style.setProperty('--i', i++);
              frag.appendChild(s);
            });
          } else {
            frag.appendChild(node.cloneNode(true));
          }
        });
        name.textContent = '';
        name.appendChild(frag);
        var cast = function () { name.classList.add('is-cast'); };
        requestAnimationFrame(function () { requestAnimationFrame(cast); });
        setTimeout(cast, 600);
      }
    }
    var cues = document.querySelectorAll('.hero-cue');
    var castCues = function () {
      cues.forEach(function (el) { el.classList.add('is-cast'); });
    };
    if (reduceMotion) {
      castCues();
    } else {
      requestAnimationFrame(castCues);
      setTimeout(castCues, 600);
    }
  }

  /* ---------- stat count-up ---------- */
  function countUp() {
    var nums = document.querySelectorAll('.stats__num');
    if (!nums.length || reduceMotion) return;
    var parse = function (txt) {
      var m = txt.trim().match(/^(\d+)\s*([KkMm]?\+?)$/);
      return m ? { target: parseInt(m[1], 10), suffix: m[2] || '' } : null;
    };
    var run = function (el, info) {
      var start = null, dur = 1200;
      var tick = function (t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(info.target * e) + info.suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = info.target + info.suffix;
      };
      el.textContent = '0' + info.suffix;
      requestAnimationFrame(tick);
    };
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        var info = parse(en.target.textContent);
        if (info) run(en.target, info);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- ambient timecode ---------- */
  function timecode() {
    var el = document.querySelector('[data-tc]');
    if (!el || reduceMotion) return;
    var f = 0;
    setInterval(function () {
      f = (f + 1) % (24 * 60 * 60 * 25);
      var fr = f % 25, s = Math.floor(f / 25) % 60, m = Math.floor(f / 1500) % 60, h = Math.floor(f / 90000) % 24;
      var p = function (x) { return String(x).padStart(2, '0'); };
      el.textContent = p(h) + ':' + p(m) + ':' + p(s) + ':' + p(fr);
    }, 40);
  }

  /* ---------- init ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = '© ' + new Date().getFullYear();

  heroIntro();
  renderFilters();
  renderGallery();
  bindDisciplines();
  tagReveal();
  observeReveal();
  scrollProgress();
  scrollSpy();
  countUp();
  timecode();
})();
