import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayAPIService from '/src/js/PixabayAPIService';
import createGalleryMarkup from '/src/js/createGalleryMarkup.js';
import refs from '/src/js/refs.js';

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

refs.form.addEventListener('submit', onFormSubmit);

const pixabayApiService = new PixabayAPIService();
const observer = new IntersectionObserver(onLoadMoreData, options);
let isObserverEnabled = true;

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

    createGalleryMarkup(hits);

    if (hits.length < 40) {
      isObserverEnabled = false;
      lightbox.refresh();
      Notify.success(`Hooray! We found ${totalHits} images.`);
      return;
    } else {
      isObserverEnabled = true;
      observer.observe(refs.guard);
    }

    lightbox.refresh();

    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.error('Error occurred while fetching images:', error);
    Notify.failure('Failed to fetch images. Please try again later.');
  }
}

async function onLoadMoreData(entries, observer) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      pixabayApiService.incrementPage();
      try {
        const { hits, totalHits } = await pixabayApiService.getImages();
        createGalleryMarkup(hits);

        lightbox.refresh();
        if (
          totalHits > 0 &&
          pixabayApiService.page > totalHits / pixabayApiService.perPage
        ) {
          observer.unobserve(refs.guard);
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } catch (err) {
        console.log(err);
      }
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
