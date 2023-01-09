import Fruit from './fruit.js';
import fruits from './fruits.json' assert {type: 'json'};

export default class Game {
    constructor(data) {
        this.stage = data.stage;
        this.gameWidth = data.settings.width;
        this.gameHeight = data.settings.height;
        this.isPaused = false;
        this.isSwordActive = false;

        this.gameContainer = new PIXI.Container();
        this.UIContainer = new PIXI.Container();
        this.endContainer = new PIXI.Container();

        this.score = 0;
        this.UI_score = null;
        this.UI_time = null;
        
        this.maxTime = data.settings.time * 1000;
        this.currTime = data.settings.time;

        this.loadUI();
    }

    loadUI() {
        // UI Text style
        const style = new PIXI.TextStyle({
            fontFamily: 'go3v2',
            fontSize: 50,
            fill: ['#FFF'], // gradient
            stroke: '#000',
            strokeThickness: 3
        });

        this.UIContainer.x = 0;
        this.UIContainer.y = 0;

        this.UI_score = new PIXI.Text('0', style);
        this.UI_score.x = 10;
        this.UI_score.y = 0;

        this.UI_time = new PIXI.Text('0:00', style);
        this.UI_time.x = this.gameWidth - this.UI_time.width - 10;
        this.UI_time.y = 0;

        this.UIContainer.addChild(this.UI_score);
        this.UIContainer.addChild(this.UI_time);

        this.UIContainer.visible = true;
        this.gameContainer.addChild(this.UIContainer);
    }

    start() {
        this.stage.addChild(this.gameContainer);
        this.stage.interactive = true;
        this.stage.on('pointerdown', () => {
            this.isSwordActive = true
        });
        this.stage.on('pointerup', () => {
            this.isSwordActive = false
        });

        // Start spawning fruits on screen
        const gameTimer = setInterval(() => {
            if(!this.isPaused) {
                if (this.currTime <= 0) {
                    clearInterval(gameTimer);
                    this.end();
                }

                this.spawnFruit();

                const min = Math.floor(this.currTime / 60);
                let sec = Math.ceil(this.currTime % 60);
                sec = (sec < 10) ? "0" + sec : sec;
                this.UI_time.text = min + ":" + sec;

                this.currTime --;
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
        this.stage.interactive = false;
    }

    continue() {
        this.isPaused = false;
        this.stage.interactive = true;
    }

    spawnFruit() {
        const i =  Math.floor(Math.random() * fruits.length);
        let fruit =  new Fruit(fruits[i], this);
        this.gameContainer.addChild(fruit.container);
        fruit.animate();
    }

    updateScore(points) {
        this.score += points;
        this.UI_score.text = this.score; 
    }

    end() {
        console.log('Game Over');
        this.stage.interactive = false;
        this.gameContainer.visible = false;
        this.showScore();
    }

    showScore() {
        // Board
        const board = new PIXI.Sprite(PIXI.Texture.from('assets/images/board.png'));
        board.scale = {x: 0.8, y: 0.8};
        board.x = this.gameWidth / 2 - board.width / 2;
        board.y = 0;
        this.endContainer.addChild(board);

        // Text
        const style1 = new PIXI.TextStyle({
            fontFamily: 'go3v2',
            fontSize: 50,
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 3
        });

        const style2 = new PIXI.TextStyle({
            fontFamily: 'go3v2',
            fontSize: 100,
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 3
        });

        const text_score = new PIXI.Text('Score', style1);
        text_score.x = board.x + board.width / 2 - text_score.width / 2;
        text_score.y = 60;
        this.endContainer.addChild(text_score);

        const text_player_score = new PIXI.Text(this.score, style2);
        text_player_score.x = board.x + board.width / 2 - text_player_score.width / 2;
        text_player_score.y = text_score.y + text_score.height + 5;
        this.endContainer.addChild(text_player_score);

        this.endContainer.y = this.gameHeight / 2 - this.endContainer.height / 2;
        this.stage.addChild(this.endContainer);
    }
}
