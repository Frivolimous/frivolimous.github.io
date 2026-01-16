
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

let stylePlusButton = document.getElementById('stylish-plus-button');
let body = document.getElementsByTagName('body')[0];
body.style.transition = "all 1s";
stylePlusButton.addEventListener('click', function() {
    let color1 = makeRandomColor();
    let color2 = makeRandomColor();
    body.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
    stylePlusButton.style.background = color2;
    stylePlusButton.style.color = color1;
    stylePlusButton.style.borderColor = color1;
});