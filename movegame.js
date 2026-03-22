/**
Basic Coding Lesson:

1. Variables and Functions
Variable: something that stores a value
Function: a block of code that performs a specific task

Variables can be Numbers, Strings (text), Booleans (true/false), Arrays (lists), or Objects (key-value pairs).

Functions can take inputs (parameters) and then do something with those inputs, either return a value or perform an action.

2. Loops and Listeners
Loop: a way to repeat a block of code multiple times
Listener: a way to wait for an event (like a mouse click or key press) and then run some code when that event happens

3. Classes and Objects
Class: a blueprint for creating objects that share the same properties and methods
Object: an instance of a class that has its own unique values for the properties defined in the class

 */

//POP IN
// let canvas = document.getElementById('canvas-container');
// canvas.style.position = "relative";
// canvas.style.left = "-100vw";
// let plan = document.getElementById('lesson-plan');
// plan.style.position = "relative";
// plan.style.top = "-100vh";
// setTimeout(() => {
//     canvas.style.transition = "left 0.5s ease-out";
//     canvas.style.left = "0vw";
// }, 100);

// setTimeout(() => {
//     plan.style.transition = "top 0.5s ease-out";
//     plan.style.top = "0vh";
// }, 600);

const CONFIG = {
  useImages: true,
  staticBaddies: false,
  defaults: {
    baddieSpeedMin: 2,
    baddieSpeedMax: 3,
    baddieSpawnTime: 20,
    gameSpeed: 1,
    gameSpeedIncrement: 0.005,
    gameSpeedMax: 6
  },
  canvas: {
    width: 600,
    height: 400,
  },
}

class GameModel {
  player;
  baddies = [];
}

class GameController {
  gameV;
  gameM;

  baddieSpawnTime;
  baddieCurrentSpawnTime;
  gameSpeed;
  score = 0;
  gameRunning = false;

  constructor(gameV, gameM) {
    this.gameV = gameV;
    this.gameM = gameM;

    this.gameM.player = new PlayerSprite(CONFIG.canvas.width / 2, CONFIG.canvas.height / 2, 15);

    this.gameV.canvas.addEventListener('mousemove', this.movePlayer);

    this.showInstructions();
    this.onAnimationFrame();
    this.gameV.resetButton.addEventListener('click', this.resetGame);
  }

  movePlayer = e => {
    this.gameM.player.x = e.offsetX;
    this.gameM.player.y = e.offsetY;

    if (CONFIG.staticBaddies) {
      for (let i = this.gameM.baddies.length - 1; i >= 0; i--) {
        let baddie = this.gameM.baddies[i];
        if (baddie.checkCollision(this.gameM.player)) {
          this.gameOver();
          return;
        }
      }
    }
  }

  resetGame = () => {
    this.gameM.baddies = [];
    this.gameM.baddiespawnTime = CONFIG.defaults.baddieSpawnTime;
    this.baddieCurrentSpawnTime = this.gameM.baddiespawnTime;
    this.score = 0;
    this.gameRunning = true;
    this.gameV.showCursor(false);
    this.gameV.resetButton.style.display = 'none';
    this.gameSpeed = CONFIG.defaults.gameSpeed;

    if (CONFIG.staticBaddies) {
      this.gameM.baddies.push(new Baddie(10, 10, 20, 0));
      this.gameM.baddies.push(new Baddie(200, 250, 20, 0));
      this.gameM.baddies.push(new Baddie(300, 350, 20, 0));
      this.gameM.baddies.push(new Baddie(400, 30, 20, 0));
      this.gameM.baddies.push(new Baddie(500, 150, 20, 0));
    }
  }

  showInstructions = () => {
    this.gameRunning = false;
    this.gameV.drawInstructions();
  }

  gameOver = () => {
    this.gameRunning = false;
    this.gameV.drawGameOver(this.score);
  }

  onAnimationFrame = () => {
    if (this.gameRunning && !CONFIG.staticBaddies) {
      this.updateGame();
    }

    if (this.gameRunning) {
      this.gameV.drawGame(this.gameM.player, this.gameM.baddies, this.score);
    }
    requestAnimationFrame(this.onAnimationFrame);
  }

  updateGame = () => {
    this.gameSpeed += CONFIG.defaults.gameSpeedIncrement;
    if (this.gameSpeed > CONFIG.defaults.gameSpeedMax) {
      this.gameSpeed = CONFIG.defaults.gameSpeedMax;
    }

    this.baddieCurrentSpawnTime--;
    if (this.baddieCurrentSpawnTime <= 0) {
      this.addBaddie();
      this.baddieCurrentSpawnTime = this.gameM.baddiespawnTime / this.gameSpeed;
    }

    for (let i = this.gameM.baddies.length - 1; i >= 0; i--) {
      let baddie = this.gameM.baddies[i];
      baddie.update();
      if (!baddie.checkBounds(this.gameV.canvas)) {
        this.gameM.baddies.splice(i, 1);
        this.score++;
      }

      if (baddie.checkCollision(this.gameM.player)) {
        this.gameOver();
        return;
      }
    }
  }

  addBaddie = () => {
    let baddieSpeedDiff = CONFIG.defaults.baddieSpeedMax - CONFIG.defaults.baddieSpeedMin;
    let speed = (CONFIG.defaults.baddieSpeedMin + Math.random() * baddieSpeedDiff) * this.gameSpeed;
    let baddie = new Baddie(Math.random() * CONFIG.canvas.width, 0, 20, speed);
    this.gameM.baddies.push(baddie);
  }
}

class GameView {
  canvas; ctx; resetButton;

  constructor(canvas, resetButton) {
    this.canvas = canvas;
    this.resetButton = resetButton;

    this.ctx = canvas.getContext('2d');
    this.canvas.width = CONFIG.canvas.width;
    this.canvas.height = CONFIG.canvas.height;
  }

  showCursor(b) {
    if (b) {
      this.canvas.style.cursor = '';
    } else {
      this.canvas.style.cursor = 'none';
    }
  }

  drawGame = (player, baddies, score) => {
    this.drawBackground();
    this.drawPlayer(player);
    for (let baddie of baddies) {
      this.drawBaddie(baddie);
    }
    this.drawUi(score);
  }

  drawBackground = () => {
    if (CONFIG.useImages) {
      let bgElement = document.getElementById('background-image');
      this.ctx.drawImage(bgElement, 0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
      this.ctx.fillStyle = '#aaa5';
      this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    } else {
      this.ctx.fillStyle = 'lightblue';
      this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }
  }

  drawPlayer = (player) => {
    if (CONFIG.useImages) {
      let pElement = document.getElementById('player-image');
      this.ctx.drawImage(pElement, player.x - player.size, player.y - player.size, player.size * 2, player.size * 2);
    } else {
      this.ctx.fillStyle = 'brown';
      this.ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    }
  }

  drawBaddie = (baddie) => {
    if (CONFIG.useImages) {
      let bElement = document.getElementById('baddie-image');
      this.ctx.save();
      this.ctx.translate(baddie.x, baddie.y);
      this.ctx.rotate(baddie.rotation);
      this.ctx.drawImage(bElement, - baddie.size, - baddie.size, baddie.size * 2, baddie.size * 2);
      this.ctx.restore();

      // this.ctx.drawImage(document.getElementById('baddie-image'), baddie.x - baddie.size, baddie.y - baddie.size, baddie.size * 2, baddie.size * 2);
    } else {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(baddie.x - baddie.size / 2, baddie.y - baddie.size / 2, baddie.size, baddie.size);
    }
  }

  drawUi = (score) => {
    // this.ctx.fillStyle = '#aaccaa   ';
    // this.ctx.fillRect(CONFIG.canvas.width - 100, 0, 100, 30);

    this.ctx.fillStyle = '#000';
    this.ctx.strokeStyle = '#cff';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.strokeText("Score: " + score, CONFIG.canvas.width - 80, 20);
    this.ctx.fillText("Score: " + score, CONFIG.canvas.width - 80, 20);
  }

  drawInstructions = () => {
    this.drawBackground();
    this.ctx.fillStyle = "#ffffffaa"
    this.ctx.strokeStyle = "#077";
    this.ctx.rect(50, 50, CONFIG.canvas.width - 100, CONFIG.canvas.height - 100);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = "25px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText('Help the monkey dodge the coconuts!', 90, 175);
    this.ctx.strokeText('Help the monkey dodge the coconuts!', 90, 175);
    this.showCursor(true);
    this.resetButton.style.display = '';

  }

  drawGameOver = (score) => {
    this.ctx.fillStyle = "#ffffffaa"
    this.ctx.strokeStyle = "#077";
    this.ctx.rect(50, 50, CONFIG.canvas.width - 100, CONFIG.canvas.height - 100);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Game Over! Score: " + score, CONFIG.canvas.width / 2 - 150, CONFIG.canvas.height / 2);
    this.ctx.strokeText("Game Over! Score: " + score, CONFIG.canvas.width / 2 - 150, CONFIG.canvas.height / 2);
    this.showCursor(true);
    this.resetButton.style.display = '';
    this.resetButton.innerHTML = "Play Again!";
  }
}

class PlayerSprite {
  x; y; size;

  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
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

let gameC = new GameController(
  new GameView(document.getElementById('game-canvas'), document.getElementById('reset-button')), 
  new GameModel()
);

