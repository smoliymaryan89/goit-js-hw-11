import { Notify } from 'notiflix';
import PixabayApiService from '/src/PixabayApiService';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

let isEndOfResults = false;

refs.form.addEventListener('submit', onFormSubmit);

const pixabayApiService = new PixabayApiService();

async function onFormSubmit(event) {
  event.preventDefault();

  const inputValue = event.currentTarget.searchQuery.value.trim();
  if (inputValue === '') {
    Notify.warning('Empty query!');
    return;
  }

  pixabayApiService.setSearchValue(inputValue);

  clearGallery();
  pixabayApiService.resetPage();

  try {
    const { hits, totalHits } = await pixabayApiService.getImages();

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));

    lightbox.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.error('Error occurred while fetching images:', error);
    Notify.failure('Failed to fetch images. Please try again later.');
  }
}

function createGalleryMarkup(data) {
  return data
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
      <div class="photo-card">
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
}

window.addEventListener('scroll', onScroll);

async function onScroll() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    try {
      const { hits } = await pixabayApiService.getImages();

      if (hits.length === 0 && !isEndOfResults) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        isEndOfResults = true;
        return;
      }

      refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      lightbox.refresh();
    } catch (error) {
      console.error('Error occurred while fetching images:', error);
      Notify.failure('Failed to fetch images. Please try again later.');
    }
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
