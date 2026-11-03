const viewer = document.getElementById('viewer');
const viewerImage = document.getElementById('viewer-image');

document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    viewerImage.src = button.dataset.image;
    viewerImage.alt = button.querySelector('img').alt;
    viewer.showModal();
  });
});

document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target === viewer) viewer.close();
});
