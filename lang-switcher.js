/**
 * Linkora — Universal Language Switcher
 * Works on all pages. Reads/writes localStorage 'linkora_lang'
 */

const LS_KEY = 'linkora_lang';
const LANGS = ['ru','en','zh','es','de'];
const LANG_FLAGS = {ru:'🇷🇺',en:'🇬🇧',zh:'🇨🇳',es:'🇪🇸',de:'🇩🇪'};
const LANG_NAMES = {ru:'RU',en:'EN',zh:'ZH',es:'ES',de:'DE'};

function getLang() {
  const saved = localStorage.getItem(LS_KEY);
  if (saved && LANGS.includes(saved)) return saved;
  const browser = (navigator.language||'ru').slice(0,2).toLowerCase();
  return LANGS.includes(browser) ? browser : 'ru';
}

function saveLang(lang) {
  localStorage.setItem(LS_KEY, lang);
}

function buildSwitcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const lang = getLang();
  container.innerHTML = `
    <div id="ls-wrap" style="position:relative;display:inline-block;">
      <button id="ls-btn" onclick="toggleLS()" style="
        background:rgba(10,26,12,0.6);border:1px solid rgba(82,183,136,0.2);
        border-radius:100px;color:#b7e4c7;padding:6px 14px;font-size:12px;
        font-family:'Inter',sans-serif;cursor:pointer;display:flex;
        align-items:center;gap:6px;white-space:nowrap;backdrop-filter:blur(8px);
        transition:all 0.3s;">
        ${LANG_FLAGS[lang]} ${LANG_NAMES[lang]} <span style="opacity:0.5;font-size:10px;">▾</span>
      </button>
      <div id="ls-menu" style="
        display:none;position:absolute;top:calc(100% + 8px);right:0;
        background:rgba(5,13,7,0.98);border:1px solid rgba(82,183,136,0.2);
        border-radius:14px;padding:6px;min-width:130px;z-index:1000;
        backdrop-filter:blur(20px);box-shadow:0 16px 32px rgba(0,0,0,0.6);">
        ${LANGS.map(l => `
          <div onclick="setLS('${l}')" style="
            display:flex;align-items:center;gap:10px;padding:9px 12px;
            border-radius:8px;font-size:13px;cursor:pointer;transition:all 0.2s;
            color:${l===lang?'#74c69d':'#6b9e7a'};
            background:${l===lang?'rgba(82,183,136,0.08)':'transparent'};"
            onmouseover="this.style.background='rgba(82,183,136,0.1)';this.style.color='#b7e4c7'"
            onmouseout="this.style.background='${l===lang?'rgba(82,183,136,0.08)':'transparent'}';this.style.color='${l===lang?'#74c69d':'#6b9e7a'}'">
            ${LANG_FLAGS[l]} ${l==='zh'?'中文':l==='es'?'Español':l==='de'?'Deutsch':l==='en'?'English':'Русский'}
          </div>`).join('')}
      </div>
    </div>`;

  document.addEventListener('click', e => {
    const wrap = document.getElementById('ls-wrap');
    if (wrap && !wrap.contains(e.target)) {
      const menu = document.getElementById('ls-menu');
      if (menu) menu.style.display = 'none';
    }
  });
}

function toggleLS() {
  const menu = document.getElementById('ls-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setLS(lang) {
  saveLang(lang);
  location.reload();
}
