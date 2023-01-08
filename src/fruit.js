import config from './game.config.js';

const imgDir = "./assets/images/";
const GAME_WIDTH = config.game_settings.width;
const GAME_HEIGHT = config.game_settings.height;

export default class Fruit {

    constructor(data, controller) {
        // Load texture by fruit data
        const texture = PIXI.Texture.from(imgDir + data.img);
        const text_slice_l = PIXI.Texture.from(imgDir + data.slice_l.img);
        const text_slice_r= PIXI.Texture.from(imgDir + data.slice_r.img);
        
        this.g_controller = controller;
        this.container = new PIXI.Container();
        this.img = data.img;
        this.img_splash = data.splash_img;
        this.points = data.points;
        this.direction = (Math.random() < 0.5) ? -1 : 1;
        this.sprite = new PIXI.Sprite(texture);
        this.anim = null;
        this.animStarted = false;

        this.sprite_l = new PIXI.Sprite(text_slice_l);
        this.sprite_l.anchor.set(data.slice_l.anchor.x, data.slice_l.anchor.y);
        this.sprite_l.visible = false;
        
        this.sprite_r = new PIXI.Sprite(text_slice_r);
        this.sprite_r.anchor.set(data.slice_r.anchor.x, data.slice_r.anchor.y);
        this.sprite_r.visible = false;

        this.container.addChild(this.sprite);
        this.container.addChild(this.sprite_l);
        this.container.addChild(this.sprite_r);
    }

    animate() {
        const dir = this.direction;
        
        let startX, startY, throwX, throwY, rot;
        
        startY = GAME_HEIGHT + 100;
        throwY = Math.random() * (GAME_HEIGHT * 0.8);
        throwX = (Math.random() * (GAME_WIDTH * 2)) - GAME_WIDTH / 2;

        if (dir > 0) { // right throw motion
            startX = -GAME_WIDTH / 4;
            throwX = GAME_WIDTH;
        }
        else { // left throw motion
            startX = GAME_WIDTH * 1.25;
            throwX = -GAME_WIDTH;
        }

        rot = Math.random() * 10 * dir;

        this.sprite.x = startX;
        this.sprite.y = startY;

        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.interactive = true;

        this.sprite.on('pointerdown', () => { this.animateSlice(); });
        this.sprite.on('pointermove', () => { this.animateSlice(); }); 

        this.anim = gsap.timeline({delay: Math.random()});
        this.anim.to(this.sprite, 1.5, {x: throwX, ease: "sine.in"})
                .to(this.sprite, .75, {y: throwY, ease: "sine.out", yoyo: true, repeat: 1}, 0)
                .to(this.sprite, 1.5, {rotation: rot, ease: "sine.in", repeat: 1}, 0);
        this.anim.eventCallback('onComplete', () => { this.kill(); });
    }

    animateSlice() {
        if (this.animStarted) return;

        this.animStarted = true;
        this.sprite.interactive = false;
        this.g_controller.updateScore(this.points); 

        const text_splash = PIXI.Texture.from(imgDir + this.img_splash);
        this.sprite.texture = text_splash;

        // Stop fruit throwing animation
        this.anim.kill();
        gsap.to(this.sprite, {pixi: {alpha: 0}, ease: "power1.in", duration: 2}).then(() => { this.kill(); });

        // Play soundfx
        PIXI.sound.play('slice');

        // Display sliced fruit
        const endX = this.direction * 50;
        const endY = GAME_HEIGHT + 200;

        this.sprite_l.x = this.sprite.x;
        this.sprite_l.y = this.sprite.y;
        this.sprite_l.rotation = this.sprite.rotation;
        this.sprite_l.visible = true;
        gsap.to(this.sprite_l, {pixi: {x: this.sprite_l.x + endX, y: endY, rotation: (Math.random() * 180) * this.direction}, ease: "power1.in", duration: 1});
        this.sprite_r.rotation = this.sprite.rotation;
        this.sprite_r.x = this.sprite.x;
        this.sprite_r.y = this.sprite.y;
        
        this.sprite_r.visible = true;
        gsap.to(this.sprite_r, {pixi: {x: this.sprite_r.x + endX, y: endY, rotation: (Math.random() * 180) * this.direction}, ease: "power1.in", duration: .8});
    }

    kill() {
        this.g_controller.gameContainer.removeChild(this.container);
    }
}
