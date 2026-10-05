/* Você Sabia Rock: injeta header e player, guarda os dados e renderiza cada página */
'use strict';
const BASE = document.body.dataset.base || '';
const PAGE = document.body.dataset.page;
const $ = (s, r = document) => r.querySelector(s);

// Músicas reais via YouTube. "expect" e "etitle" são checados no navegador (oEmbed) antes de tocar.
// id: null = ID do vídeo oficial ainda não confirmado; o player mostra links oficiais no lugar.
const TRACKS = [
  { id: 'fJ9rUzIMcZQ', expect: 'queen', etitle: 'bohemian', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', year: 1975, hue: 350 },
  { id: 'hTWKbfoikeg', expect: 'nirvana', etitle: 'teen spirit', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', year: 1991, hue: 205 },
  { id: 'E0ozmU9cJDg', expect: 'metallica', etitle: 'master of puppets', title: 'Master of Puppets', artist: 'Metallica', album: 'Master of Puppets', year: 1986, hue: 20 },
  { id: null, title: 'Pais e Filhos', artist: 'Legião Urbana', album: 'As Quatro Estações', year: 1989, hue: 140 },
  { id: null, title: 'Alagados', artist: 'Os Paralamas do Sucesso', album: 'Selvagem?', year: 1986, hue: 48 }
];

const GENRES = {
  classico: { n: 'Rock Clássico', href: 'genero-classico.html', intro: 'Anos 60 e 70, grandes discos e biografias de quem escreveu a história do rock.' },
  metal: { n: 'Heavy Metal', href: 'genero-metal.html', intro: 'Heavy metal, thrash e subgêneros pesados: discos, bandas e lançamentos.' },
  nacional: { n: 'Rock Nacional', href: 'genero-nacional.html', intro: 'Da cena clássica ao underground atual: o rock feito no Brasil.' }
};

// Conteúdo editorial do portal (textos de demonstração baseados em fatos históricos)
const ARTICLES = [
  { id: 1, k: 'LZ', w: 'Led_Zeppelin', g: ['classico'], d: '2026-09-30', v: 5210,
    t: 'Led Zeppelin IV: o disco sem nome que fez de “Stairway to Heaven” uma lenda',
    s: 'Lançado em novembro de 1971, o quarto álbum saiu sem título e sem o nome da banda na capa, só com quatro símbolos.',
    p: [`Led Zeppelin IV chegou às lojas em 8 de novembro de 1971. Em vez de título, a capa trazia apenas quatro símbolos, um para cada integrante: Jimmy Page, Robert Plant, John Paul Jones e John Bonham. Foi a resposta do grupo às críticas da imprensa da época.`,
      `O disco reúne “Black Dog”, “Rock and Roll” e “When the Levee Breaks”, esta com a bateria de Bonham gravada no hall de uma casa de campo, o que deu à faixa o peso de ambiente que virou marca registrada. “Stairway to Heaven”, com mais de oito minutos, nunca saiu como single nos Estados Unidos e, mesmo assim, se tornou uma das músicas mais tocadas do rádio.`,
      `A banda voltou a um palco em 10 de dezembro de 2007, no show em homenagem a Ahmet Ertegun, na O2 Arena, em Londres, com Jason Bonham, filho de John, na bateria. O registro foi lançado como filme e álbum com o título “Celebration Day”.`] },
  { id: 2, k: 'PF', w: 'Pink_Floyd', g: ['classico'], d: '2026-09-28', v: 4380,
    t: 'The Dark Side of the Moon: o prisma de Pink Floyd que não sai das paradas',
    s: 'Gravado em Abbey Road e lançado em março de 1973, o álbum acumula mais de 900 semanas na parada Billboard 200.',
    p: [`Lançado em março de 1973, “The Dark Side of the Moon” trata de pressão, tempo, dinheiro e loucura, temas que o baixista Roger Waters transformou em letras. O disco foi gravado nos estúdios de Abbey Road, em Londres, com o engenheiro de som Alan Parsons.`,
      `A abertura com batimentos cardíacos e o loop de caixas registradoras em “Money”, num compasso 7/4, mostram como a banda usou o estúdio como instrumento. A capa, de Storm Thorgerson e do estúdio Hipgnosis, com o prisma que decompõe a luz, é uma das imagens mais reconhecidas da música.`,
      `Somadas, as semanas do álbum na Billboard 200 passam de 900, um recorde para um disco de rock. O sucesso abriu caminho para “Wish You Were Here” (1975) e “The Wall” (1979).`] },
  { id: 3, k: 'TB', w: 'The_Beatles', g: ['classico'], d: '2026-09-25', v: 3920,
    t: 'Now and Then: como a tecnologia devolveu a voz de John Lennon aos Beatles',
    s: 'Lançada em novembro de 2023, a canção foi anunciada como o último single inédito do quarteto.',
    p: [`“Now and Then” nasceu de uma gravação caseira em fita cassete que John Lennon fez no fim dos anos 1970. Uma tentativa de finalizá-la nos anos 1990 foi abandonada porque o piano abafava a voz.`,
      `Décadas depois, a equipe do diretor Peter Jackson usou aprendizado de máquina para separar a voz de Lennon do resto do áudio. Paul McCartney e Ringo Starr completaram a faixa, que também traz a guitarra de George Harrison gravada em 1995.`,
      `A canção chegou 54 anos depois de “Abbey Road” (1969), o último álbum gravado pelos quatro juntos, e fechou a discografia da banda.`] },
  { id: 4, k: 'MT', w: 'Metallica', g: ['metal'], d: '2026-09-29', v: 6040,
    t: 'Master of Puppets: o disco de 1986 que levou o thrash metal ao grande público',
    s: 'Gravado em Copenhague e lançado em março de 1986, foi o último álbum da Metallica com o baixista Cliff Burton.',
    p: [`“Master of Puppets” saiu em março de 1986 e foi gravado no estúdio Sweet Silence, em Copenhague, com o produtor Flemming Rasmussen. Faixas como “Battery”, a que dá nome ao disco e “Welcome Home (Sanitarium)” viraram clássicos do thrash metal.`,
      `O álbum recebeu certificação de platina nos Estados Unidos, algo raro para um disco tão pesado na época. Em 27 de setembro de 1986, durante a turnê, o ônibus da banda capotou na Suécia e Cliff Burton morreu.`,
      `A Metallica segue ativa: “72 Seasons”, o 11º álbum de estúdio, saiu em 14 de abril de 2023 pelo selo da própria banda, o Blackened Recordings.`] },
  { id: 5, k: 'IM', w: 'Iron_Maiden', g: ['metal'], d: '2026-09-26', v: 3510,
    t: 'The Number of the Beast: a estreia de Bruce Dickinson e o salto do Iron Maiden',
    s: 'Lançado em março de 1982, o terceiro disco do Maiden foi o primeiro com Dickinson nos vocais.',
    p: [`“The Number of the Beast” chegou em março de 1982 e trouxe “Run to the Hills”, “Hallowed Be Thy Name” e a faixa-título. Foi o primeiro disco com Bruce Dickinson, que substituiu Paul Di’Anno.`,
      `O álbum chegou ao primeiro lugar da parada britânica e consolidou Eddie, o mascote criado pelo artista Derek Riggs, como símbolo do heavy metal.`,
      `Quatro décadas depois, a banda ainda lança discos longos e ambiciosos: “Senjutsu”, o 17º álbum de estúdio, saiu em 2021.`] },
  { id: 6, k: 'MU', w: 'Legião_Urbana', g: ['nacional'], d: '2026-09-24', v: 3170,
    t: 'Dos Mutantes à Legião Urbana: as duas raízes do rock brasileiro',
    s: 'Do psicodelismo paulistano de 1966 ao rock de Brasília dos anos 80, duas gerações definiram o som e o texto do rock nacional.',
    p: [`Os Mutantes surgiram em São Paulo em 1966, com os irmãos Arnaldo Baptista e Sérgio Dias e a cantora Rita Lee. Participaram da Tropicália ao lado de Gilberto Gil e Caetano Veloso e misturaram guitarras experimentais com humor e música brasileira.`,
      `A Legião Urbana nasceu em Brasília em 1982, com Renato Russo, Dado Villa-Lobos e Marcelo Bonfá. O álbum de estreia saiu em 1985 e foi seguido por “Dois” (1986), que inclui “Faroeste Caboclo”, de mais de nove minutos.`,
      `Renato Russo morreu em 11 de outubro de 1996, mas as letras de “Que País É Este” e de tantas outras seguem sendo cantadas em shows e rodas de violão.`] },
  { id: 7, k: 'SP', w: 'Sepultura', g: ['nacional', 'metal'], d: '2026-09-22', v: 2860,
    t: 'Sepultura e “Roots”: quando o metal brasileiro foi buscar o tambor',
    s: 'Banda nascida em Belo Horizonte em 1984, o Sepultura misturou percussão indígena e brasileira ao metal em 1996.',
    p: [`O Sepultura foi formado em Belo Horizonte, em 1984, pelos irmãos Max e Igor Cavalera. A banda saiu do underground mineiro para os palcos do mundo e virou a mais conhecida do metal brasileiro.`,
      `Em “Roots” (1996), com produção de Ross Robinson, o grupo visitou a comunidade indígena Xavante, em Mato Grosso, e incorporou tambores e cantos ao som pesado. Carlinhos Brown participou da percussão em “Ratamahatta”.`,
      `Depois de quase quatro décadas de estrada, o Sepultura anunciou uma turnê de despedida dos palcos.`] },
  { id: 8, k: 'UG', g: ['nacional'], d: '2026-09-20', v: 2290,
    t: 'Underground brasileiro hoje: festivais, selos pequenos e a cena que vive de Bandcamp',
    s: 'Fora dos grandes palcos, bandas independentes do país inteiro gravam, lançam e fazem turnê por conta própria.',
    p: [`O rock independente brasileiro hoje se organiza em rede. Cidades como Belo Horizonte, Brasília, Porto Alegre, Recife e São Paulo mantêm casas pequenas, coletivos e festivais que dão palco para quem ainda não tem gravadora.`,
      `Muitas bandas gravam em home studio, lançam em plataformas como o Bandcamp e o YouTube e vendem fita, vinil e camiseta direto nos shows. Selos pequenos e fanzines cuidam da divulgação.`,
      `O resultado é uma cena diversa, que vai do punk ao stoner e do post-hardcore ao black metal, e que se sustenta mais na troca entre bandas do que em grandes contratos. (Texto ilustrativo para a demonstração do portal.)`] }
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dateLong = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const dateShort = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
const link = a => `${BASE}materia-detalhe.html?id=${a.id}`;
const card = a => `<a class="card" href="${link(a)}"><div class="cover c-${a.g[0]}"${a.w ? ` data-wiki="${a.w}"` : ''}>${a.k}</div><div class="card-b"><span class="kicker">${GENRES[a.g[0]].n}</span><h3>${esc(a.t)}</h3><p>${esc(a.s)}</p><small>${dateLong(a.d)}</small></div></a>`;
const app = html => { $('#app').innerHTML = html; };

/* ---------- Header e player (injeção modular) ---------- */
function injectHeader() {
  const admin = document.body.dataset.admin === 'true';
  const nav = admin
    ? [['admin/dashboard.html', 'Dashboard'], ['admin/materias.html', 'Matérias'], ['index.html', 'Ver portal']]
    : [['index.html', 'Home'], ['genero-classico.html', 'Rock Clássico'], ['genero-metal.html', 'Heavy Metal'], ['genero-nacional.html', 'Rock Nacional'], ['radios.html', 'Rádios e Podcasts']];
  const here = location.pathname.split('/').slice(-admin ? 2 : 1).join('/');
  const links = nav.map(([h, l]) => `<a href="${BASE}${h}"${h.endsWith(here) && here ? ' class="on"' : ''}>${l}</a>`).join('');
  $('#header-placeholder').innerHTML = `
  <header class="site-header">
    <div class="bar"><div class="wrap bar-in">
      <a class="logo" href="${BASE}index.html" aria-label="Você Sabia Rock, página inicial"><span>Você sabia</span><b>ROCK</b></a>
      <div class="bar-r"><a href="${BASE}login.html">Entrar</a><a href="${BASE}admin/dashboard.html">Painel</a><a class="pill" href="${BASE}cadastro.html">Cadastre-se</a></div>
      <button class="burger" aria-label="Abrir menu" aria-expanded="false">☰</button>
    </div></div>
    <nav class="subnav" aria-label="Seções"><div class="wrap">${links}</div></nav>
  </header>`;
  const b = $('.burger');
  b.addEventListener('click', () => { const o = $('.subnav').classList.toggle('open'); b.setAttribute('aria-expanded', o); });
}

function injectPlayer() {
  const ic = (n, d) => `<svg class="${n}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  $('#player-placeholder').innerHTML = `
  <footer class="player" aria-label="Player de música">
    <div class="rp-now"><div class="rp-cover" aria-hidden="true">♫</div><div><strong id="rp-title">Nenhuma faixa</strong><span id="rp-artist">Escolha uma música em “Ouça”</span><span id="rp-links"></span></div></div>
    <div class="rp-mid">
      <div class="rp-btns">
        <button class="rp-btn" id="rp-prev" aria-label="Faixa anterior">${ic('', 'M6 5h2v14H6zM20 5v14L9 12z')}</button>
        <button class="rp-btn rp-play" id="rp-play" aria-label="Tocar ou pausar">${ic('i-play', 'M8 5v14l11-7z')}${ic('i-pause', 'M7 5h4v14H7zM13 5h4v14h-4z')}</button>
        <button class="rp-btn" id="rp-next" aria-label="Próxima faixa">${ic('', 'M16 5h2v14h-2zM4 5l11 7-11 7z')}</button>
      </div>
      <div class="rp-bar"><span id="rp-cur">0:00</span><input type="range" id="rp-seek" min="0" max="1000" value="0" aria-label="Progresso da faixa"><span id="rp-dur">0:00</span></div>
    </div>
    <div class="rp-vol">
      <button class="rp-btn rp-mute" id="rp-mute" aria-label="Silenciar">${ic('i-vol', 'M3 9v6h4l5 5V4L7 9zM16 8.5a4.5 4.5 0 0 1 0 7M16 3a9 9 0 0 1 0 18')}${ic('i-mute', 'M3 9v6h4l5 5V4L7 9zM16 9l5 6M21 9l-5 6')}</button>
      <input type="range" id="rp-vol" min="0" max="100" value="80" aria-label="Volume">
    </div>
  </footer>
  <div class="rp-video" id="rp-video" hidden><div id="rp-yt"></div><button id="rp-close" aria-label="Fechar vídeo">×</button></div>`;
}

/* ---------- Páginas ---------- */
const R = {};

R.home = async () => {
  let n = { itens: [], manchetes: [] };
  try { n = await (await fetch(BASE + 'noticias.json')).json(); } catch { /* sem JSON a seção fica vazia */ }
  const story = (i, k) => `<a class="story s${k}" data-rv href="${i.url}" target="_blank" rel="noopener">
    <span class="cat">${esc(i.categoria)}</span><h3>${esc(i.titulo)}</h3><p>${esc(i.resumo)}</p>
    <span class="mono">${esc(i.fonte)} · ${dateLong(i.data)} ↗</span></a>`;
  const heads = n.manchetes.map(m => `<li><a href="${m.url}" target="_blank" rel="noopener">${esc(m.titulo)}</a><small>${esc(m.fonte)} · data na fonte ↗</small></li>`).join('');
  const trk = TRACKS.map((t, i) => `<li class="trk" data-i="${i}" data-rv><button class="trk-b" data-play="${i}" aria-label="Tocar ${esc(t.title)}">
    <span class="num mono">${String(i + 1).padStart(2, '0')}</span>
    <span class="trk-t"><b>${esc(t.title)}</b><i>${esc(t.artist)}</i></span>
    <span class="trk-d mono">${esc(t.album)} · ${t.year}<br><span class="dur">--:--</span></span>
    <span class="trk-bar"><i></i></span><span class="play"></span></button></li>`).join('');
  app(`<section class="manifesto">
      <p class="mono">Revista · Notícias · Música</p>
      <h1><span>Rock</span><span>não é apenas música.</span><em>É história.</em></h1>
      <a class="go" href="#ouca">Explorar</a></section>
    <section class="destaque" data-rv><span class="mono">Destaque</span><div class="d-n" aria-hidden="true">75</div>
      <div class="d-i"><h2>Queen</h2><p class="d-a">A Night at the Opera</p><p class="mono">1975 · Rock</p>
      <button class="btn" data-play="0">Ouvir Bohemian Rhapsody</button></div></section>
    <section class="paper"><div class="paper-in">
      <div class="mag-h"><h2>Agora no rock</h2><span class="mono">Notícias reais · links para a fonte</span></div>
      <div class="mag-grid">${n.itens.map(story).join('')}</div>
      ${heads ? `<ul class="heads">${heads}</ul>` : ''}</div></section>
    <section class="ouca" id="ouca"><div class="mag-h" style="border-color:var(--red)"><h2>Ouça</h2><span class="mono">Vídeos oficiais no YouTube</span></div>
      <ul class="trks">${trk}</ul></section>`);
  $('#app').addEventListener('click', e => {
    const b = e.target.closest('[data-play]');
    if (b && window.RockPlayer) window.RockPlayer.playIndex(+b.dataset.play);
  });
  reveal();
  if (window.RockPlayer) window.RockPlayer.mark();
};

/* Elementos com data-rv aparecem suavemente ao rolar a página */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('[data-rv]').forEach(x => io.observe(x));
}

R.feed = () => {
  const key = document.body.dataset.genre, g = GENRES[key];
  const list = ARTICLES.filter(a => a.g.includes(key));
  const aside = key === 'metal'
    ? `<aside class="side"><h2>Lançamentos para ouvir</h2><ol>
        <li><a href="${BASE}materia-detalhe.html?id=4">Metallica, “72 Seasons” (2023)</a></li>
        <li><a href="${BASE}materia-detalhe.html?id=5">Iron Maiden, “Senjutsu” (2021)</a></li></ol></aside>`
    : `<aside class="side"><h2>Mais lidas</h2><ol>${[...list].sort((a, b) => b.v - a.v).map((a, i) => `<li><b>${i + 1}</b><a href="${link(a)}">${esc(a.t)}</a></li>`).join('')}</ol></aside>`;
  app(`<h1 class="page-h">${g.n}</h1><p class="mut" style="margin:8px 0 24px">${g.intro}</p>
    <div class="feed"><div class="grid">${list.map(card).join('')}</div>${aside}</div>`);
  document.title = `${g.n} | Você Sabia Rock`;
  loadPhotos();
};

R.detail = () => {
  const id = +new URLSearchParams(location.search).get('id') || 1;
  const a = ARTICLES.find(x => x.id === id) || ARTICLES[0];
  const rel = ARTICLES.filter(x => x !== a && x.g[0] === a.g[0]).slice(0, 2);
  const seed = [['Marina S.', 'Esse disco é perfeito do começo ao fim. Obrigada pelo texto!'], ['Carlos R.', 'Boa matéria. Faltou falar da turnê, mas o resumo está ótimo.'], ['Bia', 'Já coloquei para tocar no player aqui embaixo.']];
  app(`<article class="article">
    <span class="kicker">${GENRES[a.g[0]].n}</span><h1>${esc(a.t)}</h1><p class="lead">${esc(a.s)}</p>
    <p class="meta">Por Redação Você Sabia Rock · ${dateLong(a.d)}</p>
    <div class="cover c-${a.g[0]}"${a.w ? ` data-wiki="${a.w}"` : ''}>${a.k}</div>
    ${a.p.map(t => `<p class="body">${esc(t)}</p>`).join('')}
    <section class="comments" aria-labelledby="ch"><h2 id="ch">Comentários (<span id="cm-n">${seed.length}</span>)</h2>
      <div id="cm-list"></div>
      <form class="cm-form" id="cm-form" novalidate>
        <input name="nome" placeholder="Seu nome" aria-label="Seu nome"><p class="err" data-for="nome"></p>
        <textarea name="texto" rows="3" placeholder="Escreva seu comentário" aria-label="Comentário"></textarea><p class="err" data-for="texto"></p>
        <button class="btn btn-sm" type="submit">Comentar</button>
      </form></section>
    ${rel.length ? `<div class="sec-h"><h2>Leia também</h2></div><div class="grid">${rel.map(card).join('')}</div>` : ''}
  </article>`);
  document.title = `${a.t} | Você Sabia Rock`;
  loadPhotos();
  const add = (n, t, when = 'agora') => {
    const d = document.createElement('div'); d.className = 'cm';
    const b = document.createElement('b'); b.textContent = n;
    const p = document.createElement('p'); p.textContent = t;
    const s = document.createElement('small'); s.textContent = when;
    d.append(b, p, s); $('#cm-list').append(d); $('#cm-n').textContent = $('#cm-list').children.length;
  };
  seed.forEach(([n, t]) => add(n, t, 'há 2 dias'));
  initForm($('#cm-form'), {
    nome: v => (v.trim().length < 2 ? 'Informe seu nome.' : ''),
    texto: v => (v.trim().length < 3 ? 'Escreva pelo menos 3 caracteres.' : '')
  }, f => { add(f.nome.value.trim(), f.texto.value.trim()); f.reset(); });
};

R.radios = () => {
  const items = [
    ['Rádio', 'Rock Clássico FM', 'Zeppelin, Floyd, Beatles e outros nomes dos anos 60 e 70, 24 horas.', 'classico', 'RC', 0],
    ['Rádio', 'Metal Pesado 24h', 'Thrash, heavy e subgêneros pesados sem parar.', 'metal', 'MP', 1],
    ['Rádio', 'Rock Nacional ao Vivo', 'De Legião Urbana ao underground de hoje.', 'nacional', 'RN', 2],
    ['Podcast', 'Riff Cast', 'Conversas semanais sobre guitarristas e riffs que mudaram o rock.', 'classico', 'RF', 3],
    ['Podcast', 'Bastidores do Palco', 'Histórias de turnê, estrada e estúdio contadas por quem viveu.', 'metal', 'BP', 4],
    ['Podcast', 'Lado B Brasil', 'Bandas independentes e a cena underground brasileira.', 'nacional', 'LB', 0]
  ];
  app(`<h1 class="page-h">Rádios e Podcasts</h1>
    <p class="mut" style="margin:8px 0 24px">Estações e programas simulados. Cada botão toca uma faixa no player fixo da página.</p>
    <div class="grid">${items.map(([t, n, d, g, k, i]) => `<div class="radio"><div class="cover c-${g}">${k}</div>
      <div><span class="kicker">${t}</span><h3>${n}</h3><p class="mut">${d}</p></div>
      <button class="btn btn-green btn-sm" data-play="${i}" aria-label="Ouvir ${n}">Ouvir</button></div>`).join('')}</div>`);
  $('#app').addEventListener('click', e => {
    const b = e.target.closest('[data-play]');
    if (b && window.RockPlayer) window.RockPlayer.playIndex(+b.dataset.play);
  });
};

R.dash = () => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], vis = [1240, 1580, 1420, 1910, 2230, 2780, 2410];
  const total = vis.reduce((a, b) => a + b, 0), max = Math.max(...vis), n = v => v.toLocaleString('pt-BR');
  const byG = {}; ARTICLES.forEach(a => { byG[a.g[0]] = (byG[a.g[0]] || 0) + a.v; });
  const gs = Object.values(byG).reduce((a, b) => a + b, 0), col = { classico: '#d99a1f', metal: '#c4170c', nacional: '#1db954' };
  let acc = 0;
  const stops = Object.entries(byG).map(([k, v]) => { const s = (acc / gs) * 100; acc += v; return `${col[k]} ${s}% ${(acc / gs) * 100}%`; }).join(',');
  const top = [...ARTICLES].sort((a, b) => b.v - a.v);
  app(`<div class="admin-h"><h1 class="page-h" style="margin:0">Dashboard</h1><a class="btn btn-ghost btn-sm" href="materias.html">Gerenciar matérias</a></div>
    <p class="mut" style="margin:8px 0">Dados simulados para demonstração.</p>
    <div class="stats">
      <div class="stat"><b>${n(total)}</b><span>Acessos nos últimos 7 dias</span></div>
      <div class="stat"><b>${ARTICLES.length}</b><span>Matérias publicadas</span></div>
      <div class="stat"><b>3min12s</b><span>Tempo médio de leitura</span></div>
      <div class="stat"><b>${n(top[0].v)}</b><span>Leituras da mais lida</span></div>
    </div>
    <div class="panels">
      <section class="panel"><h2>Acessos por dia</h2><div class="bars" role="img" aria-label="Gráfico de acessos por dia">
        ${vis.map((v, i) => `<div class="col"><b>${n(v)}</b><i style="height:${(v / max) * 80}%"></i>${days[i]}</div>`).join('')}</div></section>
      <section class="panel"><h2>Leituras por gênero</h2><div class="donut" style="background:conic-gradient(${stops})" role="img" aria-label="Gráfico de leituras por gênero"></div>
        <ul class="legend">${Object.keys(byG).map(k => `<li><i style="background:${col[k]}"></i>${GENRES[k].n}: ${n(byG[k])}</li>`).join('')}</ul></section>
    </div>
    <div class="tbl-wrap"><table><thead><tr><th>Matéria mais lida</th><th>Gênero</th><th>Leituras</th></tr></thead>
      <tbody>${top.slice(0, 5).map(a => `<tr><td>${esc(a.t)}</td><td>${GENRES[a.g[0]].n}</td><td>${n(a.v)}</td></tr>`).join('')}</tbody></table></div>`);
};

R.posts = () => {
  const rows = ARTICLES.map(a => `<tr data-id="${a.id}"><td class="t">${esc(a.t)}</td><td>${GENRES[a.g[0]].n}</td><td>${dateShort(a.d)}</td>
    <td><div class="acts"><button class="btn btn-ghost btn-sm" data-act="edit">Editar</button><button class="btn btn-danger btn-sm" data-act="del">Excluir</button></div></td></tr>`).join('');
  app(`<div class="admin-h"><h1 class="page-h" style="margin:0">Matérias</h1><span class="mut" id="count">${ARTICLES.length} matérias cadastradas</span></div>
    <p class="mut" style="margin:8px 0">Editar e excluir apenas alteram a tabela nesta demonstração. Recarregue para restaurar.</p>
    <div class="tbl-wrap"><table><thead><tr><th>Título</th><th>Gênero</th><th>Data de publicação</th><th>Ações</th></tr></thead><tbody id="tb">${rows}</tbody></table></div>`);
  $('#tb').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const tr = b.closest('tr'), cell = $('.t', tr);
    if (b.dataset.act === 'edit') {
      const novo = prompt('Novo título da matéria:', cell.textContent);
      if (novo && novo.trim()) cell.textContent = novo.trim();
    } else if (confirm(`Excluir a matéria “${cell.textContent}”?`)) {
      tr.remove();
      const c = $('#tb').children.length; $('#count').textContent = `${c} ${c === 1 ? 'matéria cadastrada' : 'matérias cadastradas'}`;
    }
  });
};

/* ---------- Fotos reais ----------
   Pega a imagem principal da página da banda na Wikipédia, mas SÓ usa se o arquivo estiver no
   Wikimedia Commons (imagens livres). Depois busca autor e licença para mostrar o crédito.
   Se não houver foto livre, a capa continua com as iniciais (nada é inventado). */
async function getPhoto(title) {
  const key = 'foto:' + title;
  try { const c = sessionStorage.getItem(key); if (c) return JSON.parse(c); } catch { /* sem cache */ }
  let photo = null;
  try {
    const d = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)).json();
    const orig = d.originalimage && d.originalimage.source;
    const thumb = d.thumbnail && d.thumbnail.source;
    const ref = orig || thumb || '';
    if (ref.includes('/wikipedia/commons/')) {
      const parts = ref.split('/');
      const file = decodeURIComponent(orig ? parts.pop() : parts[parts.length - 2]);
      photo = { src: thumb ? thumb.replace(/\/\d+px-/, '/960px-') : orig, autor: '', licenca: '',
        pagina: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file) };
      try {
        const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent('File:' + file)}`;
        const meta = Object.values((await (await fetch(u)).json()).query.pages)[0].imageinfo[0].extmetadata;
        const txt = h => new DOMParser().parseFromString(h || '', 'text/html').body.textContent.trim();
        photo.autor = txt(meta.Artist && meta.Artist.value).slice(0, 40);
        photo.licenca = txt(meta.LicenseShortName && meta.LicenseShortName.value);
      } catch { /* mantém só o link do arquivo */ }
    }
  } catch { /* sem rede: fica o fundo com iniciais */ }
  try { sessionStorage.setItem(key, JSON.stringify(photo)); } catch { /* sem cache */ }
  return photo;
}

async function loadPhotos() {
  const titles = [...new Set([...document.querySelectorAll('[data-wiki]')].map(e => e.dataset.wiki))];
  for (const t of titles) {
    const p = await getPhoto(t);
    if (!p) continue;
    document.querySelectorAll('[data-wiki]').forEach(c => {
      if (c.dataset.wiki !== t) return;
      c.style.backgroundImage = `url("${p.src}")`;
      c.classList.add('has-photo');
      const cr = document.createElement('small');
      cr.className = 'credit';
      const texto = ['Foto', p.autor, p.licenca, 'Wikimedia Commons'].filter(Boolean).join(' · ');
      if (c.closest('a')) cr.textContent = texto;          // dentro de card: só texto
      else { const l = document.createElement('a'); l.href = p.pagina; l.target = '_blank'; l.rel = 'noopener'; l.textContent = texto; cr.append(l); }
      c.append(cr);
    });
  }
}

/* ---------- Formulários com validação ---------- */
function initForm(form, rules, onOk) {
  const check = name => {
    const f = form.elements[name], m = rules[name](f.type === 'checkbox' ? f.checked : f.value, form);
    const out = $(`[data-for="${name}"]`, form);
    if (out) out.textContent = m;
    f.setAttribute('aria-invalid', m ? 'true' : 'false');
    return !m;
  };
  Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => check(n)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(rules).filter(n => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    onOk(form);
  });
}
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

R.login = () => initForm($('#login-form'), {
  email: v => (emailOk(v) ? '' : 'Informe um e-mail válido.'),
  senha: v => (v.length >= 6 ? '' : 'A senha precisa ter pelo menos 6 caracteres.')
}, f => {
  $('.form-msg', f).textContent = 'Login realizado. Abrindo o painel…';
  setTimeout(() => { location.href = 'admin/dashboard.html'; }, 700);
});

R.signup = () => initForm($('#signup-form'), {
  nome: v => (v.trim().length >= 3 ? '' : 'Informe seu nome completo.'),
  email: v => (emailOk(v) ? '' : 'Informe um e-mail válido.'),
  senha: v => (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Use 8 ou mais caracteres, com letras e números.'),
  confirma: (v, f) => (v === f.elements.senha.value && v ? '' : 'As senhas não são iguais.'),
  termos: v => (v ? '' : 'Aceite os termos para continuar.')
}, f => {
  f.innerHTML = `<h1>Cadastro concluído</h1><p class="form-msg">Bem-vindo(a) ao Você Sabia Rock, ${esc(f.nome.value.trim().split(' ')[0])}!</p><a class="btn" href="index.html">Ir para a home</a>`;
});

/* ---------- Navegação sem recarregar: troca só o <main>, o player fica intacto ---------- */
const dirOf = p => p.slice(0, p.lastIndexOf('/'));
function initRouter() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !u.pathname.endsWith('.html')) return;
    if (u.pathname === location.pathname && u.hash) return;      // âncora na mesma página
    if (dirOf(u.pathname) !== dirOf(location.pathname)) return;  // site <-> admin: recarrega
    e.preventDefault();
    go(u.href);
  });
  addEventListener('popstate', () => go(location.href, false));
}
async function go(url, push = true) {
  try {
    const doc = new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
    const next = doc.querySelector('main');
    if (!next) throw new Error('sem main');
    const cur = $('main');
    cur.classList.add('leaving');
    await new Promise(r => setTimeout(r, 160));
    cur.replaceWith(next);
    document.title = doc.title;
    document.body.dataset.page = doc.body.dataset.page;
    if (doc.body.dataset.genre) document.body.dataset.genre = doc.body.dataset.genre; else delete document.body.dataset.genre;
    if (push) history.pushState(null, '', url);
    scrollTo(0, 0);
    injectHeader();
    const render = R[document.body.dataset.page];
    if (render) render();
  } catch { location.href = url; }
}

/* ---------- Início ---------- */
document.head.insertAdjacentHTML('beforeend', '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap">');
injectHeader();
injectPlayer();
initRouter();
const firstRender = R[document.body.dataset.page];
if (firstRender) firstRender();
