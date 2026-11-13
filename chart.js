// Depth gauge: rides the sounding line and reads the depth at the middle of the screen,
// interpolated between the data-depth of each zone.
(function () {
  var zones = [].slice.call(document.querySelectorAll('[data-depth]'));
  var gauge = document.createElement('div');
  gauge.className = 'gauge';
  gauge.setAttribute('aria-hidden', 'true');
  document.body.appendChild(gauge);
  var queued = false;
  function read() {
    queued = false;
    var y = scrollY + innerHeight / 2, depth = 0;
    var pts = zones.map(function (z) { return { y: z.getBoundingClientRect().top + scrollY, d: +z.dataset.depth }; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) {
      depth = pts[pts.length - 1].d;
    } else {
      for (var i = 0; i < pts.length; i++) {
        if (y < pts[i].y) {
          var a = pts[i - 1] || { y: 0, d: 0 }, b = pts[i];
          depth = a.d + (b.d - a.d) * Math.max(0, (y - a.y) / (b.y - a.y));
          break;
        }
        depth = pts[i].d;
      }
    }
    gauge.textContent = Math.round(depth) + ' m';
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(read); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  var lamp = document.querySelector('.lamp');
  if (lamp) lamp.addEventListener('toggle', queue);
  read();

  var up = document.querySelector('.up');
  if (up) up.addEventListener('click', function (e) {
    e.preventDefault();
    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });
})();
