
class Pipe {
	constructor({ctx, cnvWidth, pipePosY, pipeHeight, pipeColor, pipeVelocity}) {
		//PIPE
		this.ctx = ctx;
		this.cnvWidth = cnvWidth;
		this.pipeLeftPosX = 0;
		this.pipePosY = pipePosY;
		this.pipeHeight = pipeHeight; //высота трубы
		this.pipeColor = pipeColor;   //цвет
		this.pipeVelocity = pipeVelocity; //ускорение
		this.pipeGap = cnvWidth * 0.15; //зазор
		this.pipeLeftWidth = this.cnvWidth  * (Math.random() * (0.5) + 0.2); // ширина левой части
		this.pipeRightPosX = this.pipeLeftWidth + this.pipeGap;  //Начальная координата Х правой части
		this.pipeRightWidth = this.cnvWidth - this.pipeLeftWidth - this.pipeGap // Ширина правой части

	}

	drawPipe() {
		this.ctx.fillStyle = this.pipeColor;
		this.ctx.fillRect(this.pipeLeftPosX, this.pipePosY, this.pipeLeftWidth, this.pipeHeight)
		this.ctx.fillRect(this.pipeRightPosX, this.pipePosY, this.pipeRightWidth, this.pipeHeight)
	}

	updatePipe() {
		this.drawPipe()
		this.pipePosY -= this.pipeVelocity;
	}
}


class Game {
	constructor({cnr, ctx, cnvWidth, cnvHeight, pipeLeftPosX, pipePosY, pipeHeight,
					pipeColor, pipeVelocity, ballPosX, ballPosY, radius,  ballVelocity, rotationSpeed, model}) {
		this.cnr = cnr,
		this.ctx = ctx;
		this.cnvWidth = cnvWidth; // ширина канваса
		this.cnvHeight = cnvHeight; // высота канваса
		this.model = model

		///PIPE
		this.pipeLeftPosX = pipeLeftPosX;
		this.pipePosY = pipePosY;
		this.pipeHeight = pipeHeight; //высота трубы
		this.pipeColor = pipeColor;   //цвет
		this.pipeVelocity = pipeVelocity; //ускорение

		//BALL
		this.image = new Image();
		this.image.src = `img/${model.ball}`;
		this.ballPosX = ballPosX;
		this.ballPosY = ballPosY;
		this.ballRadius = radius;
		this.ballVelocity = ballVelocity;
		this.ballGravity = 2;
		this.rotation = 0
		this.rotationSpeed = rotationSpeed;


		this.pipes = [];
		this.frames = 0;
		this.frame = 60;
		this.score = 0;
		this.keys = { //Состояние кнопок
			d: false,
			a: false,
			right: false,
			left: false,
			lastKey: '',
		}

		this.id = null;

		this.startMoveListenerByKey;
		this.endMoveListenerByKey;
		this.startMoveListenerByTouch;
		this.endMoveListenerByTouch;
		this.blockGamePlay; //Блок, где расположен канвас
		this.backGround = new Image();
		this.backGround.src = 'img/clouds.jpg'
		this.backGroundPosY = 0;

		//SOUND
		this.soundPoint = new Audio();
		this.soundPoint.src = 'audio/sfx_point.wav'
		this.soundLose = new Audio();
		this.soundLose.src = 'audio/lose.wav';

	}

	runGame() {
		this.startMoveListenerByKey = this.startMoveByKey.bind(this)
		this.endMoveListenerByKey = this.endMoveByKey.bind(this)

		if (this.model.control === 'buttons' && this.cnr.closest('._touch')) {
			this.startMoveListenerByTouch = this.startMoveByTouch.bind(this)
			this.endMoveListenerByTouch = this.endMoveByTouch.bind(this)
			this.blockGamePlay = this.cnr.querySelector('.game__play')
			this.createButtons(this.blockGamePlay)
			this.blockGamePlay.addEventListener('touchstart', this.startMoveListenerByTouch);
			this.blockGamePlay.addEventListener('touchend', this.endMoveListenerByTouch);
		}

		window.addEventListener('keydown', this.startMoveListenerByKey)
		window.addEventListener('keyup', this.endMoveListenerByKey)
		this.updateGame();
	}
	drawBall() {
		this.ctx.save();
		this.ctx.translate(this.ballPosX,this.ballPosY);
		this.ctx.rotate(this.rotation * Math.PI/180);
		this.ctx.drawImage(this.image, 0 - this.ballRadius, 0 - this.ballRadius, this.ballRadius * 2, this.ballRadius * 2); //????
		this.ctx.restore();
	}

	updateBall() {

		if ((this.keys.d && this.keys.lastKey === 'd') || (this.keys.right && this.keys.lastKey === 'right')) {
			this.ballPosX += this.ballVelocity;
			this.rotation += this.rotationSpeed;

		} else if((this.keys.a && this.keys.lastKey === 'a') || (this.keys.left && this.keys.lastKey === 'left')) {
			this.ballPosX -= this.ballVelocity;
			this.rotation -= this.rotationSpeed;
		}
		if (this.ballPosX - this.ballRadius <= 0) {
			this.ballPosX = this.ballRadius;
		}
		if (this.ballPosX + this.ballRadius  > this.cnvWidth) {
			this.ballPosX = this.cnvWidth - this.ballRadius ;
		}

		this.ballPosY += this.ballGravity;

		this.drawBall();
	}

	updateGame() {

		this.ctx.clearRect(0, 0, this.cnvWidth, this.cnvHeight)

		if ( this.frames % this.frame === 0 ) {
			this.pipes.push(new Pipe({
				ctx: this.ctx,
				cnvWidth: this.cnvWidth,
				pipeLeftPosX: this.pipeLeftPosX,
				pipePosY: this.pipePosY,
				pipeHeight: this.pipeHeight,
				pipeColor: this.pipeColor,
				pipeVelocity: this.pipeVelocity
			}));
		}

		this.frames++;
		this.drawBackground(1)

		for (let i = this.pipes.length - 1; i >= 0; i--) {

			let pipe = this.pipes[i];

			if (this.ballPosY + this.ballRadius >= pipe.pipePosY && this.ballPosY + this.ballRadius  < pipe.pipePosY + pipe.pipeHeight ) {
				if (this.ballPosX - this.ballRadius > pipe.pipeLeftWidth && this.ballPosX + this.ballRadius < pipe.pipeRightPosX) {
					this.ballGravity = 2;
					if (this.ballPosY + this.ballRadius + pipe.pipeVelocity + this.ballGravity >= pipe.pipePosY + pipe.pipeHeight) {
						this.score++;
						if (this.model.sound) {
							this.soundPoint.currentTime = 0;
							this.soundPoint.play();
						}
					}
				} else {
					this.ballGravity = 0;
					this.ballPosY = pipe.pipePosY - this.ballRadius;
				}
			}

			if (pipe.pipePosY + pipe.pipeHeight <= 0)  {
				this.pipes.splice(i, 1)
			}
			pipe.updatePipe()
		}

		this.updateBall()
		this.drawCount()

		this.id = requestAnimationFrame(this.updateGame.bind(this))

		if (this.ballPosY - this.ballRadius <= 0) {
			this.endGame()
			setTimeout(function() {
				window.location.hash ='GameOver';
			}, 500)
		}

	}

	drawCount() { //Вывод очков
		this.ctx.fillStyle = '#fff'
		this.ctx.lineWidth = 2;
		this.ctx.font = '35px Roboto';
		this.ctx.fillText(this.score, this.cnvWidth / 2, this.cnvHeight * 0.1)
		this.ctx.strokeText(this.score, this.cnvWidth / 2, this.cnvHeight * 0.1)
	}

	startMoveByTouch(e) { //Управление с помощью тача
		e.preventDefault()
		const pressedArrow = e.target.closest('.control__arrow');
		if (pressedArrow) {
			switch (pressedArrow.dataset.side) {
				case 'left':
					pressedArrow.classList.add('_active')
					this.keys.left    = true;
					this.keys.lastKey = 'left';
					break
				case 'right':
					pressedArrow.classList.add('_active')
					this.keys.right   = true;
					this.keys.lastKey = 'right';
					break
			}
		}
	}
	endMoveByTouch(e) { //Управление мяча с помощью тача
		e.preventDefault()
		const endArrow = e.target.closest('.control__arrow');
		if (endArrow) {
			switch (endArrow.dataset.side) {
				case 'left':
					endArrow.classList.remove('_active')
					this.keys.left = false;
					break
				case 'right':
					endArrow.classList.remove('_active')
					this.keys.right = false;
					break
			}
		}
	}

	startMoveByKey(e) {    //Управление мяча по кнопкам
		switch (e.code) {
			case 'KeyA':
				this.keys.a = true;
				this.keys.lastKey = 'a';
				break
			case 'KeyD':
				this.keys.d = true;
				this.keys.lastKey = 'd';
				break
		}

	}

	endMoveByKey(e) {    //Управление мяча по кнопкам
		switch (e.code) {
			case 'KeyA':
				this.keys.a = false
				break
			case 'KeyD':
				this.keys.d = false
				break
		}
	}

	endGame() {
		alert(this.model.vibration)
		cancelAnimationFrame(this.id);
		window.removeEventListener('keydown', this.startMoveListenerByKey)
		window.removeEventListener('keyup', this.endMoveListenerByKey)
		if (this.blockGamePlay) {
			this.blockGamePlay.removeEventListener('touchstart', this.startMoveListenerByTouch);
			this.blockGamePlay.removeEventListener('touchend', this.endMoveListenerByTouch);
		}

		this.cnr.querySelector('.game__score').textContent = this.score;
		this.model.sound ? this.soundLose.play() : null;
		this.model.vibration ? navigator.vibrate(1000) : null;
	}


	// СОЗДАНИЯ КНОПОК ДЛЯ УПРАВЛЕНИЯ
	createButtons(elem) {
		//BLOCK FOR BUTTONS
		const blockBtn = document.createElement('div');
		blockBtn.classList.add('game__control', 'control')
		//LEFT BUTTON
		const wrapperLeftBtn = document.createElement('div');
		wrapperLeftBtn.setAttribute('data-side', 'left')
		wrapperLeftBtn.classList.add('control__arrow')
		const btnLeft = document.createElement('div');
		btnLeft.classList.add('control__button', 'control__button_left')
		wrapperLeftBtn.append(btnLeft);
		//RIGHT BUTTON
		const wrapperRightBtn = document.createElement('div');
		wrapperRightBtn.setAttribute('data-side', 'right')
		wrapperRightBtn.classList.add('control__arrow')
		const btnRight = document.createElement('div');
		btnRight.classList.add('control__button', 'control__button_right')
		wrapperRightBtn.append(btnRight);

		blockBtn.append(wrapperLeftBtn, wrapperRightBtn)

		elem.append(blockBtn)
	}


	drawBackground(y) { //Отрисовка фона
		this.backGroundPosY = (this.backGroundPosY - y) % 1024 ;
		this.ctx.drawImage(this.backGround, 0, 0 , 1024, 1024, 0, this.backGroundPosY, 1024 , 1024 )
		this.ctx.drawImage(this.backGround, 0, 0 , 1024, 1024, 0, this.backGroundPosY + 1024 , 1024 , 1024)
	}

}

