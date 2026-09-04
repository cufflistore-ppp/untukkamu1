document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const notFound = document.getElementById('notFound');
  const frame = document.getElementById('projectFrame');
  
  if (!code) {
    hideLoader();
    notFound.classList.remove('hidden');
    return;
  }
  
  // Try load from Firestore
  let project = null;
  
  if (db) {
    try {
      const snap = await db.collection('projects').where('code', '==', code).limit(1).get();
      if (!snap.empty) {
        project = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  // Demo fallback for sample codes
  if (!project) {
    // Allow preview of templates directly
    const templateMap = {
      'DEMO001': { templateId: 'untuk-kamu', isFree: true, data: {} },
      'DEMO002': { templateId: 'nembak', isFree: false, data: {} }
    };
    project = templateMap[code];
  }
  
  if (!project) {
    hideLoader();
    notFound.classList.remove('hidden');
    return;
  }
  
  // Build template URL with data
  const templateId = project.templateId || 'untuk-kamu';
  const data = project.data || {};
  const qs = new URLSearchParams();
  
  if (data.title) qs.set('title', data.title);
  if (data.recipient || data.name) qs.set(data.recipient ? 'recipient' : 'name', data.recipient || data.name);
  if (data.message) qs.set('message', data.message);
  if (data.photo) qs.set('photo', data.photo);
  
  // Hide branding for paid projects
  if (!project.isFree && project.price > 0) {
    qs.set('hideBranding', '1');
  }
  
  const url = `templates/${templateId}/template.html?${qs.toString()}`;
  frame.src = url;
  frame.classList.remove('hidden');
  hideLoader();
  
  // Update page title
  document.title = (project.name || 'Project') + ' — 𝓤𝓷𝓽𝓾𝓴 𝓚𝓪𝓶𝓾';
});
