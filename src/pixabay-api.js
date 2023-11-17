import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PixabayAPI {
  constructor() {
    this.query = null;
    this.page = 1;
  }

  getPhotosByQuery() {
    const axiosOptions = {
      params: {
        key: '40710961-6059c47a2227fd63de52df13c',
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    };
    return axios
      .get('', axiosOptions)
      .then(res => res.data)
      .catch(err => console.log(err));
  }
}
