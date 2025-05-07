export class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload() {

    
    this.load.spritesheet("player", "assets/img/player.png", {
      frameWidth: 64,
      frameHeight: 40,
    });


    this.load.image("panel-bg", "assets/img/panel-bg.png");

    this.load.image("tiles", "assets/img/Terrain.png");

    this.load.tilemapTiledJSON("map", "./assets/img/level.json");

    this.load.image("tree", "assets/img/tree.png");

    this.load.spritesheet("font-plaim", "assets/img/font-plaim.png", {
      frameWidth: 39,
      frameHeight: 32,
    });

    this.load.spritesheet("door", "assets/img/door.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("chest", "assets/img/chest.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("key", "assets/img/key.png", {
      frameWidth: 24,
      frameHeight: 24,
    });

    this.load.spritesheet("coin", "assets/img/coin.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("back-palm-1", "assets/img/back-palm-1.png", {
      frameWidth: 51,
      frameHeight: 53,
    });

    this.load.spritesheet("back-palm-2", "assets/img/back-palm-2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

  
    for (let i = 2; i <= 4; i++) {
      this.load.image(`cloud-${i}`, `assets/img/c${i-1}.png`);
    }



  }

  update() {
    // this.scene.start("MenuScene")
    this.scene.start("GameScene")

  }

}


