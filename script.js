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
  dot: '<circle cx="12" cy="12" r="3"/>',
  cycle: '<path d="M4 12a8 8 0 0 1 14-5"/><path d="M20 12a8 8 0 0 1-14 5"/><path d="m18 3 0 4-4 0"/><path d="m6 21 0-4 4 0"/>',
  heartbeat: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  cross: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3V10h7V3Z"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  book: '<path d="M4 4h9a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4V4Z"/>',
  bubble: '<path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><circle cx="9" cy="10.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="10.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10.5" r="0.9" fill="currentColor" stroke="none"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1-1.5 3-1.5s3 1 3 2-1 1.5-3 1.5-3 .5-3 1.5 1 2 3 2 3-.5 3-1.5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M6 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M18 5h2a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4"/><path d="M12 13v4M9 21h6M10 17h4v4h-4z"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17h8"/>',
  house: '<path d="M4 11 12 4l8 7"/><path d="M6 10.2V20h12v-9.8"/><path d="M14 20v-6h-3v6"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M4 13h16"/><path d="M12 9v11"/><path d="M12 9c-2 0-4-1-4-3a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 2-2 3-4 3Z"/>',
  app: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01"/><path d="M8 15c1.3 1 2.7 1.5 4 1.5s2.7-.5 4-1.5"/>',
  story: '<path d="M4 4h9a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4V4Z"/><path d="M7 8h3M7 11h3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-1.5 5-5 1.5 1.5-5Z"/>',
  graduation: '<path d="M2 9 12 4l10 5-10 5-10-5Z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/><path d="M22 9v6"/>'
};
function topicIcon(name, cls){
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${TOPIC_ICONS[name]}</svg>`;
}
const STUB_COLORS = ['var(--sky-deep)','var(--coral)','var(--grass)','var(--navy-deep)','var(--sky)'];

/* pairs: [{left, right}]. Renders shuffled columns, click-to-pair. */
/* ========= SORT TASK (categorize items into two buckets) ========= */
/* data: {bucketA: label, bucketB: label, items: [{text, bucket:'a'|'b'}]} */
function renderSortTask(container, data){
  const wrap = document.createElement('div');
  wrap.className = 'sort-wrap';

  const bucketsRow = document.createElement('div');
  bucketsRow.className = 'sort-buckets';
  const bucketA = document.createElement('div');
  bucketA.className = 'sort-bucket';
  bucketA.dataset.bucket = 'a';
  bucketA.innerHTML = `<div class="sort-bucket-label">${data.bucketA}</div><div class="sort-bucket-items"></div>`;
  const bucketB = document.createElement('div');
  bucketB.className = 'sort-bucket';
  bucketB.dataset.bucket = 'b';
  bucketB.innerHTML = `<div class="sort-bucket-label">${data.bucketB}</div><div class="sort-bucket-items"></div>`;
  bucketsRow.appendChild(bucketA);
  bucketsRow.appendChild(bucketB);

  const bank = document.createElement('div');
  bank.className = 'sort-bank';

  const status = document.createElement('p');
  status.className = 'match-status';

  let selected = null;
  let placedCount = 0;

  function selectChip(chip){
    if(selected) selected.classList.remove('selected');
    selected = chip;
    chip.classList.add('selected');
  }

  shuffle(data.items).forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip sort-chip';
    chip.textContent = item.text;
    chip.dataset.bucket = item.bucket;
    chip.addEventListener('click', () => selectChip(chip));
    bank.appendChild(chip);
  });

  [bucketA, bucketB].forEach(bucketEl => {
    bucketEl.addEventListener('click', () => {
      if(!selected) return;
      const correct = selected.dataset.bucket === bucketEl.dataset.bucket;
      if(correct){
        selected.classList.remove('selected');
        selected.classList.add('placed-correct');
        bucketEl.querySelector('.sort-bucket-items').appendChild(selected);
        selected = null;
        placedCount++;
        status.textContent = placedCount === data.items.length ? 'All sorted! Great work.' : `${placedCount} / ${data.items.length} sorted`;
      } else {
        selected.classList.add('wrong');
        setTimeout(() => selected && selected.classList.remove('wrong'), 350);
      }
    });
  });

  status.textContent = `0 / ${data.items.length} sorted`;
  wrap.appendChild(bucketsRow);
  wrap.appendChild(bank);
  container.appendChild(wrap);
  container.appendChild(status);
}

/* ========= TRUE / FALSE TASK ========= */
/* items: [{statement, isTrue}] */
function renderTrueFalse(container, items){
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'tf-item';
    row.innerHTML = `
      <p class="tf-statement">${item.statement}</p>
      <div class="tf-buttons">
        <button type="button" class="tf-btn" data-val="true">True</button>
        <button type="button" class="tf-btn" data-val="false">False</button>
      </div>
    `;
    const buttons = row.querySelectorAll('.tf-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosenTrue = btn.dataset.val === 'true';
        buttons.forEach(b => b.disabled = true);
        if(chosenTrue === item.isTrue){
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          const correctBtn = [...buttons].find(b => (b.dataset.val === 'true') === item.isTrue);
          correctBtn.classList.add('correct');
        }
      });
    });
    container.appendChild(row);
  });
}

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
