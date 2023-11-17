import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

const pixabayAPI = new PixabayAPI();

refs.searchFormEl.addEventListener('submit', onFormSumbit);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

function photoTemplate({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="photo-card">
        <div class="img-container"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${downloads}
            </p>
        </div>
    </div>
    `;
}

function photoesTemplate(photoArr) {
  return photoArr.map(photoTemplate).join('');
}

function renderPhotos(photoArr) {
  const markup = photoesTemplate(photoArr);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

async function onFormSumbit(event) {
  event.preventDefault();

  const { target: searchFormEl } = event;

  pixabayAPI.query = searchFormEl.elements.searchQuery.value;
  pixabayAPI.page = 1;

  try {
    const data = await pixabayAPI.getPhotosByQuery();
    console.log(data);
    console.log(data.hits);
    if (data.total === 0) {
      refs.galleryEl.innerHTML = '';

      refs.loadMoreBtnEl.classList.add('is-hidden');

      refs.searchFormEl.reset();

      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (data.totalHits === 1) {
      renderPhotos(data.hits);
      refs.loadMoreBtnEl.classList.add('is-hidden');

      return;
    }
    renderPhotos(data.hits);
    refs.loadMoreBtnEl.classList.remove('is-hidden');
    Notify.success(`Hooray! We found ${data.totalHits} images`);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  try {
    const data = await pixabayAPI.getPhotosByQuery();
    console.log(data);
    console.log(data.hits);

    renderPhotos(data.hits);

    if (data.hits.length === 0) {
      refs.loadMoreBtnEl.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}
