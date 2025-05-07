import { gameAnims } from "../anims/anims.js";
import Player from "../object/player.js";
import { getCenterX, getCenterY, getHeight, getWidth, quizData } from "../utils/utils.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.initValues();
    this.loadMap();
    this.createClouds();
    this.createTreesAndPlatforms();
    this.createBackground();
    this.createCoins();
    this.createPlayer();
    this.createChestAndKey();
    this.createDoor();
    this.createUI();
    this.addCollisions();
    this.setupInput();
  }

  update() {
    if (this.isGameOver || this.isPopupOpen) return;
    this.updatePlayerMovement();
    this.updateOneWayPlatform();
    this.updateKeyFollow();
  }

  // --- Initialization ---
  initValues() {
    this.playerSpeed = 350;
    this.playerJumpSpeed = 550;
    this.quizIndex = 0;
    this.isPopupOpen = false;
    this.isGameOver = false;
    this.countCoins = 0;
    this.keyCollected = false;
    gameAnims(this.anims);
  }

  // --- Map and Background ---
  loadMap() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("Terrain", "tiles", 32, 32);
    this.groundLayer = this.map.createLayer("ground", tileset).setDepth(3);
    this.groundLayer.setCollisionByProperty({ collide: true });
    this.physics.world.setBounds(0, 0, getWidth(this), getHeight(this));
  }

  createBackground() {
    const backgroundLayer = this.map.getObjectLayer("background");
    backgroundLayer.objects.forEach(bgObj => {
      const { x, y } = bgObj;
      const treeType = Phaser.Math.Between(1, 2);
      const tree = this.physics.add.sprite(x, y, `back-palm-${treeType}`).setOrigin(0.5, 1).setScale(4).setDepth(2);
      tree.play(`back-palm-${treeType}-anim`);
      tree.body.setSize(tree.width * 0.4, tree.height * 0.05);
      tree.body.setOffset(20, 0);
      tree.body.allowGravity = false;
      tree.body.setImmovable(true);
      this.fontPlaimGroup.add(tree);
    });
  }

  createClouds() {
    for (let i = 2; i <= 4; i++) {
      const cloud = this.add.sprite(Phaser.Math.Between(0, getWidth(this)), Phaser.Math.Between(0, getHeight(this)), `cloud-${i}`).setOrigin(0.5, 1).setScale(4).setDepth(1);
      this.tweens.add({
        targets: cloud,
        x: { from: getWidth(this) + 200, to: -200 },
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        onRepeat: () => cloud.y = Phaser.Math.Between(0, getHeight(this))
      });
    }
  }

  createTreesAndPlatforms() {
    this.fontPlaimGroup = this.add.group();
    const treeLayer = this.map.getObjectLayer("treeLayer");
    treeLayer.objects.forEach(obj => {
      const tree = this.add.image(obj.x, obj.y, 'tree').setOrigin(0.5, 1).setScale(4).setDepth(2);
      const platform = this.physics.add.sprite(tree.x, tree.y - tree.displayHeight, 'font-plaim')
        .setDepth(3).setScale(5);
      platform.play('font-plaim');
      platform.body.setSize(platform.width * 0.4, platform.height * 0.1);
      platform.body.setOffset(12, 0);
      platform.body.allowGravity = false;
      platform.body.setImmovable(true);
      this.fontPlaimGroup.add(platform);
    });
  }

  createCoins() {
    this.coinGroup = this.add.group();
    const coinLayer = this.map.getObjectLayer("coinLayer");
    coinLayer.objects.forEach(obj => {
      const coin = this.physics.add.sprite(obj.x, obj.y, 'coin').setOrigin(0.5, 1).setScale(4).setDepth(5);
      coin.play('coin-anim');
      coin.body.setCircle(coin.width * 0.3);
      coin.body.allowGravity = false;
      coin.body.setImmovable(true);
      this.coinGroup.add(coin);
    });
  }

  createPlayer() {
    this.player = new Player(this, 200, getCenterY(this), 'player').setDepth(4);
    this.player.setScale(4);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.player.width * 0.4, this.player.height * 0.5);
    this.player.play('player-idle');
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createChestAndKey() {
    this.chestUnlocked = false;
    const x = getCenterX(this) - 100;
    const y = getHeight(this) - 85;
    this.chest = this.physics.add.sprite(x, y, 'chest').setScale(4).setDepth(5);
    this.chest.body.allowGravity = false;
    this.chest.body.setImmovable(true);
    this.chest.body.setSize(this.chest.width * 0.5, this.chest.height * 0.5);

    this.key = this.physics.add.sprite(x, y, 'key').setScale(4).setDepth(5).setAlpha(0);
    this.key.body.allowGravity = false;
    this.key.body.setImmovable(true);
    this.key.body.setSize(this.key.width * 0.5, this.key.height * 0.5);
    this.key.body.enable = false;
    this.key.play('key-anim');
  }

  createDoor() {
    this.door = this.physics.add.sprite(getWidth(this) - 70, getHeight(this) - 150, 'door').setScale(4).setDepth(3);
    this.door.body.allowGravity = false;
    this.door.body.setImmovable(true);
    this.door.body.setSize(this.door.width * 0.2, this.door.height * 0.5);
  }

  createUI() {
    this.add.sprite(60, 60, "coin").setOrigin(0.5).setScale(4);
    this.countCoinsText = this.add.text(90, 65, `${this.countCoins}`, {
      fontSize: '62px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);
  }

  // --- Input ---
  setupInput() {
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.isPopupOpen || !this.player.body.blocked.down) return;
      this.player.setVelocityY(-this.playerJumpSpeed);
    });
  }

  // --- Player Update ---
  updatePlayerMovement() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.setFlipX(true);
      this.player.play('player-run', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.setFlipX(false);
      this.player.play('player-run', true);
    } else {
      this.player.setVelocityX(0);
      this.player.play('player-idle', true);
    }
  }

  updateOneWayPlatform() {
    if (!this.fontPlaimCollider) return;
    this.fontPlaimCollider.active = this.player.body.velocity.y >= 0;
  }

  updateKeyFollow() {
    if (this.keyCollected) {
      this.key.x = this.player.x;
      this.key.y = this.player.y;
    }
  }

  // --- Collisions and Overlaps ---
  addCollisions() {
    this.fontPlaimCollider = this.physics.add.collider(this.player, this.fontPlaimGroup);
    this.physics.add.collider(this.groundLayer, this.player);

    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => {
      coin.destroy();
      this.isPopupOpen = true;
      this.player.setVelocity(0);
      this.player.play('player-idle', true);
      this.addPopup();
    });

    this.physics.add.overlap(this.player, this.chest, () => {
      if (this.chestUnlocked || this.countCoins < 5) return;
      this.chestUnlocked = true;
      this.chest.play('chest-anim');

      this.tweens.add({
        delay: 2000,
        targets: this.key,
        y: this.key.y - 120,
        alpha: 1,
        duration: 500,
        onComplete: () => this.key.body.enable = true
      });
    });

    this.physics.add.overlap(this.player, this.key, () => {
      this.key.body.enable = false;
      this.keyCollected = true;
    });

    this.physics.add.overlap(this.player, this.door, () => {
      if (!this.keyCollected) return;
      this.door.body.enable = false;
      this.door.play('door-open');
      this.isGameOver = true;
      this.player.body.enable = false;
      this.key.visible = false;

      this.tweens.add({
        targets: this.player,
        x: getWidth(this) + 200,
        duration: 2000,
        onComplete: () => {
          this.add.text(getCenterX(this), getCenterY(this), 'Congrat! You win!', {
            fontSize: '104px',
            color: '#ffffff'
          }).setOrigin(0.5).setDepth(6);
        }
      });
    });

   // this.addPopup();
  }

  // --- Quiz Popup ---
  addPopup() {
    const container = this.add.container(getCenterX(this), getCenterY(this) - 100).setDepth(6);
    const panelBg = this.add.image(0, 0, 'panel-bg').setOrigin(0.5).setScale(26, 15);
    const questionText = this.add.text(0, -140, quizData[this.quizIndex].question, {
      fontSize: '42px', color: '#000', align: 'center', wordWrap: { width: 750 }
    }).setOrigin(0.5);
    const msg = this.add.text(0, 150, '', {
      fontSize: '42px', color: '#000', align: 'center', wordWrap: { width: 750 }
    }).setOrigin(0.5);
    container.add([panelBg, questionText, msg]);

    quizData[this.quizIndex].options.forEach((option, i) => {
      const optText = this.add.text(0, -50 + i * 50, `${i + 1}. ${option}`, {
        fontSize: '32px', color: '#000'
      }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

      optText.on('pointerup', () => {
        if (i === quizData[this.quizIndex].correctAnswer) {
          msg.setText('Correct answer! You can continue.');
          container.destroy();
          this.isPopupOpen = false;
          this.countCoins++;
          this.quizIndex = (this.quizIndex + 1) % quizData.length;
          this.countCoinsText.setText(`${this.countCoins}`);
        } else {
          msg.setText('Wrong answer!');
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              msg.setText('');
              container.destroy();
              this.isPopupOpen = false;
            }
          });
        }
      });

      container.add(optText);
    });
  }
}

