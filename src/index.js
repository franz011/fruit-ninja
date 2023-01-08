import config from './game.config.js';
import * as titleScreen from './title.js';
import Game from './game.js';
gsap.registerPlugin(PixiPlugin);

let app;
let stage;
let game;
let isPortrait = false;
let isGameLoaded = false;
let isGameStarted = false;

const wrapper = document.getElementById('main');
const rotateScreen = document.getElementById('landscape');

function loadApp() {
    createApplication();
    preloadGameAssets();
}

function preloadGameAssets() {
    PIXI.Assets.addBundle('game-screen-assets', {
        background: "assets/images/game_bg.jpg",
        board: "assets/images/board.png",
        go3v2: "assets/fonts/go3v2.ttf"
    });
    PIXI.sound.add('slice', 'assets/sounds/sword-unsheathing.mp3');
    PIXI.Assets.loadBundle('game-screen-assets').then(init);
}

function createApplication() {
    // Create PIXI application
    app = new PIXI.CanvasRenderer({
        width: config.game_settings.width,
        height: config.game_settings.height,
        forceCanvas: true,
        autoDetermineRenderer: false,
        rendererType: PIXI.RENDERER_TYPE.CANVAS
    });

    app.view.style.position = "absolute";
    app.view.style.top = "0px";
    app.view.style.left = "0px";

    console.log("Renderer: " + app.rendererLogId);

    // Create game stage
    stage = new PIXI.Container();
    stage.interactive = true;

    // Size the renderer to fill the screen
    resize();

    // Actually place the renderer onto the page for display
    document.getElementById("main").appendChild(app.view);

    // Listen for and adapt to changes to the screen size, e.g.,
    // user changing the window or rotating their device
    window.addEventListener("resize", resize);
}

function resize() {
    const GAME_WIDTH = config.game_settings.width;
    const GAME_HEIGHT = config.game_settings.height;
    
    let canvasWidth = 375;
    let canvasHeight = 667;
    let scaleX = 1;
    let scaleY = 1;

    const deviceType = getDeviceType();
    if(deviceType === "mobile") {
        wrapper.style.border = 'none';
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
    } else {
        wrapper.style.border = '10px solid #111010';
        wrapper.style.borderWidth = '30px 10px';
    }

    if (canvasWidth > canvasHeight) { // Mobile landscape mode
        // Show rotate screen
        isPortrait = false;
        rotateScreen.style.visibility = 'visible';
        stage.visible = false;

        if(game && isGameStarted) game.pause();
    } else {
        isPortrait = true;
        rotateScreen.style.visibility = 'hidden';
        stage.visible = true;

        if(game && isGameStarted) game.continue();
    }

    wrapper.style.height = canvasHeight + "px";
    wrapper.style.width = canvasWidth + "px";
    scaleX = canvasWidth/GAME_WIDTH;
    scaleY = canvasHeight/GAME_HEIGHT;
    stage.scale.x = scaleX;
    stage.scale.y = scaleY;

    app.resize(canvasWidth, canvasHeight);
}

function getDeviceType() {
    const ua = window.navigator.userAgent;
    const tablets = /iPad|Android|Tablet|Opera Tablet|HP Tablet/i;
    const mobiles = /Mobile|Phone|iOS|Android|Opera Mini|Blackberry|webOS|IEMobile|Windows Phone/i;
    if (ua.match(mobiles) || window.navigator.userAgentData.mobile) {
        return 'mobile';
    } else if (ua.match(tablets)) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

function init() {
    // Load background image
    const texture = PIXI.Texture.from('assets/images/game_bg.jpg');
    const background = new PIXI.Sprite(texture);
    background.width = config.game_settings.width; 
    background.height = config.game_settings.height;

    stage.addChild(background);

    // Load title
    titleScreen.load();
    stage.addChild(titleScreen.screen);

    app.render(stage);
    animate();
}

function loadGame() {
    if (!isGameLoaded) {
        titleScreen.animate();
        stage.on('pointerdown', startGame);
        isGameLoaded = true;
    } 
}

function startGame() {
    if (isPortrait) {
        isGameStarted = true;
        stage.interactive = false;
        stage.off('pointerdown', startGame);
        
        titleScreen.hide();
        game = new Game({ stage, settings: config.game_settings });
        game.start();
    }
}

function animate() {
    if(isPortrait && !isGameLoaded) loadGame();

    requestAnimationFrame( animate );
    app.render(stage);
}

window.onload = loadApp();
