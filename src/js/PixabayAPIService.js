import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37098100-c1f03ed35a5bcbe47235bac6b';

export class PixabayAPIService {
  constructor() {
    this.page = 1;
    this.searchValue = '';
  }

  async getImages() {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    this.incrementPage();
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
