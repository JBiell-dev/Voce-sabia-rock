/* Player fixo com músicas reais via YouTube IFrame API (embed oficial, sem baixar áudio).
   TRACKS vem do main.js. O player fica fora do <main>, então continua tocando ao navegar. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const el = { play: $('rp-play'), prev: $('rp-prev'), next: $('rp-next'), seek: $('rp-seek'), cur: $('rp-cur'),
    dur: $('rp-dur'), vol: $('rp-vol'), mute: $('rp-mute'), title: $('rp-title'), artist: $('rp-artist'),
    links: $('rp-links'), video: $('rp-video'), close: $('rp-close') };
  if (!el.play) return;
  if (location.protocol === 'file:') el.artist.textContent = 'Abra pelo Live Server (endereço http://) para tocar os vídeos';

  const fmt = s => (isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
  const fill = (input, pct) => input.style.setProperty('--p', `${pct}%`);
  let yt = null, ready = false, idx = -1, wanted = null, timer = null, scrubbing = false;

  // Carrega a API oficial do YouTube
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.append(tag);
  window.onYouTubeIframeAPIReady = () => {
    yt = new YT.Player('rp-yt', {
      width: '100%', height: '100%', playerVars: { playsinline: 1, rel: 0 },
      events: {
        onReady: () => { ready = true; yt.setVolume(+el.vol.value); if (wanted !== null) { start(wanted); wanted = null; } },
        onStateChange: onState,
        onError: () => { if (idx < 0) return; message(location.protocol === 'file:' ? 'Abra pelo Live Server (http://) para tocar.' : 'Este vídeo não permite reprodução aqui. Use os links oficiais.', TRACKS[idx]); }
      }
    });
  };

  // Confere no YouTube (oEmbed) se o ID é mesmo o vídeo oficial esperado
  async function verify(t) {
    try {
      const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + t.id)}`);
      const d = await r.json();
      return d.author_name.toLowerCase().includes(t.expect) && d.title.toLowerCase().includes(t.etitle);
    } catch { return false; }
  }

  function links(t) {
    const q = encodeURIComponent(`${t.artist} ${t.title}`);
    el.links.innerHTML = `<a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">YouTube</a>
      <a href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener">Spotify</a>`;
  }
  function message(text, t) { el.artist.textContent = text; if (t) links(t); el.play.classList.remove('playing'); }

  function meta(t) {
    el.title.textContent = t.title;
    el.artist.textContent = `${t.artist} · ${t.album} (${t.year})`;
    el.links.innerHTML = '';
    document.body.style.setProperty('--tint', `hsl(${t.hue} 70% 28%)`);
    el.seek.value = 0; fill(el.seek, 0); el.cur.textContent = '0:00'; el.dur.textContent = '0:00';
  }

  async function start(i) {
    idx = i;
    const t = TRACKS[i];
    meta(t); mark();
    if (!t.id) return message('ID do vídeo oficial pendente. Ouça pelos links:', t);
    if (t.ok === undefined) t.ok = await verify(t);
    if (!t.ok) return message('Não consegui confirmar o vídeo oficial. Ouça pelos links:', t);
    if (!ready) { wanted = i; return; }
    el.video.hidden = false;
    yt.loadVideoById(t.id);
  }

  function onState(e) {
    if (e.data === YT.PlayerState.PLAYING) { el.play.classList.add('playing'); clearInterval(timer); timer = setInterval(tick, 250); }
    else if (e.data === YT.PlayerState.PAUSED) el.play.classList.remove('playing');
    else if (e.data === YT.PlayerState.ENDED) { el.play.classList.remove('playing'); step(1); }
  }

  // Atualiza barra, tempos e a linha da música na página
  function tick() {
    const d = yt.getDuration(), c = yt.getCurrentTime(), pct = d ? (c / d) * 100 : 0;
    if (!scrubbing) { el.seek.value = pct * 10; fill(el.seek, pct); el.cur.textContent = fmt(c); }
    el.dur.textContent = fmt(d);
    const row = document.querySelector(`.trk[data-i="${idx}"]`);
    if (row) { row.querySelector('.trk-bar i').style.width = pct + '%'; row.querySelector('.dur').textContent = `${fmt(c)} / ${fmt(d)}`; }
  }
  function mark() { document.querySelectorAll('.trk').forEach(r => r.classList.toggle('on', +r.dataset.i === idx)); }

  // Próxima/anterior pulando faixas sem vídeo confirmado
  function step(dir) {
    const n = TRACKS.length;
    for (let k = 1; k <= n; k++) {
      const j = (((idx < 0 ? 0 : idx) + dir * k) % n + n) % n;
      if (TRACKS[j].id && TRACKS[j].ok !== false) return start(j);
    }
  }

  el.play.addEventListener('click', () => {
    if (idx < 0) return start(0);
    if (!ready) return;
    yt.getPlayerState() === YT.PlayerState.PLAYING ? yt.pauseVideo() : yt.playVideo();
  });
  el.next.addEventListener('click', () => step(1));
  el.prev.addEventListener('click', () => step(-1));
  el.seek.addEventListener('input', () => { scrubbing = true; fill(el.seek, el.seek.value / 10); });
  el.seek.addEventListener('change', () => { if (ready && yt.getDuration()) yt.seekTo((el.seek.value / 1000) * yt.getDuration(), true); scrubbing = false; });
  el.vol.addEventListener('input', () => { fill(el.vol, el.vol.value); if (ready) { yt.unMute(); yt.setVolume(+el.vol.value); } el.mute.classList.remove('muted'); });
  el.mute.addEventListener('click', () => { if (!ready) return; const m = yt.isMuted(); m ? yt.unMute() : yt.mute(); el.mute.classList.toggle('muted', !m); });
  el.close.addEventListener('click', () => { if (ready) yt.stopVideo(); el.video.hidden = true; el.play.classList.remove('playing'); });

  fill(el.vol, el.vol.value);
  window.RockPlayer = { playIndex: start, mark };
})();
