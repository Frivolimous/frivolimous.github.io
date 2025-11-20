
// === SECRET LINK ===
let secret = document.getElementsByClassName('secret-link')[0];
secret.addEventListener('mouseenter', function() {
    secret.style.left = Math.random() * 100 + "%";
    secret.style.top = Math.random() * 100 + "%";
    secret.style.position = "absolute";
});

// === DODGE THE COCONUTS GAME ===
let hero = document.getElementById('hero');
let coconut = document.createElement('img');
let leftColumn = document.getElementById('main-left-column');
let gameHeader = document.getElementsByClassName('game-header')[0];
let gameScore = document.getElementsByClassName('game-score')[0];
let bubbleContent = document.getElementsByClassName('bubble-content')[0];

coconut.src = 'coconut.png';
coconut.classList.add('game-bullet');

let heroTimer;
let coconutX = 0;
let coconutRotate = 0;
leftColumn.appendChild(coconut);
let gameRunning = false;
let mousePosition = { x: 0, y: 0 };
let score = 0;


hero.addEventListener('mouseenter', function() {
    gameStart();
});
hero.addEventListener('mouseleave', function() {
    gameEnd();
});

leftColumn.addEventListener('mousemove', e =>{
    mousePosition.x = e.layerX;
    mousePosition.y = e.layerY;
});

gameStart = () => {
    if (gameRunning) return;

    gameRunning = true;
    resetCoconut();
    coconut.style.display = 'block';
    requestAnimationFrame(animation);
    gameHeader.style.display = 'block';
    gameScore.style.display = 'block';
}

gameEnd = () => {
    gameRunning = false;
    coconut.style.display = 'none';
    hero.style.cursor = "url('monkey.png'), pointer";
    gameHeader.style.display = 'none';
    gameScore.style.display = 'none';
    bubbleContent.innerHTML = "Dodge the coconuts!";
    score = 0;
    gameScore.innerHTML = "Score:<br>" + score;
}

monkeyDead = () => {
    gameRunning = false;
    hero.style.cursor = "url('monkey-dead.png'), pointer";
    bubbleContent.innerHTML = "You died :(<br>Score: " + score;
}

animation = () => {
    if (!gameRunning) return;

    if (coconutX > 0) {
        let width = leftColumn.clientWidth;
        coconutX -= width * 0.01;
        coconut.style.left = coconutX + 'px';
        coconutRotate += 2;
        coconut.style.rotate = coconutRotate + 'deg';
    } else {
        resetCoconut();
        score++;
        gameScore.innerHTML = "Score:<br>" + score;
    }
    if (Math.abs(coconut.offsetLeft - mousePosition.x) < 15 &&
        Math.abs(coconut.offsetTop - mousePosition.y) < 15) {
        monkeyDead();
        return;
    }
    
    requestAnimationFrame(animation);
}

resetCoconut = () => {
    let width = leftColumn.clientWidth;
    coconutX = width;
    coconut.style.left = coconutX + 'px';
    coconut.style.top = (0.2 +Math.random() * 0.8) * 100 + '%';
}