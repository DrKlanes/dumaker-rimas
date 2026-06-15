/* ============================================================================
   HORRIPILANTES RIMAS — comportamiento
   1) Carga diferida de YouTube (facade): el reproductor NO se inserta hasta
      que el usuario hace clic. Hasta entonces los embeds pesan cero.
   2) Aparición suave de bloques al hacer scroll (respeta prefers-reduced-motion).
   ========================================================================== */
(function () {
  'use strict';

  /* ----- 1. Facade de YouTube ------------------------------------------- */
  function buildPlayer(id) {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = 'Reproductor de vídeo de YouTube';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'eager';
    return iframe;
  }

  function activate(el) {
    var id = el.getAttribute('data-yt');
    if (!id) return;
    var holder = document.createElement('div');
    holder.className = 'video video--playing';
    holder.appendChild(buildPlayer(id));
    el.replaceWith(holder);
    var frame = holder.querySelector('iframe');
    if (frame) frame.focus();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('.video[data-yt]') : null;
    if (el) { e.preventDefault(); activate(el); }
  });

  /* ----- 2. Aparición al hacer scroll (solo si se acepta movimiento) ----- */
  var motionOK = !window.matchMedia ||
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  if (motionOK && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
