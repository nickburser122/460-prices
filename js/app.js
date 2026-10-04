(() => {
  const E = window.Engine;
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CHEV = '<svg class="dd-chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>';
  const TICK = '<svg class="dd-tick" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5l4 4 8-8"/></svg>';

  const store = {
    get(k, d) { try { const v = localStorage.getItem('daleel.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('daleel.' + k, JSON.stringify(v)); } catch (e) {} }
  };

  const params = new URLSearchParams(location.search);
  const state = {
    lang: params.get('lang') || store.get('lang', (navigator.language || '').startsWith('ar') ? 'ar' : 'en'),
    q: params.get('q') || '',
    tier: params.get('tier') || store.get('tier', 'cash'),
    src: params.get('src') || 'all', section: params.get('sec') || 'all', conf: params.get('conf') || 'all', sort: params.get('sort') || 'rel',
    min: '', max: '', grade: 'all', priced: false,
    est: store.get('est', []), estAdmin: store.get('estAdmin', true), estDoctor: false,
    shown: 0, results: [], ready: false
  };
  if (!E.TIER[state.tier]) state.tier = 'cash';
  if (!['en', 'ar'].includes(state.lang)) state.lang = 'en';
  const PAGE = 40;
  let t = window.I18N[state.lang];

  const confClass = c => c >= 0.9 ? 'h' : c >= 0.6 ? 'm' : 'l';
  const confLabel = c => c >= 0.9 ? t.confH : c >= 0.6 ? t.confM : t.confL;
  const confPill = c => `<span class="conf ${confClass(c)}" title="${Math.round(c * 100)}% ${esc(t.conf)}"><i></i>${esc(confLabel(c))} ${Math.round(c * 100)}%</span>`;
  const ruleTitle = id => { const r = E.RULES[id]; return r ? (state.lang === 'ar' ? r.ar : r.en) : id; };
  const secName = id => t.secs[id] || id;
  const tierName = id => { const x = E.TIER[id]; return state.lang === 'ar' ? x.ar : x.en; };

  let openDD = null;
  function closeDD() {
    if (!openDD) return;
    openDD.menu.hidden = true; openDD.btn.setAttribute('aria-expanded', 'false'); openDD.host.classList.remove('open');
    openDD = null;
  }
  function placeDD() {
    if (!openDD) return;
    const { host, menu } = openDD;
    menu.style.left = '0px'; menu.style.right = 'auto';
    const hr = host.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const w = Math.min(menu.offsetWidth, vw - 16);
    const want = state.lang === 'ar' ? hr.right - w : hr.left;
    const x = Math.max(8, Math.min(want, vw - 8 - w));
    menu.style.left = (x - hr.left) + 'px';
  }
  function dropdown(host, cfg) {
    if (openDD && openDD.host === host) openDD = null;
    host.classList.remove('open');
    host.innerHTML = '';
    host.classList.add('dd');
    const lab = el('span', 'field-label', esc(cfg.label));
    const cur = cfg.options.find(o => o.v === cfg.value) || cfg.options[0];
    const btn = el('button', 'field-input dd-btn', `<span class="dd-val">${esc(cfg.display ? cfg.display(cur) : cur.l)}</span>${CHEV}`);
    btn.type = 'button'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', cfg.label + ': ' + cur.l);
    const menu = el('ul', 'dd-menu'); menu.setAttribute('role', 'listbox'); menu.hidden = true;
    let lastGroup = null;
    cfg.options.forEach(o => {
      if (o.group && o.group !== lastGroup) { const g = el('li', 'dd-group', esc(o.group)); g.setAttribute('role', 'presentation'); menu.appendChild(g); lastGroup = o.group; }
      const li = el('li', 'dd-opt', `<span class="dd-main"><span>${esc(o.l)}</span>${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</span>${o.n != null ? `<span class="dd-n">${esc(o.n)}</span>` : ''}${TICK}`);
      li.setAttribute('role', 'option'); li.tabIndex = -1; li.dataset.v = o.v;
      li.setAttribute('aria-selected', String(o.v === cfg.value));
      li.onclick = e => { e.stopPropagation(); closeDD(); btn.focus(); if (o.v !== cfg.value) cfg.onChange(o.v); };
      menu.appendChild(li);
    });
    const opts = () => [...menu.querySelectorAll('.dd-opt')];
    const open = () => {
      closeDD();
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); host.classList.add('open');
      openDD = { host, btn, menu };
      placeDD();
      const sel = menu.querySelector('[aria-selected="true"]') || opts()[0];
      if (sel) { sel.focus({ preventScroll: true }); sel.scrollIntoView({ block: 'nearest' }); }
    };
    btn.onclick = e => { e.stopPropagation(); if (openDD && openDD.host === host) closeDD(); else open(); };
    btn.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } };
    menu.onkeydown = e => {
      const list = opts(); const i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
      else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (list[i]) list[i].click(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); closeDD(); btn.focus(); }
    };
    host.append(lab, btn, menu);
  }

  function applyLang() {
    t = window.I18N[state.lang];
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-t]').forEach(n => { const v = t[n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    $('#search-input').placeholder = t.searchPh;
    document.title = `${t.brand} · ${t.brandSub}`;
    buildFilters();
    store.set('lang', state.lang);
  }

  function buildFilters() {
    const tierOpts = E.TIERS.map(x => ({ v: x.id, l: state.lang === 'ar' ? x.ar : x.en, sub: state.lang === 'ar' ? x.hint_ar : x.hint_en, group: x.group === 'non' ? t.nonInsured : t.insured }));
    dropdown($('#tier-field'), { label: t.tier, value: state.tier, options: tierOpts, onChange: v => { state.tier = v; store.set('tier', v); buildFilters(); run(); refreshOpenSheet(); } });
    const cnt = s => E.sections.filter(x => x.src === s).reduce((a, b) => a + b.count, 0);
    dropdown($('#src-field'), { label: t.source, value: state.src, options: [
      { v: 'all', l: t.all, n: state.ready ? E.docs.length.toLocaleString('en-US') : null },
      { v: '460', l: t.src460, n: state.ready ? cnt('460').toLocaleString('en-US') : null },
      { v: 'op', l: t.srcOp, n: state.ready ? cnt('op').toLocaleString('en-US') : null },
      { v: '996', l: t.src996, n: state.ready ? cnt('996').toLocaleString('en-US') : null }
    ], onChange: v => {
      state.src = v;
      const s = E.sections.find(x => x.id === state.section);
      if (s && v !== 'all' && s.src !== v) state.section = 'all';
      buildFilters(); run();
    } });
    const secs = E.sections.filter(s => state.src === 'all' || s.src === state.src);
    if (state.section !== 'all' && !secs.some(s => s.id === state.section)) state.section = 'all';
    dropdown($('#section-field'), { label: t.section, value: state.section, options: [{ v: 'all', l: t.anySection }, ...secs.map(s => ({ v: s.id, l: secName(s.id), n: s.count.toLocaleString('en-US') }))], onChange: v => { state.section = v; buildFilters(); run(); } });
    dropdown($('#conf-field'), { label: t.confidence, value: state.conf, options: [{ v: 'all', l: t.anyConf }, { v: 'high', l: t.high, n: '≥ 90%' }, { v: 'mid', l: t.mid, n: '60–89%' }, { v: 'low', l: t.low, n: '< 60%' }], onChange: v => { state.conf = v; buildFilters(); run(); } });
    dropdown($('#sort-field'), { label: t.sort, value: state.sort, options: [{ v: 'rel', l: t.relevance }, { v: 'asc', l: t.priceAsc }, { v: 'desc', l: t.priceDesc }, { v: 'conf', l: t.byConf }], onChange: v => { state.sort = v; buildFilters(); run(); } });
    dropdown($('#grade-field'), { label: t.grade, value: state.grade, options: [{ v: 'all', l: t.anyGrade }, ...Object.keys(E.MATRIX).map(k => ({ v: k, l: t.gradeNames[k], n: fmt(E.MATRIX[k].total) }))], onChange: v => { state.grade = v; buildFilters(); run(); } });
    $('#more-toggle').textContent = $('#more-filters').hidden ? t.more : t.less;
    $('#reset-filters').hidden = !isFiltered();
  }
  function isFiltered() { return state.src !== 'all' || state.section !== 'all' || state.conf !== 'all' || state.sort !== 'rel' || state.grade !== 'all' || state.min || state.max || state.priced; }

  function highlight(name, q) {
    const s = esc(name);
    if (!q.trim()) return s;
    const { groups } = E.expandQuery(q);
    const words = [];
    groups.forEach(g => g.alts.forEach(a => { if (a.length >= 2 && !a.includes(' ')) words.push(a); }));
    if (!words.length) return s;
    const map = { 'ا': '[اأإآ]', 'ه': '[هة]', 'ي': '[يى]', 'و': '[وؤ]' };
    const pat = words.sort((a, b) => b.length - a.length).slice(0, 8).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split('').map(ch => map[ch] || ch).join('[\\u064B-\\u065F\\u0640]*')).join('|');
    try { return s.replace(new RegExp(`(${pat})`, 'gi'), '<mark>$1</mark>'); } catch (e) { return s; }
  }

  function unitText(p, d) { return p.unitKey === 'perDayDiff' ? t.perDayDiff : p.unitKey === 'perDay' ? t.perDay : p.unitKey === 'copay' ? t.copay : d.unit ? t.perUnit(d.unit) : ''; }
  function priceBlock(p, d) {
    if (p.status === 'price') {
      const unit = unitText(p, d);
      return `<span class="r-amount">${fmt(p.amount)}<small>${t.egp}</small></span>${unit ? `<span class="r-unit">${esc(unit)}</span>` : ''}${confPill(p.conf)}`;
    }
    const label = p.status === 'covered' ? t.covered : p.reason === 'rx4' ? t.notApplicable : t.notInData;
    return `<span class="r-status">${esc(label)}</span>${confPill(p.conf)}`;
  }

  function resultItem(x) {
    const { d, p } = x;
    const li = el('li', 'result');
    li.tabIndex = 0; li.dataset.id = d.id;
    const alt = d.nameAr && d.nameAr !== d.name ? `<div class="r-alt" dir="auto">${esc(d.nameAr)}</div>` : '';
    const meta = [];
    if (d.code) meta.push(`<span class="r-code">${esc(d.code)}</span>`);
    meta.push(`<span>${esc(secName(d.ch))}</span>`);
    if (d.src === 'op' && d.gradeKey) meta.push(`<span>${esc(t.gradeNames[d.gradeKey])}</span>`);
    if (d.src === 'op' && d.specialty) meta.push(`<span>${esc(d.specialty)}</span>`);
    if (d.src === '996') meta.push(`<span>${esc(d.tTitle)}</span>`);
    if (d.src === '460' && d.cat && d.cat !== d.tTitle) meta.push(`<span>${esc(d.cat)}</span>`);
    const flags = (d.flags || []).slice(0, 3).map(f => `<span class="r-flag${f.key === 'conflict' || f.key === 'context' ? ' warn' : ''}">${esc(t.flags[f.key])}</span>`).join('');
    li.innerHTML = `<div class="r-body"><div class="r-name" dir="auto">${highlight(d.name, state.q)}</div>${alt}<div class="r-meta">${meta.join('<span class="r-sep" aria-hidden="true">·</span>')}${flags}</div></div><div class="r-price">${priceBlock(p, d)}</div>`;
    li.onclick = () => openDetail(d.id);
    li.onkeydown = e => { if (e.key === 'Enter') openDetail(d.id); };
    return li;
  }

  let lastRun = '';
  function run(force) {
    if (!state.ready) return;
    const opts = { tier: state.tier, src: state.src, section: state.section, conf: state.conf, sort: state.sort, min: state.min, max: state.max, grade: state.grade, priced: state.priced };
    const key = state.q + JSON.stringify(opts) + state.lang;
    if (!force && key === lastRun) return;
    lastRun = key;
    const t0 = performance.now();
    const filtering = state.q.trim() || state.src !== 'all' || state.section !== 'all' || state.conf !== 'all' || state.grade !== 'all' || state.min || state.max || state.priced;
    const list = $('#result-list'); list.innerHTML = '';
    $('#search-clear').hidden = !state.q;
    $('#reset-filters').hidden = !isFiltered();
    syncUrl();
    if (!filtering) { state.results = []; $('#results-meta').innerHTML = ''; showDiscover(); return; }
    $('#empty-state').hidden = true;
    state.results = E.search(state.q, opts);
    const ms = (performance.now() - t0).toFixed(1);
    $('#results-meta').innerHTML = `<span>${t.results(state.results.length)}</span><span>${esc(tierName(state.tier))} · ${t.ms(ms)}</span>`;
    state.shown = 0;
    renderMore();
    if (!state.results.length) { const es = $('#empty-state'); es.className = 'empty-state'; es.hidden = false; es.textContent = t.noResults; }
  }
  function renderMore() {
    const frag = document.createDocumentFragment();
    const next = state.results.slice(state.shown, state.shown + PAGE);
    next.forEach(x => frag.appendChild(resultItem(x)));
    $('#result-list').appendChild(frag);
    state.shown += next.length;
  }
  function showDiscover() {
    const es = $('#empty-state');
    es.hidden = false; es.className = 'discover'; es.textContent = '';
    es.appendChild(el('h2', 'eyebrow', esc(t.try)));
    const row = el('div', 'sugg-row');
    t.sugg.forEach(s => { const b = el('button', 'tag', esc(s)); b.type = 'button'; b.dir = 'auto'; b.onclick = () => setQuery(s); row.appendChild(b); });
    es.appendChild(row);
    es.appendChild(el('h2', 'eyebrow', esc(t.browse)));
    const grid = el('ol', 'sec-index');
    E.sections.forEach(s => {
      const li = el('li');
      const b = el('button', 'sec-row', `<span class="sec-no">${s.no != null ? String(s.no).padStart(2, '0') : (s.id === 'ops' ? 'OP' : '96')}</span><span class="sec-name">${esc(secName(s.id))}</span><span class="sec-n">${s.count.toLocaleString('en-US')}</span>`);
      b.type = 'button';
      b.onclick = () => { state.section = s.id; state.src = 'all'; buildFilters(); run(); };
      li.appendChild(b); grid.appendChild(li);
    });
    es.appendChild(grid);
  }
  function setQuery(s) { state.q = s; $('#search-input').value = s; run(); $('#search-input').focus(); }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.tier !== 'cash') p.set('tier', state.tier);
    if (state.src !== 'all') p.set('src', state.src);
    if (state.section !== 'all') p.set('sec', state.section);
    if (state.conf !== 'all') p.set('conf', state.conf);
    if (state.sort !== 'rel') p.set('sort', state.sort);
    const s = p.toString();
    history.replaceState(null, '', s ? '?' + s : location.pathname);
  }

  let openSheet = null, openArg = null, lastFocus = null;
  function showSheet(id) {
    closeDD();
    ['#detail-sheet', '#estimate-sheet', '#rules-sheet'].forEach(s => { if (s !== id) $(s).hidden = true; });
    if (!openSheet) lastFocus = document.activeElement;
    $(id).hidden = false; $('#scrim').hidden = false; openSheet = id;
    document.body.style.overflow = 'hidden';
    const sh = $(id);
    sh.scrollTop = 0;
    sh.onscroll = () => { const h = sh.querySelector('.sheet-head'); if (h) h.classList.toggle('scrolled', sh.scrollTop > 4); };
    setTimeout(() => { const c = sh.querySelector('.sheet-close'); if (c) c.focus({ preventScroll: true }); }, 30);
  }
  function closeSheet() {
    if (!openSheet) return;
    closeDD();
    $(openSheet).hidden = true; $('#scrim').hidden = true; openSheet = null; openArg = null;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function refreshOpenSheet() {
    if (openSheet === '#detail-sheet' && openArg) openDetail(openArg, true);
    if (openSheet === '#estimate-sheet') openEstimate(true);
  }
  function sheetHead(key, title, sub) {
    return `<div class="sheet-head"><div><h2 id="${key}-title" dir="auto">${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div><button class="sheet-close" type="button" aria-label="${esc(t.close)}" data-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
  }

  function ruleRowHTML(id) {
    const r = E.RULES[id]; if (!r) return '';
    const desc = r.d && state.lang !== 'ar' ? `<div class="rule-desc">${esc(r.d)}</div>` : '';
    const srcBtn = r.refs.length ? `<button class="link-btn src-toggle" type="button" data-src="${id}">${esc(t.showSource)}</button><div class="rule-src-box" data-box="${id}" hidden></div>` : '';
    const fix = r.fix ? `<div class="rule-fix"><b>${esc(t.corrected)}</b> ${esc(r.fix)}</div>` : '';
    return `<div class="rule-row"><div class="rule-top"><div><div class="rule-title">${esc(ruleTitle(id))}</div><span class="rule-id">${esc(id)}</span></div>${confPill(r.c)}</div>${desc}${fix}${srcBtn}</div>`;
  }
  function bindSrcToggles(root) {
    root.querySelectorAll('[data-src]').forEach(b => {
      b.onclick = e => {
        e.stopPropagation();
        const id = b.dataset.src; const box = root.querySelector(`[data-box="${CSS.escape(id)}"]`);
        if (!box.hidden) { box.hidden = true; b.textContent = t.showSource; return; }
        if (!box.innerHTML) box.innerHTML = E.RULES[id].refs.map(ref => { const s = E.sourceOf(ref); return s ? `<div class="rule-src"><b>${esc(s.where)}</b><p>${esc(s.text)}</p></div>` : ''; }).join('');
        box.hidden = false; b.textContent = t.hideSource;
      };
    });
  }

  function lineLabel(l) {
    const L = t.lines;
    switch (l.k) {
      case 'gradeTotal': return L.gradeTotal(t.gradeNames[Object.keys(E.MATRIX).find(k => E.MATRIX[k].name === l.grade)] || l.grade);
      case 'retention': return L.retention(l.films, l.rate);
      case 'service': return L.service(l.base);
      default: return typeof L[l.k] === 'function' ? L[l.k]() : (L[l.k] || l.k);
    }
  }
  const barVar = c => confClass(c) === 'h' ? 'hi' : confClass(c) === 'm' ? 'mid' : 'lo';

  function openDetail(id, keep) {
    const d = E.byId[id]; if (!d) return;
    openArg = id;
    const p = E.priceFor(d, state.tier);
    const sh = $('#detail-sheet');
    const subBits = [d.code ? `<span class="r-code">${esc(d.code)}</span>` : '', esc(t.srcLabel[d.src]), esc(secName(d.ch))].filter(Boolean).join(' · ');
    let html = sheetHead('detail', esc(d.name), subBits) + '<div class="sheet-body">';
    if (d.nameAr) html += `<div class="sub name-ar" dir="rtl">${esc(d.nameAr)}</div>`;

    html += `<section class="block"><h3>${esc(t.youAre)} ${esc(tierName(state.tier))}</h3>`;
    if (p.status === 'price') {
      const unit = unitText(p, d);
      html += `<div class="big-price"><span class="amt">${fmt(p.amount)}<small>${t.egp}</small></span>${confPill(p.conf)}</div>${unit ? `<div class="sub">${esc(unit)}</div>` : ''}`;
    } else {
      html += `<div class="big-price"><span class="status-text">${esc(t.reasons[p.reason] || t.notInData)}</span>${confPill(p.conf)}</div>`;
    }
    if (p.lines.length) {
      html += `<h3 class="mt">${esc(t.breakdown)}</h3><ul class="lines">` + p.lines.map(l => `<li><span>${esc(lineLabel(l))}<span class="rid">${esc(l.rule)}</span></span><span class="v">${l.amount < 0 ? '−' : ''}${fmt(Math.abs(l.amount))}</span></li>`).join('');
      if (p.status === 'price') html += `<li class="total"><span>${esc(t.total)}</span><span class="v">${fmt(p.amount)}</span></li>`;
      html += '</ul>';
    }
    if (p.comps) html += `<div class="note-row"><span>${esc(t.gradeComp)}</span><span class="v">${fmt(p.comps.or)} · ${fmt(p.comps.doc)} · ${fmt(p.comps.an)}</span></div><div class="note-row"><span>${esc(t.doctorCaseShort)} <span class="rid">R460-O7</span></span><span class="v">${fmt(p.doctorCase)}</span></div>`;
    if (p.admin) html += `<div class="note-row"><span>${esc(t.adminOpt)} <span class="rid">${p.admin.rule}</span><small>${esc(t.adminNote)}</small></span><span class="v">${fmt(p.admin.total)}</span></div>`;
    if (p.printed) html += `<div class="note-row"><span>${esc(t.printedReading)} <span class="rid">R996-T2</span><small>${esc(t.alsoShown)}</small></span><span class="v">${fmt(p.printed.amount)}</span></div>`;
    html += `<div class="actions"><button class="btn" type="button" id="add-est">${esc(state.est.some(x => x.id === id) ? t.added + ' ✓' : t.add)}</button></div></section>`;

    html += `<section class="block"><h3>${esc(t.whyConf)}</h3><div class="conf-parts">` + p.confParts.slice().sort((a, b) => a.c - b.c).map(cp => `<div class="conf-part"><span class="rule-id">${esc(cp.id)}</span><div class="conf-bar"><span style="width:${Math.round(cp.c * 100)}%;background:var(--${barVar(cp.c)})"></span></div><b>${Math.round(cp.c * 100)}%</b></div>`).join('') + `</div><div class="weak-note">${esc(t.weakest)}</div>`;
    html += p.confParts.map(cp => cp.id).filter((v, i, a) => a.indexOf(v) === i).map(rid => ruleRowHTML(rid)).join('') + '</section>';

    if (d.src !== '996' && d.link996) {
      const r = d.link996.row;
      html += `<section class="block"><h3>${esc(t.linked996)}</h3><ul class="mini-list"><li data-go="${r.id}"><span><span class="mn" dir="rtl">${esc(r.name)}</span><span class="mc">${esc(r.tTitle)} · #${r.serial} · ${esc(t.films)} ${r.films ?? '—'}</span></span><span class="mv">${esc(t.linkScore)} ${Math.round(d.link996.score * 100)}%</span></li></ul></section>`;
    }
    if (d.src === '996') {
      const links = (d.links || []).slice(0, 6);
      if (links.length) html += `<section class="block"><h3>${esc(t.linked460)}</h3><ul class="mini-list">` + links.map(x => `<li data-go="${x.doc.id}"><span><span class="mn" dir="auto">${esc(x.doc.name)}</span><span class="mc">${esc(x.doc.code || '')} · ${esc(t.linkScore)} ${Math.round(x.score * 100)}%</span></span><span class="mv">${fmt(x.doc.price)}</span></li>`).join('') + '</ul></section>';
      html += `<section class="block"><h3>${esc(t.srcLabel['996'])}</h3><dl class="kv"><dt>${esc(t.films)}</dt><dd>${d.films ?? '—'}</dd><dt>${esc(t.wfFb)}</dt><dd>${d.ret79 ?? '—'}</dd><dt>${esc(t.stCh)}</dt><dd>${d.schoolRet ?? '—'} + ${d.schoolSvc ?? '—'} = ${d.schoolTotal ?? '—'}</dd></dl></section>`;
    }
    if (d.otherCtx && d.otherCtx.length) {
      html += `<section class="block"><h3>${esc(t.otherCtx)}</h3><ul class="mini-list">` + d.otherCtx.slice(0, 8).map(o => `<li data-go="${o.id}"><span><span class="mn" dir="auto">${esc(o.name)}</span><span class="mc">${esc(o.code || '')} · ${esc(secName(o.ch))}${o.group ? ' · ' + esc(o.group) : ''}</span></span><span class="mv">${o.price != null ? fmt(o.price) : esc(o.grade || '')}</span></li>`).join('') + '</ul></section>';
    }
    const extra = p.notes.filter(x => !p.confParts.some(c => c.id === x));
    if (extra.length) html += `<section class="block"><h3>${esc(t.applies)}</h3>` + extra.map(rid => ruleRowHTML(rid)).join('') + '</section>';

    const kv = [];
    kv.push([t.source, esc(t.srcLabel[d.src]) + (d.page ? ` · ${t.page} ${esc(d.page)}` : '')]);
    if (d.tTitle) kv.push([t.section, esc(d.chLabel ? d.chLabel + ' · ' : '') + esc(d.tTitle)]);
    if (d.group && d.group !== d.tTitle) kv.push([t.grp, esc(d.group)]);
    if (d.desc) kv.push([t.note, esc(d.desc)]);
    if (d.priceNote) kv.push([t.note, esc(d.priceNote)]);
    if (d.stay) kv.push([t.stay, `${d.stay.intensive_care ?? 0} / ${d.stay.ward ?? 0}`]);
    if (d.gradePrinted) kv.push([t.grade, esc(d.gradePrinted)]);
    kv.push([t.id, `<span class="r-code">${esc(d.id)}</span>`]);
    html += `<section class="block"><h3>${esc(t.source)}</h3><dl class="kv">` + kv.map(([a, b]) => `<dt>${esc(a)}</dt><dd dir="auto">${b}</dd>`).join('') + '</dl></section>';
    html += '</div>';
    sh.innerHTML = html;
    sh.querySelector('[data-close]').onclick = closeSheet;
    sh.querySelectorAll('[data-go]').forEach(n => { n.onclick = () => openDetail(n.dataset.go); });
    sh.querySelector('#add-est').onclick = () => { addEst(id); openDetail(id, true); };
    bindSrcToggles(sh);
    if (!keep || openSheet !== '#detail-sheet') showSheet('#detail-sheet');
  }

  function addEst(id) {
    const ex = state.est.find(x => x.id === id);
    if (ex) ex.qty++; else state.est.push({ id, qty: 1 });
    saveEst(); toast(t.added);
  }
  function saveEst() {
    store.set('est', state.est);
    const n = state.est.reduce((a, b) => a + b.qty, 0);
    const b = $('#estimate-count'); b.hidden = !n; b.textContent = n;
  }

  function openEstimate(keep) {
    const sh = $('#estimate-sheet');
    const tierObj = E.TIER[state.tier];
    const res = E.estimate(state.est, state.tier, { admin: state.estAdmin, doctorCase: state.estDoctor });
    let html = sheetHead('estimate', esc(t.estTitle), esc(t.youAre) + ' ' + esc(tierName(state.tier))) + '<div class="sheet-body">';
    if (!state.est.length) {
      html += `<section class="block"><p class="status-text">${esc(t.estEmpty)}</p></section>`;
    } else {
      html += '<section class="block">';
      const qtyOf = id => (state.est.find(x => x.id === id) || {}).qty || 1;
      const seen = new Set();
      const stepper = (id, q) => `<span class="stepper"><button type="button" data-dec="${id}" aria-label="−">−</button><span>${q}</span><button type="button" data-inc="${id}" aria-label="+">+</button></span>`;
      res.lines.forEach(l => {
        const first = !seen.has(l.d.id); seen.add(l.d.id);
        const sub = [l.d.code, secName(l.d.ch), l.factor != null && l.factor !== 1 ? `× ${l.factor * 100}% R460-O4` : '', l.doctorCase ? t.doctorCaseShort : ''].filter(Boolean).map(esc).join(' · ');
        html += `<div class="est-item"><div><div class="est-name" dir="auto">${esc(l.d.name)}</div><div class="est-sub">${sub}</div></div><div class="est-right"><span class="est-amt">${fmt(l.amount)}</span>${first ? stepper(l.d.id, qtyOf(l.d.id)) : ''}</div></div>`;
      });
      res.na.forEach(x => {
        html += `<div class="est-item"><div><div class="est-name" dir="auto">${esc(x.d.name)}</div><div class="est-sub">${esc(t.notCounted)} · ${esc(t.reasons[x.p.reason] || '')}</div></div><div class="est-right"><span class="est-amt">—</span>${stepper(x.d.id, x.qty)}</div></div>`;
      });
      html += '</section><section class="block">';
      if (tierObj.group === 'non') {
        html += `<label class="toggle-row"><input type="checkbox" id="est-admin" ${state.estAdmin ? 'checked' : ''}><span>${esc(t.adminOpt)} <span class="rid">R460-M4</span></span></label>`;
        if (res.lines.some(l => l.d.src === 'op')) html += `<label class="toggle-row"><input type="checkbox" id="est-doc" ${state.estDoctor ? 'checked' : ''}><span>${esc(t.doctorCase)} <span class="rid">R460-O7</span></span></label>`;
      }
      html += `<ul class="lines mt"><li><span>${esc(t.subtotal)}</span><span class="v">${fmt(res.subtotal)}</span></li>`;
      if (res.admin) html += `<li><span>${esc(t.admin)}<span class="rid">${res.adminRule}</span></span><span class="v">${fmt(res.admin)}</span></li>`;
      html += `<li class="total"><span>${esc(t.total)}</span><span class="v">${fmt(res.total)} ${esc(t.egp)}</span></li></ul>`;
      html += `<div class="big-price mt"><span class="sub">${esc(t.estConf)}</span>${confPill(res.conf)}</div><div class="weak-note">${esc(t.weakest)}</div>`;
      html += `<div class="actions"><button class="btn ghost" type="button" id="est-clear">${esc(t.clear)}</button></div></section>`;
      if (res.rules.length) html += `<section class="block"><h3>${esc(t.rules)}</h3>` + res.rules.map(r => ruleRowHTML(r)).join('') + '</section>';
    }
    html += '</div>';
    sh.innerHTML = html;
    sh.querySelector('[data-close]').onclick = closeSheet;
    sh.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => { state.est.find(x => x.id === b.dataset.inc).qty++; saveEst(); openEstimate(true); });
    sh.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => { const x = state.est.find(y => y.id === b.dataset.dec); x.qty--; if (x.qty <= 0) state.est = state.est.filter(y => y !== x); saveEst(); openEstimate(true); });
    const ad = sh.querySelector('#est-admin'); if (ad) ad.onchange = () => { state.estAdmin = ad.checked; store.set('estAdmin', ad.checked); openEstimate(true); };
    const dc = sh.querySelector('#est-doc'); if (dc) dc.onchange = () => { state.estDoctor = dc.checked; openEstimate(true); };
    const cl = sh.querySelector('#est-clear'); if (cl) cl.onclick = () => { state.est = []; saveEst(); openEstimate(true); };
    bindSrcToggles(sh);
    if (!keep || openSheet !== '#estimate-sheet') showSheet('#estimate-sheet');
  }

  let ruleCat = 'all', ruleQ = '';
  function openRules(keep) {
    const sh = $('#rules-sheet');
    let html = sheetHead('rules', esc(t.rulesTitle), esc(t.rulesSub)) + '<div class="sheet-body">';
    const st = E.stats();
    html += `<section class="block"><h3>${esc(t.dataCheck)}</h3><p class="status-text">${esc(t.dataCheckBody(st.priced.toLocaleString('en-US'), st.ops.toLocaleString('en-US'), st.r996, st.tables))}</p></section>`;
    const fixes = window.HIO_RULES.filter(r => r.fix);
    html += `<section class="block"><h3>${esc(t.audit)}</h3><p class="status-text">${esc(t.auditBody)}</p>` + fixes.map(r => `<div class="rule-fix"><b>${esc(r.id)}</b> ${esc(r.fix)}</div>`).join('') + '</section>';
    html += `<div class="field-row rules-tools"><label class="field field-grow"><span class="field-label">${esc(t.rulesSearch)}</span><input class="field-input" id="rule-q" type="search" value="${esc(ruleQ)}" dir="auto"></label><div class="field" id="rule-cat"></div></div>`;
    html += '<section class="block" id="rule-list"></section></div>';
    sh.innerHTML = html;
    const draw = () => {
      const q = E.norm(ruleQ);
      const rows = window.HIO_RULES.filter(r => (ruleCat === 'all' || r.cat === ruleCat) && (!q || E.norm(r.id + ' ' + r.en + ' ' + r.ar + ' ' + r.d).includes(q)));
      const box = sh.querySelector('#rule-list');
      box.innerHTML = rows.map(r => ruleRowHTML(r.id)).join('') || `<p class="sub">${esc(t.noResults)}</p>`;
      bindSrcToggles(box);
    };
    const catCount = c => window.HIO_RULES.filter(r => r.cat === c).length;
    const drawCat = () => dropdown(sh.querySelector('#rule-cat'), { label: t.catLabel, value: ruleCat, options: [{ v: 'all', l: t.allCats, n: window.HIO_RULES.length }, ...Object.keys(t.cats).filter(catCount).map(c => ({ v: c, l: t.cats[c], n: catCount(c) }))], onChange: v => { ruleCat = v; drawCat(); draw(); } });
    drawCat(); draw();
    sh.querySelector('[data-close]').onclick = closeSheet;
    sh.querySelector('#rule-q').oninput = e => { ruleQ = e.target.value; draw(); };
    if (!keep) showSheet('#rules-sheet');
  }

  let toastT;
  function toast(msg) {
    let n = document.querySelector('.toast');
    if (!n) { n = el('div', 'toast'); n.setAttribute('role', 'status'); document.body.appendChild(n); }
    n.textContent = msg; n.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { n.hidden = true; }, 1400);
  }

  function bind() {
    const inp = $('#search-input');
    inp.value = state.q;
    let raf;
    inp.addEventListener('input', () => { state.q = inp.value; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => run()); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const f = state.results[0]; if (f) openDetail(f.d.id); }
      if (e.key === 'ArrowDown') { const f = document.querySelector('.result'); if (f) { e.preventDefault(); f.focus(); } }
      if (e.key === 'Escape') setQuery('');
    });
    $('#search-clear').onclick = () => setQuery('');
    $('#result-list').addEventListener('keydown', e => {
      const cur = document.activeElement; if (!cur.classList.contains('result')) return;
      if (e.key === 'ArrowDown' && cur.nextElementSibling) { e.preventDefault(); cur.nextElementSibling.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (cur.previousElementSibling || inp).focus(); }
    });
    document.addEventListener('click', e => { if (openDD && !openDD.host.contains(e.target)) closeDD(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && openDD) { closeDD(); return; }
      if (e.key === 'Escape' && openSheet) { closeSheet(); return; }
      if (e.key === '/' && document.activeElement !== inp && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); inp.select(); }
    });
    window.addEventListener('resize', placeDD);
    $('#scrim').onclick = closeSheet;
    $('#priced-filter').onchange = e => { state.priced = e.target.checked; run(); };
    let nt;
    ['#min-filter', '#max-filter'].forEach(s => $(s).addEventListener('input', e => { clearTimeout(nt); nt = setTimeout(() => { state[s === '#min-filter' ? 'min' : 'max'] = e.target.value; run(); }, 120); }));
    $('#more-toggle').onclick = () => { const m = $('#more-filters'); m.hidden = !m.hidden; $('#more-toggle').textContent = m.hidden ? t.more : t.less; };
    $('#reset-filters').onclick = () => {
      Object.assign(state, { src: 'all', section: 'all', conf: 'all', sort: 'rel', grade: 'all', min: '', max: '', priced: false });
      $('#min-filter').value = ''; $('#max-filter').value = ''; $('#priced-filter').checked = false;
      buildFilters(); run();
    };
    $('#toggle-lang').onclick = () => { state.lang = state.lang === 'ar' ? 'en' : 'ar'; applyLang(); run(true); if (openSheet === '#rules-sheet') openRules(true); else refreshOpenSheet(); };
    $('#open-estimate').onclick = () => openEstimate();
    $('#open-rules').onclick = () => openRules();
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting && state.shown < state.results.length) renderMore(); }, { rootMargin: '600px' });
    io.observe($('#result-sentinel'));
  }

  async function init() {
    applyLang();
    bind();
    saveEst();
    $('#result-list').innerHTML = `<li class="loading"><i></i>${esc(t.loading)}</li>`;
    try {
      const [a, b] = await Promise.all([fetch('data/d460.json').then(r => r.json()), fetch('data/d996.json').then(r => r.json())]);
      E.build(a, b);
      state.ready = true;
      state.est = state.est.filter(x => E.byId[x.id]);
      saveEst();
      buildFilters();
      run(true);
      const openId = params.get('id'); if (openId && E.byId[openId]) openDetail(openId);
      const view = params.get('view'); if (view === 'rules') openRules(); else if (view === 'estimate') openEstimate();
    } catch (err) {
      $('#result-list').innerHTML = `<li class="empty-state">${esc(err.message)}</li>`;
    }
  }
  init();
})();
