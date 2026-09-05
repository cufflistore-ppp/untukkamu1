/**
 * music.js — Musik per produk/proyek
 * - Tiap template punya lagu default berbeda
 * - Proyek gratis: musik OFF (bisa unlock Rp500)
 * - Link publik: auto-play + kontrol play/pause
 */

const MUSIC_UNLOCK_PRICE = 500;

/** Daftar lagu default per template (beda konsep = beda lagu) */
const TEMPLATE_MUSIC = {
  'untuk-kamu': {
    id: 'romantic-soft',
    title: 'Soft Romance',
    // Sample royalty-free (bisa diganti admin nanti)
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'ulang-tahun': {
    id: 'birthday-happy',
    title: 'Birthday Cheer',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'nembak': {
    id: 'love-playful',
    title: 'Playful Love',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'undangan': {
    id: 'elegant-invite',
    title: 'Elegant Moment',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'surat': {
    id: 'letter-calm',
    title: 'Quiet Letter',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  }
};

function getMusicForTemplate(templateId) {
  return TEMPLATE_MUSIC[templateId] || TEMPLATE_MUSIC['untuk-kamu'];
}

/**
 * Floating music player (untuk halaman publik / preview template)
 * options: { url, title, autoplay }
 */
function mountMusicPlayer(options = {}) {
  const { url, title = 'Musik', autoplay = false } = options;
  if (!url) return null;

  // Hindari duplikat
  if (document.getElementById('uk-music-player')) return;

  const wrap = document.createElement('div');
  wrap.id = 'uk-music-player';
  wrap.innerHTML = `
    <button type="button" id="uk-music-btn" aria-label="Play/Pause musik" title="${title}">
      <i class="fa-solid fa-music" id="uk-music-icon"></i>
    </button>
    <audio id="uk-audio" loop preload="auto" src="${url}"></audio>
  `;
  document.body.appendChild(wrap);

  // Inject minimal styles
  if (!document.getElementById('uk-music-style')) {
    const style = document.createElement('style');
    style.id = 'uk-music-style';
    style.textContent = `
      #uk-music-player {
        position: fixed;
        bottom: 90px;
        right: 16px;
        z-index: 1100;
      }
      #uk-music-btn {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #fff;
        background: linear-gradient(135deg, #38bdf8, #f472b6, #a78bfa);
        box-shadow: 0 4px 20px rgba(244,114,182,0.45);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      #uk-music-btn:hover { transform: scale(1.08); }
      #uk-music-btn.playing {
        animation: uk-music-pulse 1.6s ease infinite;
      }
      #uk-music-btn.needs-tap {
        box-shadow: 0 0 0 0 rgba(244,114,182,0.6);
        animation: uk-music-ping 1.2s ease infinite;
      }
      @keyframes uk-music-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
      }
      @keyframes uk-music-ping {
        0% { box-shadow: 0 0 0 0 rgba(244,114,182,0.55); }
        70% { box-shadow: 0 0 0 14px rgba(244,114,182,0); }
        100% { box-shadow: 0 0 0 0 rgba(244,114,182,0); }
      }
    `;
    document.head.appendChild(style);
  }

  const audio = document.getElementById('uk-audio');
  const btn = document.getElementById('uk-music-btn');
  const icon = document.getElementById('uk-music-icon');

  function setPlaying(on) {
    if (on) {
      btn.classList.add('playing');
      btn.classList.remove('needs-tap');
      icon.className = 'fa-solid fa-pause';
    } else {
      btn.classList.remove('playing');
      icon.className = 'fa-solid fa-music';
    }
  }

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (e) {
      console.warn('Music play failed', e);
    }
  });

  audio.addEventListener('ended', () => setPlaying(false));
  audio.addEventListener('pause', () => { if (audio.paused) setPlaying(false); });
  audio.addEventListener('play', () => setPlaying(true));

  if (autoplay) {
    // Coba autoplay; jika diblokir browser, minta tap
    audio.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      btn.classList.add('needs-tap');
      icon.className = 'fa-solid fa-music';
    });
  }

  return { audio, btn };
}

/** Unlock musik untuk project (potong saldo Rp500) */
async function unlockProjectMusic(projectDocId, userId) {
  if (!db) return { success: false, error: 'Database belum siap' };

  try {
    const userRef = db.collection('users').doc(userId);
    const projRef = db.collection('projects').doc(projectDocId);

    const result = await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const projSnap = await tx.get(projRef);
      if (!userSnap.exists) throw new Error('User tidak ditemukan');
      if (!projSnap.exists) throw new Error('Project tidak ditemukan');

      const saldo = userSnap.data().balance || 0;
      if (saldo < MUSIC_UNLOCK_PRICE) {
        throw new Error('Saldo tidak cukup. Top up minimal Rp' + MUSIC_UNLOCK_PRICE);
      }

      const proj = projSnap.data();
      if (proj.musicEnabled) {
        return { already: true };
      }

      tx.update(userRef, { balance: saldo - MUSIC_UNLOCK_PRICE });
      tx.update(projRef, {
        musicEnabled: true,
        musicUnlockedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { already: false, newSaldo: saldo - MUSIC_UNLOCK_PRICE };
    });

    if (result.already) return { success: true, already: true };
    return { success: true, newSaldo: result.newSaldo };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
