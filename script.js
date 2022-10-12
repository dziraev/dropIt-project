(function () {

	location.hash = '';

	let data;

	let model;

	const AJAX = () => {
		const stringName        = 'DZIRAEV_DMITRYDROPIT';
		const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
		let sp                  = new URLSearchParams();
		sp.append('f', 'READ');
		sp.append('n', stringName);

		return fetch(ajaxHandlerScript, {method: 'post', body: sp})
			.then(response => response.json())
			.then(result => {
				data = JSON.parse(result.result)
			})
			.catch(error => {
				console.error(error);
			});
	};

	const loadLocalStorage = new Promise((resolve) => {
		const nameGame = 'dropIt'
		const getLs    = localStorage.getItem(nameGame)
		if (getLs) {
			model = JSON.parse(getLs);
		} else {
			model = {
				ball: 'ball-0.svg',
				sound: true,
				vibration: false,
				control: 'buttons',
			}
		}
		resolve(true)
	})

	const renderGame       = () => {
		new Image(`img/${data.background}`)
		data.balls.forEach((ballSrc) => {
			let img = new Image();
			img.src = "img/" + ballSrc;

		});

		const gameView = new View({model, data})
		gameView.run()
		location.hash = "Menu";
	}
	Promise.all([AJAX(), false, loadLocalStorage]).then(result => {

		setTimeout(renderGame, 1000)
	})
}())