document.addEventListener('DOMContentLoaded', () => {
  // --- Audio & Speaker Button ---
  const music   = document.getElementById('bg-music');
  const muteBtn = document.getElementById('mute-btn');
  const icon    = document.getElementById('mute-icon');
  const hint    = document.getElementById('music-hint');
  let isPlaying = false;

  // старт: пауза + muted-иконка
  music.pause();
  icon.src = 'assets/icons/speaker-muted.svg';
  icon.alt = 'Sound off';

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
      icon.src = 'assets/icons/speaker.svg';
      icon.alt = 'Sound on';
      confetti({ particleCount: 100, spread: 70 });
    } else {
      music.pause();
      isPlaying = false;
      icon.src = 'assets/icons/speaker-muted.svg';
      icon.alt = 'Sound off';
    }
  });

  // --- Surprise + Instagram Embed.js + Confetti ---
  const surpriseBtn   = document.getElementById('surpriseBtn');
  const surprise      = document.getElementById('surprise');
  const container     = document.getElementById('reels-container');
  const loadRowBtn    = document.getElementById('load-row-btn');
  const reelShortcodes = [
    'DJKYcxhBolo','DJIgfyDsuIv','DJGgXhYI9B6','DJEYvRIgbNn',
    'DJHTV8qpyfb','DGqwjeZygKq','DE1yHAoS39q','DKFkqenMph3',
    'DJDZtDbutIT','DI6gUk6swXj','DFNmxW0vE7a','DKCqCLKIMIf',
    'DHJUCHxNvra','DIsjRBYNefB','DJES9XIS4L3','DEnemlQS5Eo',
    'DJKByrlo82m','DEuwCu4xMD5','DJwbEGBSut1','DHyO1RnpWjY',
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

  function loadNextRow() {
    const start = currentRow * reelsPerRow;
    const end   = Math.min(start + reelsPerRow, reelShortcodes.length);

    for (let i = start; i < end; i++) {
      const code = reelShortcodes[i];
      const block = document.createElement('blockquote');

      block.className = 'instagram-media';
      block.setAttribute('data-instgrm-permalink', `https://www.instagram.com/reel/${code}/`);
      block.setAttribute('data-instgrm-version', '14');
      // ограничиваем ширину карточки
      block.style.cssText = 'max-width:350px;width:100%;margin:0 auto 20px;';

      container.appendChild(block);
    }

    // рендерим все вставленные embeds
    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }

    currentRow++;
    if (currentRow >= totalRows) {
      loadRowBtn.style.display = 'none';
    }
  }
});