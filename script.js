/* ========= SHARED UTILITIES ========= */

function speak(text){
  if(!('speechSynthesis' in window)){ return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IE';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function speakerIcon(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M19 8a5 5 0 0 1 0 8"/><path d="M15.5 10.5a2.5 2.5 0 0 1 0 3"/></svg>';
}

/* Vocabulary flip cards. items: [{picture:'<svg>...</svg>' or emoji, word, example}] */
function renderVocabGrid(container, items){
  items.forEach(v => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'vocab-card';
    const pic = v.svg ? v.svg : `<span class="emoji">${v.e || ''}</span>`;
    card.innerHTML = `
      <div class="vocab-card-inner">
        <div class="vocab-face vocab-front">
          ${pic}
          <span class="word">${v.w}</span>
        </div>
        <div class="vocab-face vocab-back">
          <span>${v.x}</span>
          <button type="button" class="listen-btn">${speakerIcon()} Listen</button>
        </div>
      </div>`;
    card.addEventListener('click', (e) => {
      if(e.target.closest('.listen-btn')){
        e.stopPropagation();
        speak(v.w.replace(/[^a-zA-Z' ]/g,''));
        return;
      }
      card.classList.toggle('flipped');
    });
    container.appendChild(card);
  });
}

/* Speaking prompt flip cards. items: [{q, a}] */
function renderPromptGrid(container, items){
  items.forEach(p => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'prompt-card';
    card.innerHTML = `
      <div class="prompt-card-inner">
        <div class="prompt-face prompt-front">${p.q}</div>
        <div class="prompt-face prompt-back">${p.a}</div>
      </div>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    container.appendChild(card);
  });
}

/* Gap-fill. data: {text with {{}} markers, answers:[]}. Returns nothing, wires reveal button. */
function renderGapfill(container, revealBtn, data){
  let idx = 0;
  container.innerHTML = data.text.replace(/\{\{\}\}/g, () => `<span class="blank">${data.answers[idx++]}</span>`);
  revealBtn.addEventListener('click', () => {
    const revealed = container.classList.toggle('revealed');
    revealBtn.textContent = revealed ? 'Hide answers' : 'Reveal answers';
  });
}

/* Dialogue. lines: [{s:'a'|'b', t}], speakerA name, speakerB defaults to Yaroslava */
function renderDialogue(container, lines, speakerA, speakerB){
  speakerB = speakerB || 'Yaroslava';
  lines.forEach(line => {
    const isA = line.s === 'a';
    const row = document.createElement('div');
    row.className = `bubble-row ${isA ? 'left' : 'right'}`;
    row.innerHTML = `<span class="bubble-name">${isA ? speakerA : speakerB}</span><div class="bubble">${line.t}</div>`;
    container.appendChild(row);
  });
}

/* Sub-tabs (Plan / Materials) within a scope element */
function initSubtabs(scopeEl){
  scopeEl.querySelectorAll('.subtab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      scopeEl.querySelectorAll('.subtab-btn').forEach(b => b.setAttribute('aria-selected','false'));
      tabBtn.setAttribute('aria-selected','true');
      scopeEl.querySelectorAll('.subpanel').forEach(p => p.classList.remove('active'));
      scopeEl.querySelector(`[data-sub-panel="${tabBtn.dataset.sub}"]`).classList.add('active');
    });
  });
}

/* ========= TOPIC ICONS (used on homepage lesson cards) ========= */
const TOPIC_ICONS = {
  wave: '<path d="M8 12c0-3 1.5-5 3-5s2 2 2 4-1 3-2 3 1-1 1-3-1-3-2.5-3S7 9.5 7 12s1.5 4 3.5 4c3 0 5-2 5-2"/><path d="M4 20c1-2 3-3 5-2"/>',
  heart: '<path d="M12 20s-7-4.4-9.5-9C.8 7.8 2 4 5.5 3.4 8 3 10 4.3 12 7c2-2.7 4-4 6.5-3.6C22 4 23.2 7.8 21.5 11c-2.5 4.6-9.5 9-9.5 9Z"/>',
  fork: '<path d="M7 3v6a2 2 0 0 0 4 0V3"/><path d="M9 9v12"/><path d="M15 3c-1.2 0-2 1.5-2 4s.8 4 2 4 2-1.5 2-4-.8-4-2-4Z"/><path d="M15 11v10"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 11.5a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 2-1.6L20 8H6"/>',
  clockback: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M6 5 4 3M4 3v3M4 3h3"/>',
  clockfwd: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M18 5l2-2m0 0v3m0-3h-3"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.8c-.4.4-.2 1.1.3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.9c.2.5.9.7 1.3.3l.8-.7c.4-.3.5-.8.3-1.3Z"/>',
  cloud: '<path d="M7 18a4 4 0 1 1 .6-8 5 5 0 0 1 9.7 1.7A3.5 3.5 0 0 1 17 18H7Z"/><path d="M9 21h.01M13 21h.01M11 23h.01"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>',
  scale: '<path d="M12 3v18M6 8l-3 6a3 3 0 0 0 6 0Z"/><path d="M18 8l-3 6a3 3 0 0 0 6 0Z"/><path d="M6 8h12"/>',
  dot: '<circle cx="12" cy="12" r="3"/>'
};
function topicIcon(name, cls){
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${TOPIC_ICONS[name]}</svg>`;
}
const STUB_COLORS = ['var(--sky-deep)','var(--coral)','var(--grass)','var(--navy-deep)','var(--sky)'];

/* pairs: [{left, right}]. Renders shuffled columns, click-to-pair. */
function renderMatchTask(container, pairs){
  const leftItems = pairs.map((p,i) => ({text:p.left, id:i}));
  const rightItems = shuffle(pairs.map((p,i) => ({text:p.right, id:i})));

  const wrap = document.createElement('div');
  wrap.className = 'match-wrap';
  const colL = document.createElement('div'); colL.className = 'match-col';
  const colR = document.createElement('div'); colR.className = 'match-col';
  wrap.appendChild(colL); wrap.appendChild(colR);
  container.appendChild(wrap);

  const status = document.createElement('p');
  status.className = 'match-status';
  container.appendChild(status);

  let selectedLeft = null, selectedRight = null, matchedCount = 0;

  function makeItem(item, col, side){
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'match-item';
    el.textContent = item.text;
    el.dataset.id = item.id;
    el.addEventListener('click', () => {
      if(el.classList.contains('correct')) return;
      if(side === 'left'){
        if(selectedLeft) selectedLeft.classList.remove('selected');
        selectedLeft = el; el.classList.add('selected');
      } else {
        if(selectedRight) selectedRight.classList.remove('selected');
        selectedRight = el; el.classList.add('selected');
      }
      if(selectedLeft && selectedRight){
        if(selectedLeft.dataset.id === selectedRight.dataset.id){
          selectedLeft.classList.add('correct'); selectedLeft.classList.remove('selected');
          selectedRight.classList.add('correct'); selectedRight.classList.remove('selected');
          matchedCount++;
          status.textContent = matchedCount === pairs.length
            ? 'All matched! Great work.'
            : `${matchedCount} / ${pairs.length} matched`;
        } else {
          [selectedLeft, selectedRight].forEach(x => {
            x.classList.add('wrong');
            setTimeout(() => x.classList.remove('wrong','selected'), 350);
          });
        }
        selectedLeft = null; selectedRight = null;
      }
    });
    col.appendChild(el);
  }
  leftItems.forEach(i => makeItem(i, colL, 'left'));
  rightItems.forEach(i => makeItem(i, colR, 'right'));
  status.textContent = `0 / ${pairs.length} matched`;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========= QUIZ TASK ========= */
/* items: [{q, options:[], correctIndex}] */
function renderQuiz(container, items){
  items.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'quiz-item';
    wrap.innerHTML = `<p class="quiz-q">${item.q}</p><div class="quiz-opts"></div>`;
    const opts = wrap.querySelector('.quiz-opts');
    item.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt';
      btn.textContent = optText;
      btn.addEventListener('click', () => {
        const allOpts = opts.querySelectorAll('.quiz-opt');
        allOpts.forEach(o => o.disabled = true);
        if(i === item.correctIndex){
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          allOpts[item.correctIndex].classList.add('correct');
        }
      });
      opts.appendChild(btn);
    });
    container.appendChild(wrap);
  });
}

/* ========= SENTENCE BUILDER TASK ========= */
/* items: [{words:[...correctOrder], hint}] */
function renderSentenceBuilder(container, items){
  items.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'builder-item';
    const hint = item.hint ? `<p class="mat-sub">${item.hint}</p>` : '';
    wrap.innerHTML = `
      ${hint}
      <div class="builder-target" data-target></div>
      <div class="builder-bank" data-bank></div>
      <button type="button" class="btn builder-check" data-check>Check</button>
      <div class="builder-feedback" data-feedback></div>
    `;
    container.appendChild(wrap);

    const target = wrap.querySelector('[data-target]');
    const bank = wrap.querySelector('[data-bank]');
    const feedback = wrap.querySelector('[data-feedback]');
    const placed = [];

    const shuffled = shuffle(item.words.map((w,i) => ({w, i})));
    shuffled.forEach(entry => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = entry.w;
      chip.addEventListener('click', () => {
        if(chip.classList.contains('placed')) return;
        chip.classList.add('placed');
        const tChip = document.createElement('button');
        tChip.type = 'button';
        tChip.className = 'chip';
        tChip.textContent = entry.w;
        tChip.addEventListener('click', () => {
          tChip.remove();
          chip.classList.remove('placed');
          const idx = placed.indexOf(tChip);
          if(idx > -1) placed.splice(idx,1);
        });
        target.appendChild(tChip);
        placed.push(tChip);
      });
      bank.appendChild(chip);
    });

    wrap.querySelector('[data-check]').addEventListener('click', () => {
      const built = placed.map(c => c.textContent).join(' ');
      const correct = item.words.join(' ');
      if(built.toLowerCase() === correct.toLowerCase()){
        feedback.textContent = '✓ Correct!';
        feedback.className = 'builder-feedback ok';
      } else {
        feedback.textContent = `Not quite — try again. (${built || 'nothing placed yet'})`;
        feedback.className = 'builder-feedback no';
      }
    });
  });
}
