"use strict";


window.onhashchange = switchToStateFromURLHash;


// текущее состояние приложения
// это Model из MVC
const SPAState = {};

// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы
// читает новое состояние приложения из закладки УРЛа
// и обновляет ВСЮ вариабельную часть веб-страницы
// соответственно этому состоянию
// это упрощённая реализация РОУТИНГА - автоматического выполнения нужных
// частей кода в зависимости от формы URLа
// "роутинг" и есть "контроллер" из MVC - управление приложением через URL
function switchToStateFromURLHash() {
	const URLHash  = window.location.hash;
	const gameCnr  = document.querySelector('.game__container');
	const Load     = document.querySelector('.game__load');
	const Menu     = document.querySelector('.game__menu');
	const Play     = document.querySelector('.game__play');
	const GameOver = document.querySelector('.game__menu.game__menu_game-over');

	// убираем из закладки УРЛа решётку
	// (по-хорошему надо ещё убирать восклицательный знак, если есть)
	let stateStr = URLHash.slice(1);

	if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
		let parts         = stateStr.split("_");
		SPAState.pagename = parts[0]; // первая часть закладки - номер страницы
	} else {
		SPAState.pagename = 'Load'; // иначе показываем главную страницу
	}
	switch (SPAState.pagename) {

		case 'Load':
			Menu.classList.add("_hidden");
			Play.classList.add('_hidden');
			GameOver.classList.add('_hidden');
			Play.innerHTML = '';
			break;
		case 'Menu':
			Menu.classList.remove("_hidden");
			Load.classList.add('_hidden')
			Play.classList.add('_hidden');
			GameOver.classList.add('_hidden');
			Play.innerHTML = '';
			break;
		case 'Play':
			Menu.classList.add("_hidden");
			GameOver.classList.add('_hidden');
			Play.classList.remove('_hidden')
			const cnv = document.createElement('canvas');
			const ctx = cnv.getContext('2d');
			if (window.innerWidth < 991.98) {
				cnv.width  = innerWidth
				cnv.height = innerHeight
			} else {
				cnv.width  = innerWidth * 0.3;
				cnv.height = innerHeight * 0.8;
			}
			Play.append(cnv);
			let game = new Game({
				cnr: gameCnr,
				ctx: ctx,
				cnvWidth: cnv.width,
				cnvHeight: cnv.height,
				pipePosY: cnv.height,
				pipeHeight: 20,
				pipeColor: '#ff4040ff',
				pipeVelocity: 5,
				ballPosX: Math.random() * cnv.width + cnv.width * 0.1,
				ballPosY: cnv.height * 0.1,
				radius: 15,
				ballVelocity: 5,
				rotationSpeed: 15,
				model: JSON.parse(localStorage.getItem('dropIt'))
			})
			setTimeout(game.runGame.bind(game), 100)
			break;
		case 'GameOver':
			GameOver.classList.remove('_hidden')
			Play.classList.add('_hidden')
			Play.innerHTML = '';
			break;

	}
}
