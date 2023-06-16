import refs from '/src/js/refs.js';

export default function createGalleryMarkup(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card js-card">
        <a href="${largeImageURL}" class='gallery__link'>
          <img src="${webformatURL}" alt="${tags}" loading="lazy" width='350' height='215'/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>
    `
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
