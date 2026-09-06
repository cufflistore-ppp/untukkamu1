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
  },
  'cinta-romantis': {
    id: 'deep-romance',
    title: 'Deep Romance',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'valentine': {
    id: 'valentine-hearts',
    title: 'Valentine Hearts',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'anniversary': {
    id: 'anniversary-soft',
    title: 'Years Together',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'wisuda': {
    id: 'graduation-proud',
    title: 'Proud Moment',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'maaf': {
    id: 'sorry-gentle',
    title: 'Gentle Apology',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'terima-kasih': {
    id: 'thank-you-warm',
    title: 'Warm Thanks',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'untuk-pacar': {
    id: 'untuk-pacar-track',
    title: 'Sweet For You',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'pesan-cinta': {
    id: 'pesan-cinta-track',
    title: 'Love Note',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'rindu': {
    id: 'rindu-track',
    title: 'Missing You',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'jadian': {
    id: 'jadian-track',
    title: 'Together Day',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'ldt': {
    id: 'ldt-track',
    title: 'Distance Love',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'good-night': {
    id: 'good-night-track',
    title: 'Night Soft',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'good-morning': {
    id: 'good-morning-track',
    title: 'Morning Light',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'proposal': {
    id: 'proposal-track',
    title: 'Will You',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'untuk-sahabat': {
    id: 'untuk-sahabat-track',
    title: 'True Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'bestie': {
    id: 'bestie-track',
    title: 'Bestie Vibes',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'bestod': {
    id: 'bestod-track',
    title: 'Bro Bond',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'teman-sekolah': {
    id: 'teman-sekolah-track',
    title: 'School Days',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'teman-kerja': {
    id: 'teman-kerja-track',
    title: 'Work Mate',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'circle': {
    id: 'circle-track',
    title: 'Our Circle',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'teman-jauh': {
    id: 'teman-jauh-track',
    title: 'Far Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'teman-baru': {
    id: 'teman-baru-track',
    title: 'New Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'selamat-ulang-tahun-sahabat': {
    id: 'selamat-ulang-tahun-sahabat-track',
    title: 'Birthday Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3'
  },
  'selamat-ulang-tahun-pacar': {
    id: 'selamat-ulang-tahun-pacar-track',
    title: 'Birthday Love',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'selamat-wisuda-sahabat': {
    id: 'selamat-wisuda-sahabat-track',
    title: 'Grad Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'semangat': {
    id: 'semangat-track',
    title: 'Cheer Up',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'bangga': {
    id: 'bangga-track',
    title: 'Proud Of You',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3'
  },
  'dukungan': {
    id: 'dukungan-track',
    title: 'I Got You',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'miss-you': {
    id: 'miss-you-track',
    title: 'Miss You',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'just-because': {
    id: 'just-because-track',
    title: 'Just Because',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'salam-kenal': {
    id: 'salam-kenal-track',
    title: 'Nice To Meet',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'teman-lama': {
    id: 'teman-lama-track',
    title: 'Old Friend',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'crush': {
    id: 'crush-track',
    title: 'Crush Soft',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3'
  },
  'mantan-baik': {
    id: 'mantan-baik-track',
    title: 'Peaceful Close',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  },
  'keluarga': {
    id: 'keluarga-track',
    title: 'Family Warm',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
  },
  'orang-tua': {
    id: 'orang-tua-track',
    title: 'Parents Love',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3'
  }
};

const CATEGORY_MUSIC = {
  romance: { id: 'cat-romance', title: 'Romance Soft', url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91740cf291.mp3?filename=sweet-love-121597.mp3' },
  friendship: { id: 'cat-friend', title: 'Friendship Warm', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3' },
  personal: { id: 'cat-personal', title: 'Soft Personal', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3' },
  celebration: { id: 'cat-celeb', title: 'Celebration', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cda105851b.mp3?filename=happy-birthday-to-you-15487.mp3' },
  letter: { id: 'cat-letter', title: 'Quiet Letter', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=relaxing-145038.mp3' },
  family: { id: 'cat-family', title: 'Family Warm', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3' },
  holiday: { id: 'cat-holiday', title: 'Holiday Mood', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_191aa2c0b5.mp3?filename=inspiring-cinematic-ambient-116199.mp3' }
};

const DEFAULT_MUSIC = {
  id: 'default-soft',
  title: 'Soft Background',
  url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-background-music-40839.mp3'
};

function getMusicForTemplate(templateId, category) {
  // SELALU kembalikan object ber-url agar tidak ada template tanpa lagu
  let track = null;
  if (templateId && TEMPLATE_MUSIC[templateId]) track = TEMPLATE_MUSIC[templateId];
  else if (category && CATEGORY_MUSIC[category]) track = CATEGORY_MUSIC[category];
  else {
    const id = String(templateId || '');
    if (/pacar|cinta|valentine|crush|rindu|sayang|anniversary|jadian|ldt|proposal|video-cinta|miss|romantis/.test(id)) track = CATEGORY_MUSIC.romance;
    else if (/sahabat|bestie|bestod|bros|teman|circle|friend|curhat/.test(id)) track = CATEGORY_MUSIC.friendship;
    else if (/ibu|ayah|keluarga|anak|sepupu|orang-tua|kakek/.test(id)) track = CATEGORY_MUSIC.family;
    else if (/idul|natal|tahun-baru|imlek|kemerdekaan|kartini|halloween|waisak|nyepi|batik|pahlawan|sumpah/.test(id)) track = CATEGORY_MUSIC.holiday;
    else if (/ultah|wisuda|guru|lulus|ujian|promosi|kerja|ospek|sekolah|siswa|pendidikan/.test(id)) track = CATEGORY_MUSIC.celebration;
    else if (/surat|puisi|doa|pesan|letter|quote|rahasia|maaf|terima-kasih/.test(id)) track = CATEGORY_MUSIC.letter;
    else if (/video|premium/.test(id)) track = CATEGORY_MUSIC.romance;
    else track = TEMPLATE_MUSIC['untuk-kamu'] || CATEGORY_MUSIC.personal;
  }
  if (!track || !track.url) track = DEFAULT_MUSIC;
  return track;
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
