//== 2.1 разметка страницы с карточками
//== 2.5. Lazyload

export default function cardTemplate({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) {
  return `
  
  <div class='photo-card'>
  <a class="photo-card__item" href='${largeImageURL}'>
    <img class='gallery__img lazyload'
    data-src='${webformatURL}' 
    alt='${tags}' 
    loading='lazy' 
    width='300'/>
  
  <div class='info'>
    <p class='info__item'>
      <b>Likes</b>
      ${likes}
    </p>
    <p class='info__item'>
      <b>Views</b>
      ${views}
    </p>
    <p class='info__item'>
      <b>Comments</b>
      ${comments}
    </p>
    <p class='info__item'>
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`
}

