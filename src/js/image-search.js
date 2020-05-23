`use strict`;

import imageSearchServices from './apiService';
import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import imageCard from '../template/image-card.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  button: document.querySelector('button[data-action="load-more"]'),
  image: document.querySelector('#gallery_image'),
};

refs.searchForm.addEventListener('submit', searchFormSubmitHandler);
refs.button.addEventListener('click', loadMoreBtnHandler);
refs.gallery.addEventListener('click', handleOriginalImage);


function handleOriginalImage(e) {
  basicLightbox
  .create(`<img src="${e.target.dataset.source}" width="100%">`)
  .show();
}

function searchFormSubmitHandler(e) {
  e.preventDefault();

  imageSearchServices.page;

  const form = e.currentTarget;
  const input = form.elements.query;

  clearListItems();

  imageSearchServices.resetPage();
  imageSearchServices.serchQuery = input.value;
  fetchImages();

  input.value = '';
}

function fetchImages() {
  imageSearchServices
    .fetchImages()
    .then(images => {
      insertListItems(images);
    })
    .catch(error => console.warn(error));
}

function insertListItems(images) {
  const markup = imageCard(images);

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearListItems() {
  refs.gallery.innerHTML = '';
}

function loadMoreBtnHandler() {
  if (imageSearchServices.page > 1) {
    imageSearchServices.fetchImages().then(images => {
      insertListItems(images);
      window.scrollTo({
        top: window.scrollY,
        behavior: 'smooth',
      });
    });
  }
}