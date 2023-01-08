import config from './game.config.js';
export const screen = new PIXI.Container();

// Game Title Styles
const style = new PIXI.TextStyle({
    fontFamily: 'go3v2',
    fontSize: 150,
    fill: ['#8f4da6', '#f73828', '#ffe26d', '#bcda26'], // gradient
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_HORIZONTAL,
    stroke: '#000',
    strokeThickness: 5
});

const style2 = new PIXI.TextStyle({
    fontFamily: 'go3v2',
    fontSize: 120,
    fill: ['#FFF', '#cdd9db'], // gradient
    stroke: '#000',
    strokeThickness: 5
});

const style3 = new PIXI.TextStyle({
    fontFamily: 'go3v2',
    fontSize: 40,
    fill: ['#FFF', '#cdd9db'], // gradient
    stroke: '#000',
    strokeThickness: 3,
    wordWrap: true,
    wordWrapWidth: config.game_settings.width,
    align: 'center'
});

let title1, title2, info;

export function load() {
    // Setup title text style
    title1 = new PIXI.Text('Fruit', style);
    title1.x = config.game_settings.width / 2 - title1.width / 2;
    title1.y = config.game_settings.height / 2 - title1.height;

    title2 = new PIXI.Text('Ninja', style2);
    title2.x = config.game_settings.width / 2 - title2.width / 2;
    title2.y = title1.y + title1.height;

    screen.addChild(title1);
    screen.addChild(title2);

    // Setup info text style
    info = new PIXI.Text('Tap screen to start', style3);
    info.x = config.game_settings.width / 2 - info.width / 2;;
    info.y = config.game_settings.height - info.height - 20;
    info.alpha = 1;

    screen.addChild(info);
}

export function animate() {
    // Animate title
    title1.x = -300;
    title2.x = config.game_settings.width + 300;
    const x1 = config.game_settings.width / 2 - title1.width / 2;
    const x2 = config.game_settings.width / 2 - title2.width / 2;

    gsap.to(title1, {pixi: {x: x1 }, ease: "power1.in", duration: 0.5});
    gsap.to(title2, {pixi: {x: x2 }, ease: "power1.in", duration: 0.5});
    gsap.to(info, {pixi: {alpha: 0.8 }, ease: "power1.in", duration: 1, repeat: -1});
}

export function show() {
    screen.visible = true;
}

export function hide() {
    screen.visible = false;
}
