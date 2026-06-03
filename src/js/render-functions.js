export function renderGallery(images, container) {
  const markup = images
    .map(img => `
      <li class="gallery-item">
        <a href="${img.largeImageURL}">
          <img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" />
        </a>
        <div class="info">
          <div class="info-item"><b>Likes</b><span>${img.likes}</span></div>
          <div class="info-item"><b>Views</b><span>${img.views}</span></div>
          <div class="info-item"><b>Comments</b><span>${img.comments}</span></div>
          <div class="info-item"><b>Downloads</b><span>${img.downloads}</span></div>
        </div>
      </li>`)
    .join('');

  container.insertAdjacentHTML('beforeend', markup);
}