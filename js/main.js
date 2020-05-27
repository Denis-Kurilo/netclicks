const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
	  hamburger = document.querySelector('.hamburger'),
	  tvCard = document.querySelectorAll('.tv-card'),
    tvCardImg = document.querySelectorAll('.tv-card__img'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    cross = document.querySelector('.cross');

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
}

const renderCard = response => {
	console.log(response);
	tvShowsList.textContent = '';

	response.results.forEach(item => {
		const { backdrop_path: backdrop, name: title, poster_path: poster, vote_average: vote } = item;
		console.log(item)
		const card = document.createElement('li');
		card.className = 'tv-shows__item';
		card.innerHTML = `
			<a href="#" class="tv-card">
	        <span class="tv-card__vote">${vote}</span>
	        <img class="tv-card__img"
	             src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/fhV9ckyBko1ZejEEmwdiXG8YMy5.jpg"
	             data-backdrop="https://image.tmdb.org/t/p/w185_and_h278_bestv2/AdJgkXb8oLI8e4rsk8XzkvABIuw.jpg"
	             alt="${title}">
	        <h4 class="tv-card__head">${title}</h4>
	    </a>
		`;
		tvShowsList.append(card)
		console.log(card)
	})
}
new DBService().getTestData().then(renderCard);

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
tvCardImg.forEach((item) => {
	let imgSrc = item.getAttribute('src');
	let imgData = item.getAttribute('data-backdrop');
	item.addEventListener('mousemove', () => {
		item.setAttribute('src', imgData);
	});

	item.addEventListener('mouseout', () => {
		item.setAttribute('src', imgSrc);
	});
});

//Открытие модального окна
tvShowsList.addEventListener('click', (event) => {
	event.preventDefault();
	const target = event.target;
	const card = target.closest('.tv-card');
	if(card){
		document.body.style.overflow = 'hidden';
		modal.classList.remove('hide');
	}
});

//закрытие модалки
modal.addEventListener('click', (event) => {
	if(event.target.closest('.cross') || event.target.classList.contains('modal')){
		document.body.style.overflow = '';
		modal.classList.add('hide');
	}
})

