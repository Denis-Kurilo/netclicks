const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = 'c00d158bd1fa520af96d5b2e746c3c21';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvCard = document.querySelectorAll('.tv-card'),
  tvCardImg = document.querySelector('.tv-card__img'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  cross = document.querySelector('.cross'),
  tvShows = document.querySelector('.tv-shows'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input');


const loading = document.createElement('div');

loading.className = 'loading';
console.log(loading)

const DBService = class {
  getData = async (url) => {
    const res = await fetch(url);

    if(res.ok){
      return res.json();
    } else{
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  }

  getTestData = async () => {
    return this.getData('test.json');
  }

  getTestCard = async () => {
    return this.getData('card.json');
  }

  getSearchResult = (query) => {
    return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
  }

  getTvShow = (id) => {
    return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    
  }
}


const renderCard = response => {
  console.log(response);
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    const { 
        backdrop_path: backdrop, 
        name: title, 
        poster_path: poster, 
        vote_average: vote 
      } = item;

      console.log(typeof('vote'))
    
    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop: 's';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '' ;

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
               src="${posterIMG}"
               data-backdrop="${backdropIMG}"
               alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    loading.remove();
    tvShowsList.append(card)
  })
}
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  
  if(value){
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
})


//открытие - закрытие меню
hamburger.addEventListener('click',() => { 
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.body.addEventListener('click', (event) => {
  if(!event.target.closest('.left-menu')){
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');

  }
});

leftMenu.addEventListener('click', (event) => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');

  if(dropdown){
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

//Смена карточек
const changeImage = (event) => {
  const card = event.target.closest('.tv-shows__item');

  if(card){
    const img = card.querySelector('.tv-card__img');
    if(img.dataset.backdrop){
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
}
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

//Открытие модального окна
tvShowsList.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');
  if(card){
    new DBService().getTestCard()
        .then(response => {
          tvCardImg.src = IMG_URL + response.poster_path;
          modalTitle.textContent = response.name;
          /*genresList.innerHTML = response.genres.reduce((acc, item) => {
            return `${acc}<li>${item.name}</li>`
          }, '');*/
          genresList.textContent = '';
          for (const item of response.genres){
            genresList.innerHTML += `<li>${item.name}</li>`;
          }
          rating
          description
          modalLink
        })
        .then(() => {
          document.body.style.overflow = 'hidden';
          modal.classList.remove('hide'); 
        })
  }
});

//закрытие модалки
modal.addEventListener('click', (event) => {
  if(event.target.closest('.cross') || event.target.classList.contains('modal')){
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
})

