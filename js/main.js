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
  searchFormInput = document.querySelector('.search__form-input'),
  preloader = document.querySelector('.preloader'),
  dropdown = document.querySelectorAll('.dropdown'),
  tvShowsHead = document.querySelector('.tv-shows__head'),
  posterWrapper = document.querySelector('.poster__wrapper'),
  modalContent = document.querySelector('.modal__content'),
  pagination = document.querySelector('.pagination');

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
    this.temp = `${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`;
    return this.getData(this.temp);
  }

  getNextPage = page => {
    return this.getData(this.temp + '&page=' + page);
  }

  getTvShow = (id) => {
    return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
  }

  getTopRated = () => this.getData(`${SERVER}/tv/top_rated?api_key=${API_KEY}&language=ru-RU`);

  getPopular = () => this.getData(`${SERVER}/tv/popular?api_key=${API_KEY}&language=ru-RU`);

  getToday = () => this.getData(`${SERVER}/tv/airing_today?api_key=${API_KEY}&language=ru-RU`);

  getWeek = () => this.getData(`${SERVER}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU`);
}

const dbService = new DBService();


const renderCard = (response, target) => {
  console.log(response);
  tvShowsList.textContent = '';

  if(!response.total_results){
  	loading.remove();
  	tvShowsHead.textContent = 'По вашему запросу ничего не найдено.';
  	tvShowsHead.style.cssText = 'color: red; font-size: 20px';
  	return;
  }

  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
  tvShowsHead.style.cssText = '';

  response.results.forEach(item => {
    const { 
        backdrop_path: backdrop, 
        name: title, 
        poster_path: poster, 
        vote_average: vote,
        id 
      } = item;

      console.log(typeof('vote'))
    
    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop: 's';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '' ;

    const card = document.createElement('li');
    card.idTV = id;
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
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
	pagination.textContent = '';
  if(!target && response.total_pages > 1){
  	for (let i = 1; i <= response.total_pages; i++ ){
  		pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
  	}
  }
};
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  
  if(value){
  	tvShows.append(loading);
    dbService.getSearchResult(value).then(renderCard);
  }
})


//открытие - закрытие меню
const closeDropDown = () => {
	dropdown.forEach( (item) => {
		item.classList.remove('active');
	})
};

hamburger.addEventListener('click',() => { 
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropDown();
});

document.body.addEventListener('click', (event) => {
  if(!event.target.closest('.left-menu')){
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    closeDropDown();
  }
});

leftMenu.addEventListener('click', (event) => {
	event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');

  if(dropdown){
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if(target.closest('#top-rated')){
  	tvShows.append(loading);
  	dbService.getTopRated().then((response) => renderCard(response, target));
  }

  if(target.closest('#popular')){
  	tvShows.append(loading);
  	dbService.getPopular().then((response) => renderCard(response, target));
  }

  if(target.closest('#today')){
  	tvShows.append(loading);
  	dbService.getToday().then((response) => renderCard(response, target));
  }

  if(target.closest('#week')){
  	tvShows.append(loading);
  	dbService.getWeek().then((response) => renderCard(response, target));
  }

  if(target.closest('#search')){
  	tvShowsList.textContent = '';
  	tvShowsHead.textContent = '';
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
  	preloader.style.display="block";
    dbService.getTvShow(card.id)
        .then(({ 
        	poster_path: posterPath, 
        	name: title, 
        	genres, 
        	vote_average: voteAverage, 
        	overview, 
        	homepage }) => {

        	if(posterPath){
        		tvCardImg.src = IMG_URL + posterPath;
        		tvCardImg.alt = title;
        		posterWrapper.style.display = '';
        		modalContent.style.paddingLeft = '';
        	}else{
        		posterWrapper.style.display = 'none';
        		modalContent.style.paddingLeft = '25px';
        	}
          modalTitle.textContent = title;
          /*genresList.innerHTML = response.genres.reduce((acc, item) => {
            return `${acc}<li>${item.name}</li>`
          }, '');*/
          genresList.textContent = '';
          for (const item of genres){
            genresList.innerHTML += '<li>' + item.name + '</li>';
          }
          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
        })
      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide'); 
      })
      .finally(() => {
      	preloader.style.display="none";
      });
		}
});

/*закрытие модалки*/
modal.addEventListener('click', (event) => {
  if(event.target.closest('.cross') || event.target.classList.contains('modal')){
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
})

pagination.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  if(target.classList.contains('pages')){
    tvShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard);
  }
})
