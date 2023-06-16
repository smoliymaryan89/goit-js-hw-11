import axios from 'axios';

export default class PixabayAPIService {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '37098100-c1f03ed35a5bcbe47235bac6b';

  constructor() {
    this.page = 1;
    this.searchValue = '';
    this.perPage = 40;
  }

  async getImages() {
    const response = await axios.get(`${this.#BASE_URL}?`, {
      params: {
        key: this.#API_KEY,
        page: this.page,
        q: this.searchValue,
        per_page: this.perPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    // this.incrementPage();
    return response.data;
  }

  setSearchValue(query) {
    this.searchValue = query;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
