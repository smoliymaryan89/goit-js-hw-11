import refs from '/src/js/refs.js';

export default function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3.1,
    behavior: 'smooth',
  });
}
