// Katalog template — memakai products.js

document.addEventListener('DOMContentLoaded', async () => {
  // Render semua produk
  await renderProductsTo('templateGrid');

  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter; // all | free | paid
      await renderProductsTo('templateGrid', {
        filter: filter === 'all' ? null : filter
      });
    });
  });
});
