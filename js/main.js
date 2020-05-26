//menu
const leftMenu = document.querySelector('.left-menu'),
	  hamburger = document.querySelector('.hamburger'),
	  tvCard = document.querySelectorAll('.tv-card'),
      tvCardImg = document.querySelectorAll('.tv-card__img');
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
