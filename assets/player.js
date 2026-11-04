// post pages: the board viewer and the audio/video players.
// without this file the tiles still work as plain links.
(function () {
  var playing = [];

  function time(s) {
    if (!isFinite(s)) return '0:00';
    s = Math.floor(s);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  // swap the browser's player for a plain one that matches the site
  function enhance(media) {
    var item = media.closest('.item') || media.parentNode;
    var labelEl = item.querySelector('.label');
    var label = labelEl ? labelEl.textContent : '';
    if (labelEl) labelEl.remove();

    var isVideo = media.tagName === 'VIDEO';
    media.removeAttribute('controls');

    var ctl = document.createElement('div');
    ctl.className = 'ctl';
    ctl.innerHTML =
      '<div class="row">' +
        '<button type="button" class="pp">(play)</button>' +
        '<span class="name"></span>' +
        '<span class="time">0:00</span>' +
        (isVideo ? '<button type="button" class="fs">(full screen)</button>' : '') +
      '</div>' +
      '<input class="bar" type="range" min="0" max="1000" value="0" step="1">';
    ctl.querySelector('.name').textContent = label;
    media.insertAdjacentElement('afterend', ctl);

    var pp = ctl.querySelector('.pp');
    var bar = ctl.querySelector('.bar');
    var clock = ctl.querySelector('.time');
    var dragging = false;
    bar.setAttribute('aria-label', 'seek ' + label);

    function draw() {
      var d = media.duration, t = media.currentTime;
      if (!dragging) bar.value = d ? Math.round(t / d * 1000) : 0;
      bar.style.setProperty('--p', (bar.value / 10) + '%');
      clock.textContent = time(t) + ' / ' + time(d);
    }
    function toggle() {
      if (media.paused) {
        playing.forEach(function (m) { if (m !== media) m.pause(); });
        media.play();
      } else media.pause();
    }

    pp.addEventListener('click', toggle);
    if (isVideo) {
      media.addEventListener('click', toggle);
      ctl.querySelector('.fs').addEventListener('click', function () {
        if (media.requestFullscreen) media.requestFullscreen();
        else if (media.webkitEnterFullscreen) media.webkitEnterFullscreen();
      });
    }
    media.addEventListener('play', function () { pp.textContent = '(pause)'; item.classList.add('on'); });
    media.addEventListener('pause', function () { pp.textContent = '(play)'; item.classList.remove('on'); });
    media.addEventListener('ended', function () { media.currentTime = 0; draw(); });
    ['timeupdate', 'loadedmetadata', 'durationchange'].forEach(function (e) { media.addEventListener(e, draw); });
    bar.addEventListener('input', function () {
      dragging = true;
      bar.style.setProperty('--p', (bar.value / 10) + '%');
      if (media.duration) clock.textContent = time(bar.value / 1000 * media.duration) + ' / ' + time(media.duration);
    });
    bar.addEventListener('change', function () {
      if (media.duration) media.currentTime = bar.value / 1000 * media.duration;
      dragging = false;
      draw();
    });

    playing.push(media);
    item.classList.add('custom');
    draw();
    return media;
  }

  // the viewer: click a tile and it opens big, arrows flick through
  var tiles = [].slice.call(document.querySelectorAll('.board .tile:not([data-direct])'));
  if (!tiles.length) return;

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'media viewer');
  lb.innerHTML =
    '<div class="lb-bar"><span class="lb-count"></span><span><a class="lb-open" target="_blank" rel="noopener">(open in new tab)</a> <button type="button" class="lb-close">(close)</button></span></div>' +
    '<div class="lb-stage"></div>' +
    '<div class="lb-bar lb-nav"><button type="button" class="lb-prev">(prev)</button><button type="button" class="lb-next">(next)</button></div>';
  document.body.appendChild(lb);

  var stage = lb.querySelector('.lb-stage');
  var count = lb.querySelector('.lb-count');
  var openLink = lb.querySelector('.lb-open');
  var closeBtn = lb.querySelector('.lb-close');
  var cur = 0, back = null;

  if (tiles.length < 2) lb.querySelector('.lb-nav').style.visibility = 'hidden';

  function show(i) {
    cur = (i + tiles.length) % tiles.length;
    var tile = tiles[cur];
    stage.innerHTML = '';
    var box = document.createElement('div');
    box.className = 'lb-content ' + (tile.dataset.kind || '');
    box.appendChild(tile.querySelector('template').content.cloneNode(true));
    stage.appendChild(box);
    var first = null;
    box.querySelectorAll('audio, video').forEach(function (m) { var e = enhance(m); if (!first) first = e; });
    if (first) { var p = first.play(); if (p && p.catch) p.catch(function () {}); }
    count.textContent = (cur + 1) + ' / ' + tiles.length;
    var href = tile.getAttribute('href');
    var canOpen = href && href !== '#' && (tile.dataset.kind === 'pdf' || tile.dataset.kind === 'image');
    openLink.hidden = !canOpen;
    if (canOpen) openLink.href = href;
  }
  function open(i) {
    back = document.activeElement;
    lb.hidden = false;
    document.documentElement.classList.add('lb-open');
    show(i);
    closeBtn.focus();
  }
  function close() {
    stage.innerHTML = '';
    lb.hidden = true;
    document.documentElement.classList.remove('lb-open');
    if (back) back.focus();
  }

  // phones can't show pdfs inside a page properly, so there they just open in a new tab
  var phone = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (phone && t.dataset.kind === 'pdf') { t.target = '_blank'; t.rel = 'noopener'; return; }
      e.preventDefault();
      open(i);
    });
  });
  closeBtn.addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
  stage.addEventListener('click', function (e) { if (e.target === stage) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.target.tagName === 'INPUT') return;
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'ArrowLeft') show(cur - 1);
  });
})();
