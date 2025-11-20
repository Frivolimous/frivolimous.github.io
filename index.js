let secret = document.querySelector('.secret-link');
console.log(secret);
secret.addEventListener('mouseenter', function() {
    secret.style.left = Math.random() * 100 + "%";
    secret.style.top = Math.random() * 100 + "%";
    secret.style.position = "absolute";
});

let hero = document.getElementById('hero');
let heroTimer;
hero.addEventListener('mouseenter', function() {
    gameStart();
});
hero.addEventListener('mouseleave', function() {
    gameEnd();
});

let coconut = document.createElement('img');
coconut.src = 'coconut.png';
coconut.classList.add('game-bullet');
let coconutX = 0;
let coconutRotate = 0;
let leftColumn = document.getElementById('main-left-column');
leftColumn.appendChild(coconut);

let gameRunning = false;

let mousePosition = { x: 0, y: 0 };

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
}

gameEnd = () => {
    gameRunning = false;
    coconut.style.display = 'none';
    hero.style.cursor = "url('monkey.png'), pointer";
}

monkeyDead = () => {
    gameRunning = false;
    hero.style.cursor = "url('monkey-dead.png'), pointer";
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