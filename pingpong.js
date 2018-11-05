class Vec {
	constructor(x = 0, y = 0){
			this.x = x;
			this.y = y;
	}
}

class Rect {
	constructor(w, h){
			this.pos = new Vec;
			this.size = new Vec(w,h);
	}
	get left(){
		return this.pos.x - this.size.x/2
	}
	get right(){
		return this.pos.x + this.size.x/2
	}
	get top(){
		return this.pos.y - this.size.y/2
	}
	get bottom(){
		return this.pos.y + this.size.y/2
	}
}

class Ball extends Rect {
	constructor() {
		super(10, 10);
		this.vel = new Vec;
	}
}

class Player extends Rect {
	constructor() {
		super(20, 100);
		this.score = 0;
	}
}

class Pong {
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		
		this.ball = new Ball;
		
		this.players = [
			new Player,
			new Player,
		];
		
		this.players[0].pos.x = 40;
		this.players[1].pos.x = this._canvas.width - 40;
		this.players.forEach(player => {
			player.pos.y = this._canvas.height/2
		});
		
		let lastTime;
		const callback = (millis) => {
			if (lastTime){
				this.update((millis - lastTime) / 1000);
			}
			lastTime = millis;
				requestAnimationFrame(callback);
		};	
		callback();
		
		this.reset();
	}
	
	collide(player, ball) {
		if (player.left < ball.right && player.right > ball.left &&
			player.top < ball.bottom && player.bottom > ball.top) {
				ball.vel.x = -ball.vel.x;
			}
	}
	
	draw() {
		this._context.fillStyle = 'gray';
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
		this.drawRect(this.ball, 'white');
		this.drawRect(this.players[0], 'blue');
		this.drawRect(this.players[1], 'red');

	}
	
	drawRect(rect, color) {
		this._context.fillStyle = color;
		this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}
	
	reset() {
		this.ball.pos.x = this._canvas.width/2;
		this.ball.pos.y = this._canvas.height/2;

		this.ball.vel.x = 0;
		this.ball.vel.y = 0;
	}
	
	start() {
		if (this.ball.vel.x === 0 && this.ball.vel.y === 0){
			this.ball.vel.x = 500;
			this.ball.vel.y = 500;
		}
	}
	
	update(dt) {
		this.ball.pos.x +=this.ball.vel.x * dt;
		this.ball.pos.y +=this.ball.vel.y * dt;
		
		if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
			const playerId = this.ball.vel.x < 0 | 0;
			this.players[playerId].score++;
			
			this.drawScore();
			
			this.reset();
		}
		
		if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
			this.ball.vel.y = -this.ball.vel.y;
		}
		
		this.players[1].pos.y = this.ball.pos.y;
		
		this.players.forEach(player => this.collide(player, this.ball));
		
		this.draw();

	}
	
	drawScore() {
		var table = document.querySelector('.currentscore');
		
			table.innerHTML = 'Очки игрока: <b>' + this.players[0].score + '</b> ---- Очки компьютера: <b>' + this.players[1].score + '</b>';
			if (this.players[0].score == 5) {
			table.innerHTML = "Поздравляем!Вы победили!";
				this.players[0].score = 0;
				this.players[1].score = 0;
			}
			
			if (this.players[1].score == 5) {
			table.innerHTML = "Победил компьютер!";
				this.players[0].score = 0;
				this.players[1].score = 0;
			}
	}
}

const canvas = document.getElementById('pingpong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
	pong.players[0].pos.y = event.offsetY;
})

canvas.addEventListener('click', event => {
	pong.start();
})


