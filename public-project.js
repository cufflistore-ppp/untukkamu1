document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const notFound = document.getElementById('notFound');
  const pinGate = document.getElementById('pinGate');
  const frame = document.getElementById('projectFrame');

  if (!code) {
    hideLoader();
    notFound.classList.remove('hidden');
    return;
  }

  let project = null;

  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection('projects').where('code', '==', code).limit(1).get();
      if (!snap.empty) {
        project = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!project) {
    const templateMap = {
      'DEMO001': { templateId: 'untuk-kamu', isFree: true, musicEnabled: false, accessCode: '', data: {} },
      'DEMO002': { templateId: 'nembak', isFree: false, musicEnabled: true, accessCode: '1234', data: {} }
    };
    project = templateMap[code];
  }

  if (!project) {
    hideLoader();
    notFound.classList.remove('hidden');
    return;
  }

  const storageKey = 'uk_pin_ok_' + code;
  const hasPin = !!(project.accessCode && String(project.accessCode).length >= 4);
  const alreadyOk = sessionStorage.getItem(storageKey) === '1';

  function openProject() {
    if (pinGate) pinGate.classList.add('hidden');
    const templateId = project.templateId || 'untuk-kamu';
    const data = project.data || {};
    const qs = new URLSearchParams();

    if (data.title) qs.set('title', data.title);
    if (data.recipient || data.name) qs.set(data.recipient ? 'recipient' : 'name', data.recipient || data.name);
    if (data.message) qs.set('message', data.message);
    if (data.photo) qs.set('photo', data.photo);

    if (!project.isFree && project.price > 0) {
      qs.set('hideBranding', '1');
    }

    const track = typeof getMusicForTemplate === 'function'
      ? getMusicForTemplate(templateId)
      : null;

    if (project.musicEnabled && track) {
      qs.set('music', '1');
      qs.set('musicUrl', track.url);
      if (typeof mountMusicPlayer === 'function') {
        mountMusicPlayer({
          url: track.url,
          title: track.title,
          autoplay: true
        });
      }
    }

    frame.src = `${templateId}.html?${qs.toString()}`;
    frame.classList.remove('hidden');
    hideLoader();
    document.title = (project.name || data.title || 'Project') + ' — 𝓤𝓷𝓽𝓾𝓴 𝓚𝓪𝓶𝓾';
  }

  // Default: tidak dikunci → langsung buka
  if (!hasPin || alreadyOk) {
    openProject();
    return;
  }

  // Ada kode → tampilkan form
  hideLoader();
  if (pinGate) pinGate.classList.remove('hidden');

  const input = document.getElementById('pinGateInput');
  const submit = document.getElementById('pinGateSubmit');
  const err = document.getElementById('pinGateError');

  function tryUnlock() {
    const val = (input.value || '').trim();
    if (val.length < 4) {
      err.textContent = 'Kode minimal 4 digit.';
      return;
    }
    if (val === String(project.accessCode)) {
      sessionStorage.setItem(storageKey, '1');
      err.textContent = '';
      err.classList.remove('show-err');
      openProject();
    } else {
      err.textContent = 'Kode salah. Coba lagi.';
      err.classList.remove('show-err');
      void err.offsetWidth;
      err.classList.add('show-err');
      input.classList.remove('pin-error');
      void input.offsetWidth;
      input.classList.add('pin-error');
      if (pinGate) {
        pinGate.classList.remove('pin-error-pop');
        void pinGate.offsetWidth;
        pinGate.classList.add('pin-error-pop');
      }
      input.value = '';
      input.focus();
      setTimeout(() => input.classList.remove('pin-error'), 600);
    }
  }

  if (submit) submit.addEventListener('click', tryUnlock);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });
    input.focus();
  }
});
