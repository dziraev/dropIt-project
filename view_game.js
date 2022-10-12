class View {
    constructor({model, data}) {
		this.model = model;
		this.data = data;
    }

	run() {
		this.saveLocalStorage()
		if(this.isMobile().isMobile && this.isMobile().isIOS ) {
			document.body.classList.add('_touch', '_ios')
		} else if (this.isMobile().isMobile) {
			document.body.classList.add('_touch')
		} else {
			document.body.classList.add('_pc')
		}

		const buttonsArr = document.querySelectorAll('.game__button');

		buttonsArr.forEach(btn => {
			if (btn.classList.contains('game__button_play')) {
				btn.addEventListener('click', () => {
					window.location.hash = 'Play'
				})

			}
			if (btn.classList.contains('game__button_settings')) {
				const sectionSettings = document.querySelector('.modal_settings');
				const formSettings = sectionSettings.querySelector('.settings')
				sectionSettings.onclick = this.closeModal.bind(this, sectionSettings);
				btn.addEventListener('click', this.openModal.bind(this, sectionSettings));
				btn.addEventListener('click', this.showModalSettings.bind(this, formSettings));
				formSettings.addEventListener('change', (e) => {
					if (e.target.getAttribute('id') === 'sound') {
						this.model.sound = e.target.checked
					}
					if (e.target.getAttribute('id') === 'vibration') {
						this.model.vibration = e.target.checked
					}
					if (e.target.getAttribute('id') === 'buttons') {
						this.model.control = e.target.value;
					}
					if ( e.target.getAttribute('id') === 'accelerometer') {
						this.model.control = e.target.value;
					}
					this.saveLocalStorage()
				})
			}
			if (btn.classList.contains('game__button_restart')) {
				btn.addEventListener('click', () => {
					window.location.hash = 'Play'
				})
			}
			if (btn.classList.contains('game__button_menu')) {
				btn.addEventListener('click', () => {
					window.location.hash = 'Menu'
				})
			}
			if (btn.classList.contains('game__button_balls')) {
				const sectionBalls = document.querySelector('.modal_balls');
				const formBalls = sectionBalls.querySelector('.balls')
				sectionBalls.onclick = this.closeModal.bind(this, sectionBalls);
				btn.addEventListener('click', this.openModal.bind(this, sectionBalls));
				btn.addEventListener('click', this.showModalBalls.bind(this, formBalls));
				formBalls.addEventListener('change', (e) => { //установка мяча
					this.model.ball = e.target.value + '.svg';
					this.saveLocalStorage()
				})
			}
		})

		window.addEventListener('keydown', (e) => {
			const openModal = document.querySelector('.modal._active');
			if (openModal && e.code === 'Escape') openModal.classList.remove('_active');
		})

	}
	showModalBalls(form, e) {
		e.preventDefault()
		form.innerHTML = ''
		form.closest('body').style.overflow='hidden';
		this.data.balls.forEach((ball, i) => {
			const ballItem = document.createElement('div');
			ballItem.classList.add('balls__item');

			const ballInput = document.createElement('input');
			ballInput.classList.add('balls__input');
			ballInput.setAttribute('id', `ball-${i}`);
			ballInput.setAttribute('type', 'radio');
			ballInput.setAttribute('name', 'balls');
			ballInput.setAttribute('value', `ball-${i}`);
			if (this.model.ball === this.data.balls[i]) {
				ballInput.setAttribute('checked', 'true')
			}

			const ballLabel = document.createElement('label');
			ballLabel.classList.add('balls__label')
			ballLabel.setAttribute('for', `ball-${i}`);
			ballLabel.style.backgroundImage = `url(img/ball-${i}.svg)`;

			ballItem.append(ballInput, ballLabel);
			form.append(ballItem)
		})
	}

	showModalSettings(form, e) {
		form.closest('body').style.overflow='hidden';
		e.preventDefault();

		//SOUND
		const sound = document.createElement('div');
		sound.classList.add('settings__line');

		const soundInput = document.createElement('input');
		soundInput.classList.add('settings__input');
		soundInput.setAttribute('id', 'sound');
		soundInput.setAttribute('type', 'checkbox');
		soundInput.setAttribute('value', 'on');

		const soundLabel = document.createElement('label');
		soundLabel.classList.add('settings__label');
		soundLabel.setAttribute('for', 'sound')
		soundLabel.textContent = 'Sound';
		sound.append(soundInput, soundLabel);
		if (this.model.sound === true) {
			soundInput.setAttribute('checked', 'true');
		}

		//VIBRATION
		const vibration = document.createElement('div');
		vibration.classList.add('settings__line', 'settings__line_vibration');

		const vibrationInput = document.createElement('input');
		vibrationInput.classList.add('settings__input');
		vibrationInput.setAttribute('id', 'vibration');
		vibrationInput.setAttribute('type', 'checkbox');
		if (this.model.vibration === true) {
			vibrationInput.setAttribute('checked', 'true');
		}

		const vibrationLabel = document.createElement('label');
		vibrationLabel.classList.add('settings__label');
		vibrationLabel.setAttribute('for', 'vibration')
		vibrationLabel.textContent = 'vibration'
		vibration.append(vibrationInput, vibrationLabel)

		//CONTROL
		const control = document.createElement('div');
		control.classList.add('settings__line', 'radio');
		const controlTitle = document.createElement('h2');
		controlTitle.classList.add('radio__title');
		controlTitle.textContent = 'Control';
		control.append(controlTitle)

		const options = ['buttons', 'accelerometer']

		for (let i = 0; i < 2; i++) {
			const controlItem = document.createElement('div');
			controlItem.classList.add('radio__item')
			//INPUT
			const controlInput = document.createElement('input');
			controlInput.classList.add('radio__input');
			controlInput.setAttribute('id', `${options[i]}`);
			controlInput.setAttribute('name', `control`);
			if(this.model.control === options[i]) {
				controlInput.setAttribute('checked', `true`);
			}
			controlInput.setAttribute('value', `${options[i]}`);
			controlInput.setAttribute('type', `radio`);
			//LABEL
			const controlLabel = document.createElement('label');
			controlLabel.classList.add('radio__label');
			controlLabel.setAttribute('for', `${options[i]}`)
			controlLabel.textContent = options[i]
			controlItem.append(controlInput, controlLabel)
			control.append(controlItem)
			}

			form.innerHTML = '';
			form.append(sound, control, vibration);

		}
	openModal(modal, e) {
		modal.classList.add('_active')
	}

	closeModal(modal, e) {
		if (modal.classList.contains('_active') && (e.target === modal || e.target.hasAttribute('data-close'))) {
			modal.classList.remove('_active')
			modal.closest('body').style.overflow = ''

		}

	}
	saveLocalStorage() {
		localStorage.setItem('dropIt', JSON.stringify(this.model));
	}

	isMobile() {
			const isAndroid= () => {
				return navigator.userAgent.match(/Android/i);
			};

		    const isIOS = () => {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			};
			const isOpera = () => {
				return navigator.userAgent.match(/Opera Mini/i);
			};
			const isWindows = () => {
				return navigator.userAgent.match(/IEMobile/i);
			}

		return {
				isMobile: (isAndroid() || isIOS() || isOpera() || isWindows()),
				isIOS: isIOS()
		}
	}

}

