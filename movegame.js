class GameController {
    canvas; ctx; player; resetButton;
    
    defaults = {
        baddieSpeedMin: 2,
        baddieSpeedMax: 3,
        baddieSpawnTime: 20,
        gameSpeed: 1,
        gameSpeedIncrement: 0.005,
        gameSpeedMax: 6
    }

    baddies = [];
    baddieSpawnTime;
    baddieCurrentSpawnTime;
    gameSpeed;
    score = 0;
    gameRunning = false;

    constructor(canvas, resetButton) {
        this.canvas = canvas;
        this.resetButton = resetButton;

        this.ctx = canvas.getContext('2d');

        this.canvas.width = 600;
        this.canvas.height = 400;

        this.player = new PlayerSprite(this.canvas.width / 2, this.canvas.height / 2, 15);
        
        this.canvas.addEventListener('mousemove', e => {
            this.player.x = e.offsetX;
            this.player.y = e.offsetY;
        });

        this.showInstructions();
        this.onAnimationFrame();
        this.resetButton.addEventListener('click', this.resetGame);
    }

    resetGame = () => {
        this.baddies = [];
        this.baddieSpawnTime = this.defaults.baddieSpawnTime;
        this.baddieCurrentSpawnTime = this.baddieSpawnTime;
        this.score = 0;
        this.gameRunning = true;
        this.canvas.style.cursor = 'none';
        this.resetButton.style.display = 'none';
        this.gameSpeed = this.defaults.gameSpeed;
    }

    showInstructions = () => {
        this.drawGame();
        this.gameRunning = false;
        this.ctx.fillStyle = "#ffffffaa"
        this.ctx.strokeStyle = "#077";
        this.ctx.rect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.font = "25px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText('Help the monkey dodge the coconuts!', 90, 175);
        this.ctx.strokeText('Help the monkey dodge the coconuts!', 90, 175);
        this.canvas.style.cursor = '';
        this.resetButton.style.display = '';
    }

    gameOver = () => {
        this.gameRunning = false;
        this.ctx.fillStyle = "#ffffffaa"
        this.ctx.strokeStyle = "#077";
        this.ctx.rect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Game Over! Score: " + this.score, this.canvas.width / 2 - 150, this.canvas.height / 2);
        this.ctx.strokeText("Game Over! Score: " + this.score, this.canvas.width / 2 - 150, this.canvas.height / 2);
        this.canvas.style.cursor = '';
        this.resetButton.style.display = '';
        this.resetButton.innerHTML = "Play Again!";
    }

    onAnimationFrame = () => {
        if (this.gameRunning) {
            this.updateGame();
        }

        if (this.gameRunning) {
            this.drawGame();
        }
        requestAnimationFrame(this.onAnimationFrame);
    }

    updateGame = () => {
        this.gameSpeed += this.defaults.gameSpeedIncrement;
        if (this.gameSpeed > this.defaults.gameSpeedMax) {
            this.gameSpeed = this.defaults.gameSpeedMax;
        }

        this.baddieCurrentSpawnTime--;
        if (this.baddieCurrentSpawnTime <= 0) {
            this.addBaddie();
            this.baddieCurrentSpawnTime = this.baddieSpawnTime / this.gameSpeed;
        }

        for (let i = this.baddies.length - 1; i >= 0; i--) {
            let baddie = this.baddies[i];
            baddie.update();
            if (!baddie.checkBounds(this.canvas)) {
                this.baddies.splice(i, 1);
                this.score++;
            }

            if (baddie.checkCollision(this.player)) {
                this.gameOver();
                return;
            }
        }
    }

    drawGame = () => {
        this.adjustCanvasSize();
        this.player.draw(this.ctx);
        for (let baddie of this.baddies) {
            baddie.draw(this.ctx);
        }
        this.drawUi();
    }

    adjustCanvasSize = () => {
        // canvas.width = window.innerWidth * 0.8;
        // canvas.height = window.innerHeight * 0.8;

        // this.ctx.fillStyle = 'lightblue';
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(document.getElementById('background-image'), 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#aaa5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawUi = () => {
        // this.ctx.fillStyle = '#aaccaa   ';
        // this.ctx.fillRect(this.canvas.width - 100, 0, 100, 30);
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#cff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.strokeText("Score: " + this.score, this.canvas.width - 80, 20);
        this.ctx.fillText("Score: " + this.score, this.canvas.width - 80, 20);
    }

    addBaddie = () => {
        let baddie = new Baddie(Math.random() * this.canvas.width, 0, 20, 
        (this.defaults.baddieSpeedMin + Math.random() * (this.defaults.baddieSpeedMax - this.defaults.baddieSpeedMin)) * this.gameSpeed);
        this.baddies.push(baddie);
    }
}

class PlayerSprite {
    x; y; size;

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx) {
        // ctx.fillStyle = 'brown';
        // ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.drawImage(document.getElementById('player-image'), this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }
}

class Baddie {
    x; y; size; speed; rotation; rotateDirection = 1;

    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.rotation = Math.random() * Math.PI * 2;
        if (Math.random() < 0.5) {
            this.rotateDirection = -1;
        }
    }

    update() {
        this.y += this.speed;
        this.rotation += 0.01 * this.speed * this.rotateDirection;
    }

    draw(ctx) {
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(document.getElementById('baddie-image'), - this.size, - this.size, this.size * 2, this.size * 2);
        ctx.restore();
        // ctx.drawImage(document.getElementById('baddie-image'), this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }

    checkBounds(canvas) {
        return this.y - this.size / 2 < canvas.height;
    }

    checkCollision(player) {
        if (player.x - player.size / 2 < this.x + this.size / 2 &&
            player.x + player.size / 2 > this.x - this.size / 2 &&
            player.y - player.size / 2 < this.y + this.size / 2 &&
            player.y + player.size / 2 > this.y - this.size / 2) {
                return true;
        }
        return false;
    }
}

let game = new GameController(document.getElementById('game-canvas'), document.getElementById('reset-button'));
