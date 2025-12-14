
// === SECRET LINK ===
let secret = document.getElementsByClassName('secret-link')[0];
secret.addEventListener('mouseenter', function() {
    secret.style.right = Math.random() * 95 + "%";
    secret.style.top = Math.random() * 97 + "%";
    // secret.style.color = makeRandomColor();
    // secret.style.background = undefined;
});

// === STYLISH BUTTON ===
let styleButton = document.getElementsByClassName('style-button')[0];
styleButton.addEventListener('click', function() {
    let background = makeRandomColor();
    let text = makeRandomColor();
    styleButton.style.background = background;
    styleButton.style.color = text;
    styleButton.style.borderColor = text;
    console.log(background, text);
});

function makeRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    let color = `rgb(${r}, ${g}, ${b})`;

    return color;
}


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
let coconutSpeed = 0.01;
let coconutMaxSpeed = 0.05;
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
    coconutSpeed = 0.01;
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
        coconutX -= width * coconutSpeed;
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
    coconutSpeed *= 1.1;
    coconutSpeed = Math.min(coconutSpeed, coconutMaxSpeed);
    console.log(coconutSpeed);
    coconutX = width;
    coconut.style.left = coconutX + 'px';
    // 6% to 88%
    coconut.style.top = (0.06 +Math.random() * 0.82) * 100 + '%';
}