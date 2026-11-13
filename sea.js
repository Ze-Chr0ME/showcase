// Life in the margins: shoals and bubbles in the shallows, jellyfish further down, eyes
// in the dark. Everything is flat SVG moved by CSS. This file only places the creatures
// in the empty water either side of the sheet and tells the stylesheet how fast the page
// is scrolling, so they can drift, scatter and blink.
(function () {
  if (!window.IntersectionObserver || !window.ResizeObserver) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = ['#7cc4f2', '#f4ecd8', '#3d97e6', '#ffc83d', '#ff6040'];
  var FISH = [[0, 1, 2], [2, 0, 2], [2, 0, 2]];
  var MIX = ['shoal bub', 'bub shoal', 'jelly bub jelly jelly shoal', 'eyes jelly eyes', 'eyes ang eyes'];
  var STEP = [190, 200, 215, 140, 105];
  var SPOT = [[0, 6], [40, 30], [78, 4], [16, 54], [62, 58]];
  var EYE = [
    '<circle cx="13" cy="11" r="9"/><circle cx="43" cy="11" r="9"/><g class="pupil"><ellipse cx="13" cy="11" rx="2.4" ry="6.4"/><ellipse cx="43" cy="11" rx="2.4" ry="6.4"/></g>',
    '<path d="M2 5Q15 4 25 15 9 20 2 5ZM54 5Q41 4 31 15 47 20 54 5Z"/><g class="pupil"><circle cx="13" cy="11.5" r="2.6"/><circle cx="43" cy="11.5" r="2.6"/></g>',
    '<circle cx="20" cy="11" r="5"/><circle cx="37" cy="11" r="5"/><g class="pupil"><circle cx="21" cy="11" r="1.8"/><circle cx="38" cy="11" r="1.8"/></g>'
  ];
  var JELLY = '<g class="trail"><path d="M14 36c-7 11 6 17 0 28s5 14 1 26"/><path d="M25 38c-5 12 5 20 0 32s3 12 0 22"/><path d="M36 38c6 11-5 19 0 30s-4 14 0 24"/><path d="M46 36c7 10-5 16 1 27s-4 13-1 22"/></g>' +
    '<g class="bell"><path class="dome" d="M4 36C3 14 16 4 30 4s27 10 26 32c-4 6-9-2-13 1s-9 5-13 0-9-2-13 1-9 4-13-2Z"/><path class="rib" d="M14 27c1-8 5-13 10-15M30 26V12M46 27c-1-8-5-13-10-15"/><g class="spark"><circle cx="17" cy="25" r="2.3"/><circle cx="30" cy="16" r="2.3"/><circle cx="43" cy="25" r="2.3"/></g></g>';
  var ANG = '<svg viewBox="0 0 110 78"><path d="M58 24C56 5 82 0 91 15" fill="none" stroke="#2a4a9c" stroke-width="2" stroke-linecap="round"/>' +
    '<g class="lure"><circle cx="92" cy="21" r="5.5" fill="#ffc83d"/><path d="M101 12l5-4M103 21h6M101 30l5 4" fill="none" stroke="#ffc83d" stroke-width="2" stroke-linecap="round"/></g>' +
    '<path d="M27 46 6 30l6 16-6 16ZM25 46c0-16 16-25 32-24 17 1 28 12 28 24 0 14-13 23-30 23-16 0-30-8-30-23Z" fill="#0b2163"/>' +
    '<path d="M60 51l3 5 3-7 3 5 3-7 3 5 3-6" fill="none" stroke="#f4ecd8" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<circle cx="67" cy="37" r="3.6" fill="#ffc83d"/><circle cx="68" cy="37" r="1.4" fill="#040e36"/></svg>';

  // Seeded, so every visit draws the same chart.
  function rng(s) { return function () { s = s * 16807 % 2147483647; return s / 2147483647; }; }
  function css(o) { var s = ''; for (var k in o) s += k + ':' + o[k] + ';'; return s; }
  function sec(n) { return n.toFixed(1) + 's'; }

  var make = {
    shoal: function (r, k) {
      var n = 3 + (r() * 3 | 0), h = '', i, w;
      for (i = 0; i < n; i++) {
        w = 28 + r() * 20 | 0;
        h += '<svg class="f sc' + (i > 1 ? ' x' : '') + '" style="' + css({
          left: SPOT[i][0] + (r() * 5 | 0) + 'px', top: SPOT[i][1] + (r() * 5 | 0) + 'px',
          width: w + 'px', height: (w * .52 | 0) + 'px', '--c': INK[FISH[k][i % 3]],
          '--kx': (r() * 2.4 - 1.2).toFixed(2), '--ky': (r() * 2.4 - 1.2).toFixed(2),
          'animation-duration': sec(1.3 + r() * 1.3), 'animation-delay': sec(-r() * 3)
        }) + '"><use href="#fish"/></svg>';
      }
      return ['shoal', { '--t': sec(20 + r() * 16), '--r': (.45 + r() * .55).toFixed(2), 'animation-delay': sec(-r() * 36) }, h];
    },
    bub: function (r, k, room) {
      var n = 4 + (r() * 3 | 0), t = 6 + r() * 4, h = '', i;
      for (i = 0; i < n; i++) {
        h += '<i style="' + css({
          '--s': (6 + r() * 11 | 0) + 'px', '--i': (i / n + r() * .12).toFixed(2), '--wb': (r() * 22 - 11 | 0) + 'px',
          left: (r() * 8 | 0) + 'px', 'animation-delay': sec(-t * (i / n + r() * .12))
        }) + '"></i>';
      }
      return ['bub t', { '--w': '20px', '--t': sec(t), '--h': (Math.min(170 + r() * 190, room) | 0) + 'px' }, h];
    },
    jelly: function (r, k) {
      var deep = k > 2;
      return ['jelly' + (deep ? ' lumi' : ''), {
        '--w': (34 + r() * 28 | 0) + 'px', '--c': INK[deep ? 0 : [0, 1, 0, 4][r() * 4 | 0]],
        '--t': sec(11 + r() * 9), '--dx': (r() * 44 - 22 | 0) + 'px', '--dy': (-18 - r() * 40 | 0) + 'px', 'animation-delay': sec(-r() * 20)
      }, '<svg class="sc" viewBox="0 0 60 100" style="--kx:0;--ky:' + (.5 + r()).toFixed(2) + ';--b:' + sec(1.5 + r()) + '">' + JELLY + '</svg>'];
    },
    eyes: function (r, k) {
      return ['eyes t', { '--w': (30 + r() * 28 | 0) + 'px', '--c': INK[[3, 3, 0, 1, 4][r() * (k > 3 ? 5 : 4) | 0]], '--t': sec(4 + r() * 6) },
        '<svg viewBox="0 0 56 22"><g class="lid"><g class="wink" style="animation-delay:' + sec(-r() * 9) + '">' + EYE[r() * 3 | 0] + '</g></g></svg>'];
    },
    ang: function (r) {
      return ['ang', { '--w': '100px', '--t': sec(50 + r() * 12), '--r': (.6 + r() * .4).toFixed(2), 'animation-delay': sec(-10 - r() * 8) }, ANG];
    }
  };

  var zones = [].map.call(document.querySelectorAll('.zone'), function (el, n) {
    return { el: el, n: n, k: +(/\bz(\d)\b/.exec(el.className) || [0, 0])[1] };
  });
  function find(el) { for (var i = 0; i < zones.length; i++) if (zones[i].el === el) return zones[i]; }

  var eyeIO = calm ? null : new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('open', e.isIntersecting); });
  }, { rootMargin: '-20% 0px' });

  // Fill both margins of a zone from top to bottom, skipping what the chart already draws there.
  function build(z) {
    var r = rng(z.n * 7919 + 17), H = z.h = z.el.offsetHeight, k = z.k, mix = MIX[k].split(' '), out = ['', ''];
    function has(s) { return z.el.querySelector(s); }
    [0, 1].forEach(function (side) {
      var y = (side ? (has('.swim') ? 330 : has('.leviathan') ? 360 : 110) : k ? 110 : 150) + r() * 50;
      var end = H - (side && (has('.place') || k > 3) ? 250 : 140), i = side * (mix.length - 1), n = 0, it;
      for (; y < end; y += STEP[k] * (.8 + r() * .5), i++, n++) {
        it = make[side && k > 3 ? 'eyes' : mix[i % mix.length]](r, k, y - 40);   // one angler is plenty
        it[1].top = (y / H * 100).toFixed(1) + '%';
        it[1]['--x'] = r().toFixed(2);
        it[1]['--d'] = (r() * 2 - 1).toFixed(2);
        out[side] += '<div class="dr ' + it[0] + (n % 3 == 2 ? ' x' : '') + '" style="' + css(it[1]) + '">' + it[2] + '</div>';
      }
    });
    if (!z.sea) {
      z.sea = document.createElement('div');
      z.sea.className = 'sea' + (calm ? '' : ' live');
      z.sea.setAttribute('aria-hidden', 'true');
      z.el.insertBefore(z.sea, has('.wrap'));
    }
    if (eyeIO) [].forEach.call(z.sea.querySelectorAll('.eyes'), function (e) { eyeIO.unobserve(e); });
    z.sea.innerHTML = '<div class="sea-l">' + out[0] + '</div><div class="sea-r">' + out[1] + '</div>';
    z.anims = null; z.rate = 1;
    if (eyeIO) [].forEach.call(z.sea.querySelectorAll('.eyes'), function (e) { eyeIO.observe(e); });
  }
  zones.forEach(build);

  // Scroll speed, eased, in px per frame. The loop runs only while the water is still moving.
  var last = scrollY, lt = 0, v = 0, raf = 0;
  function frame(t) {
    raf = 0;
    var y = scrollY, dt = Math.min(Math.max(t - lt, 4), 50), d = (y - last) * 16.7 / dt;
    last = y; lt = t;
    v += (d - v) * .22;
    if (Math.abs(v) < .15 && !d) v = 0;
    var a = Math.min(Math.abs(v), 36), rate = 1 + Math.round(a / 3) / 4, mid = innerHeight / 2;
    var live = zones.filter(function (z) {
      if (!z.vis && z.hot) {   // scrolled out mid-rush: leave it calm for next time
        z.hot = 0;
        z.sea.classList.remove('fast');
        z.sea.style.setProperty('--v', 0);
        z.sea.style.setProperty('--a', 0);
        if (z.anims) z.anims.forEach(function (an) { an.playbackRate = 1; });
        z.rate = 1;
      }
      return z.vis;
    });
    var ps = live.map(function (z) { var b = z.el.getBoundingClientRect(); return Math.max(-70, Math.min(70, (b.top + b.height / 2 - mid) * .1)); });
    live.forEach(function (z, i) {
      var s = z.sea.style;
      s.setProperty('--p', ps[i].toFixed(1));
      s.setProperty('--v', Math.max(-36, Math.min(36, v)).toFixed(1));
      s.setProperty('--a', a.toFixed(1));
      z.sea.classList.toggle('fast', a > 12);
      z.hot = a;
      if (rate !== z.rate && z.sea.getAnimations) {
        z.rate = rate;
        z.anims = z.anims || z.sea.getAnimations({ subtree: true });
        z.anims.forEach(function (an) { an.playbackRate = rate; });
      }
    });
    if (v) kick();
  }
  function kick() { if (!calm && !raf) raf = requestAnimationFrame(frame); }
  function sync() { zones.forEach(function (z) { z.sea.classList.toggle('on', !!z.vis && !document.hidden); }); }

  // The lamp, or a narrower window, changes how tall a zone is: restock it.
  var ro = new ResizeObserver(function (es) {
    es.forEach(function (e) {
      var z = find(e.target);
      z.anims = null; z.rate = 1;
      if (Math.abs(z.el.offsetHeight - z.h) > 160) build(z);
    });
    kick();
  });
  zones.forEach(function (z) { ro.observe(z.el); });
  if (calm) return;

  var zoneIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { find(e.target).vis = e.isIntersecting; });
    sync(); kick();
  }, { rootMargin: '120px 0px' });
  zones.forEach(function (z) { zoneIO.observe(z.el); });
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', sync);
})();
