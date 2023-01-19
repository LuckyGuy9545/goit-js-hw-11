import galleryFetch from "./js/fetch-gallery"
import cardTemplate from './js/templates/cardMarkup';
import { Notify } from "notiflix";
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
    endCollectionText: document.querySelector('.end-collection-text'),
}

let searchQuery = '';
let currentPage = 1;
let currentHits = 0;

//== 2.2 робимо рендер розмітки для карток:
function cardImgMarkup(arr) {
    const markup = arr.map(item => cardTemplate(item)).join('');
    refs.gallery.insertAdjacentHTML("beforeend", markup);
}
//start Event listeners
refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
window.addEventListener('keydown', deleteOnBackspace);

//== 2.4. SimpleLightBox
let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSubmitForm(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.searchQuery.value;
    currentPage = 1;
    console.log(searchQuery);

    const response = await galleryFetch(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (!searchQuery) {
        return;
}

    if (!response.totalHits) {
        refs.gallery.innerHTML = '';
        refs.loadMoreBtn.classList.add('is-hidden');
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }

//== 3.1. 
    if (response.totalHits > 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
    } else {
        refs.loadMoreBtn.classList.add('is-hidden');
    }


    try {
//== 4.2.
        if (response.totalHits < 40) {
            refs.gallery.innerHTML = '';
            cardImgMarkup(response.hits);
            lightbox.refresh();
            refs.endCollectionText.classList.remove('is-hidden');
        return Notify.info("We're sorry, but you've reached the end of search results");
        } else if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`);
            refs.gallery.innerHTML = '';
            cardImgMarkup(response.hits);
            lightbox.refresh();
            refs.endCollectionText.classList.add('is-hidden');
        }

        if (response.totalHits === 0) {
           refs.gallery.innerHTML = '';
        return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.');
        }
//== 6.4. Smooth scroll
        if (window.pageYOffset > 400) {
            return smoothScroll();
        }

    } catch (error) {
        console.log(error);
    }

};
//== 6.4. Smooth scroll
function smoothScroll() {
const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * -100,
                behavior: "smooth",
            });
}

//== 6.3. 
async function onLoadMoreBtnClick() {
    currentPage += 1;
    const response = await galleryFetch(searchQuery, currentPage);
    cardImgMarkup(response.hits);
    lightbox.refresh();
    currentHits += response.hits.length;

    if (currentHits === response.totalHits) {
        refs.loadMoreBtn.classList.add('is-hidden');
//== 3.3.
        refs.endCollectionText.classList.remove('is-hidden');
    }
}

//== Backspace для зручності
function deleteOnBackspace(event) {
    if (event.code === 'Backspace') {
        refs.searchForm.elements.searchQuery.value = '';
    }
}


