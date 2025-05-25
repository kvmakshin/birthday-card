document.addEventListener('DOMContentLoaded', () => {
  // --- Audio & Speaker Button ---
  const music    = document.getElementById('bg-music');
  const muteBtn  = document.getElementById('mute-btn');
  const icon     = document.getElementById('mute-icon');
  const hint     = document.getElementById('music-hint');
  let isPlaying  = false;

  // ГАРАНТИРУЕМ: при загрузке аудио не играет, и иконка в muted
  music.pause();
  isPlaying = false;
  icon.src = 'assets/icons/speaker-muted.svg';
  icon.alt = 'Sound off';

  // Когда трек закончится — снова в muted
  music.addEventListener('ended', () => {
    isPlaying = false;
    icon.src = 'assets/icons/speaker-muted.svg';
    icon.alt = 'Sound off';
  });

  muteBtn.addEventListener('click', () => {
    if (hint) hint.style.display = 'none';

    if (!isPlaying) {
      music.play().catch(() => {});
      isPlaying = true;
      // после старта — unmuted
      icon.src = 'assets/icons/speaker.svg';
      icon.alt = 'Sound on';

         // fire confetti
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70 });
    }
    
    } else {
      music.pause();
      isPlaying = false;
      icon.src = 'assets/icons/speaker-muted.svg';
      icon.alt = 'Sound off';
    }
  });

  // --- Surprise + Reels Grid ---
const surpriseBtn    = document.getElementById('surpriseBtn');
const surprise       = document.getElementById('surprise');
const container      = document.getElementById('reels-container');
const loadRowBtn     = document.getElementById('load-row-btn');
const reelShortcodes = [
  'DJKYcxhBolo','DJIgfyDsuIv','DJGgXhYI9B6','DJEYvRIgbNn',
  'DJHTV8qpyfb','DGqwjeZygKq','DE1yHAoS39q','DJGa2ejslic',
  'DJDZtDbutIT','DJE7-RgTy5p','DFNmxW0vE7a','DHOpqj5v_K4',
  'DHJUCHxNvra','DIsjRBYNefB','DJES9XIS4L3','DI_BNEMIiLi',
  'DJKByrlo82m','DEuwCu4xMD5','DJwbEGBSut1','DH1AyppsIy4',
  'DFog1LDo2nn','DDvkHExMluc','DE7KGHXt3R0','DC7Xkyxpu72',
];

const reelsPerRow = 4;
const totalRows   = Math.ceil(reelShortcodes.length / reelsPerRow);
let currentRow    = 0;
let opened        = false;

surpriseBtn.addEventListener('click', () => {
  surprise.classList.toggle('hidden');

  if (!opened && !surprise.classList.contains('hidden')) {
    if (hint) hint.style.display = 'none';
    loadNextRow();
    opened = true;
  }
});

loadRowBtn.addEventListener('click', loadNextRow);

// script.js

async function loadNextRow() {
  const start = currentRow * reelsPerRow;
  const end   = Math.min(start + reelsPerRow, reelShortcodes.length);

  for (let i = start; i < end; i++) {
    const code = reelShortcodes[i];
    // вызываем наш Netlify Function
    const resp = await fetch(`/.netlify/functions/instagram-oembed?shortcode=${code}`);
    if (!resp.ok) continue;
    const { html } = await resp.json();

    // оборачиваем в div, чтобы вставить в контейнер
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    // можно задать свою ширину
    wrapper.firstElementChild.style.maxWidth = '350px';
    wrapper.firstElementChild.style.margin = '0 auto';

    container.appendChild(wrapper);
  }

  currentRow++;
  if (currentRow >= totalRows) {
    loadRowBtn.style.display = 'none';
  }
}


});