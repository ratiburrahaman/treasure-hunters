import { gameAnims } from "../anims/anims.js";
import Player from "../object/player.js";
import { getCenterX, getCenterY, getHeight, getWidth, quizData } from "../utils/utils.js";

export class GameScene extends Phaser.Scene {

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.playerSpeed = 350;
    this.playerJumpSpeed = 550;
    this.quizIndex = 0;
    this.isPopupOpen = false;

    this.isGameOver = false;

    this.countCoins = 0;

    this.add.sprite(60, 60, "coin").setOrigin(0.5, 0.5).setScale(4);
    this.countCoinsText = this.add.text(90, 65, `${this.countCoins}`, {
      fontSize: '62px',
      color: '#ffffff',
    }).setOrigin(0, 0.5);

    gameAnims(this.anims);
    this.fontPlaimGroup = this.add.group();
    this.coinGroup = this.add.group();

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Terrain", "tiles", 32, 32);

    const groundLayer = map.createLayer("ground", tileset).setDepth(3);
    groundLayer.setCollisionByProperty({ collide: true });

    // Cloud creation
    for (let i = 2; i <= 4; i++) {
      const cloud = this.add.sprite(
        Phaser.Math.Between(0, getWidth(this)),
        Phaser.Math.Between(0, getHeight(this)),
        `cloud-${i}`
      ).setOrigin(0.5, 1).setScale(4).setDepth(1);

      this.tweens.add({
        targets: cloud,
        x: { from: getWidth(this) + 200, to: -200 },
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        yoyo: false,
        onRepeat: () => {
          cloud.y = Phaser.Math.Between(0, getHeight(this));
        }
      });
    }

    // Background tree
    const backgroundLayer = map.getObjectLayer("background");
    backgroundLayer.objects.forEach(bgObj => {
      const { x, y } = bgObj;
      let randomTree = Phaser.Math.Between(1, 2);
      let bgTree = this.add.sprite(x, y, `back-palm-${randomTree}`)
        .setDepth(2).setOrigin(0.5, 1).setScale(4);
      bgTree.play(`back-palm-${randomTree}-anim`);
    });

    // Tree Layer & fontPlaim creation
    const treeLayer = map.getObjectLayer("treeLayer");
    treeLayer.objects.forEach(treeObj => {
      const { x, y } = treeObj;
      let tree = this.add.image(x, y, 'tree').setOrigin(0.5, 1).setScale(4).setDepth(2);
      let fontPlaim = this.physics.add.sprite(tree.x, tree.y - tree.displayHeight, 'font-plaim')
        .setDepth(3).setScale(5);
      fontPlaim.play('font-plaim');
      fontPlaim.body.setSize(fontPlaim.width * 0.4, fontPlaim.height * 0.1);
      fontPlaim.body.setOffset(12, 0);
      fontPlaim.body.allowGravity = false;
      fontPlaim.body.setImmovable(true);
      this.fontPlaimGroup.add(fontPlaim);
    });


    const coinLayer = map.getObjectLayer("coinLayer");
    coinLayer.objects.forEach(coinObj => {
      const { x, y } = coinObj;
      let coin = this.physics.add.sprite(x, y, 'coin').setOrigin(0.5, 1).setScale(4).setDepth(5);
      coin.play('coin-anim');
      coin.body.setCircle(coin.width * 0.3);
      coin.body.allowGravity = false;
      coin.body.setImmovable(true);
      this.coinGroup.add(coin);
    });

    // Debugging collision tiles
    const debugGraphics = this.add.graphics().setAlpha(0.01);
    groundLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255),
      faceColor: new Phaser.Display.Color(0, 255, 0, 255)
    });

    // Player setup
    this.player = new Player(this, 200, getCenterY(this), 'player').setDepth(4);
    this.player.body.setSize(this.player.width * 0.4, this.player.height * 0.5);
    this.player.play('player-idle');
    this.player.setScale(4);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(0, 0, getWidth(this), getHeight(this));


    let door = this.physics.add.sprite(getWidth(this) - 70, getHeight(this) - 150, 'door').setScale(4).setDepth(3);
    door.body.allowGravity = false;
    door.body.setImmovable(true);
    door.body.setSize(door.width * 0.2, door.height * 0.5);




    // Jumping
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.isPopupOpen) return;
      if (this.player.body.blocked.down) {
        this.player.setVelocityY(-this.playerJumpSpeed);
      }
    });

    let isChestUnlocked = false;

    let chest = this.physics.add.sprite(getCenterX(this) - 100, getHeight(this) - 85, 'chest').setScale(4).setDepth(5);
    chest.body.allowGravity = false;
    chest.body.setImmovable(true);
    chest.body.setSize(chest.width * 0.5, chest.height * 0.5);


    this.key = this.physics.add.sprite(chest.x, chest.y, 'key').setScale(4).setDepth(5).setAlpha(0);
    this.key.body.allowGravity = false;
    this.key.body.setImmovable(true);
    this.key.body.setSize(this.key.width * 0.5, this.key.height * 0.5);
    this.key.body.enable = false;
    this.key.play('key-anim');

    this.physics.add.overlap(this.player, chest, (player, chest) => {
      if (isChestUnlocked) return;

      if (this.countCoins >= 5) {
        isChestUnlocked = true;
        chest.play('chest-anim');

        this.tweens.add({
          delay: 2000,
          targets: this.key,
          y: this.key.y - 120,
          alpha: 1,
          duration: 500,
          ease: 'Power1',
          onComplete: () => {
            this.key.body.enable = true;
          }
        });
      }

    });

    this.keyCollected = false;

    this.physics.add.overlap(this.player, this.key, (player, key) => {
      key.body.enable = false;
      this.keyCollected = true;
    });


    this.physics.add.overlap(this.player, door, (player, door) => {
      if (this.keyCollected === false) return;
      door.body.enable = false;
      door.play('door-open');
      this.isGameOver = true;
      this.player.body.enable = false;
      this.key.visible = false;
      this.tweens.add({
        targets: this.player,
        x: getWidth(this) + 200,
        duration: 2000,
        ease: 'Power1',
        onComplete: () => {
          //this.scene.start('MenuScene');
          this.add.text(getCenterX(this), getCenterY(this), 'Game Over!', {
            fontSize: '104px',
            color: '#ffffff',
          }).setOrigin(0.5, 0.5).setDepth(6);
        }
      });

    });


    // 🌟 One-way Collision Setup
    this.fontPlaimCollider = this.physics.add.collider(this.player, this.fontPlaimGroup, (player, fontPlaim) => {
      console.log('Player landed on tree top');
    });

    // Ground collision
    this.physics.add.collider(groundLayer, this.player, () => {
      if (this.player.body.blocked.down) {
        this.player.setVelocityY(0);
      }
    });

    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => {
      coin.destroy();
      this.isPopupOpen = true;
      this.player.setVelocity(0, 0);
      this.player.play('player-idle', true);
      this.addPopup();
    });


  }

  update() {


    if (this.isGameOver)
      return;

    if (this.isPopupOpen) return;

    // Player movement
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

    // ✅ Enable one-way platform only when falling down
    if (this.player.body.velocity.y >= 0) {
      this.fontPlaimCollider.active = true;
    } else {
      this.fontPlaimCollider.active = false;
    }

    if (this.keyCollected) {
      this.key.x = this.player.x;
      this.key.y = this.player.y;
    }

  }


  addPopup() {

    let popUpcontainer = this.add.container(getCenterX(this), getCenterY(this) - 100).setDepth(6);

    let background = this.add.rectangle(0, 0, 800, 400, 0xffffff, 1);

    const text = this.add.text(0, -140, `${quizData[this.quizIndex].question}`, {
      fontSize: '42px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 750, useAdvancedWrap: true },
    }).setOrigin(0.5);



    const msg = this.add.text(0, 150, ``, {
      fontSize: '42px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 750, useAdvancedWrap: true },
    }).setOrigin(0.5);

    popUpcontainer.add([background, text, msg]);


    for (let i = 0; i < quizData[this.quizIndex].options.length; i++) {
      const optionText = this.add.text(0, -50 + (i * 50), `${i + 1}. ${quizData[this.quizIndex].options[i]}`, {
        fontSize: '32px',
        color: '#000000',
      }).setOrigin(0.5);

      optionText.setInteractive({ cursor: 'pointer' });
      optionText.on('pointerup', () => {
        if (i === quizData[this.quizIndex].correctAnswer) {
          this.isPopupOpen = false;
          msg.setText('Correct answer! You can continue.');
          popUpcontainer.destroy();
          this.countCoins++;
          this.quizIndex++;

          if (this.quizIndex >= quizData.length) {
            this.quizIndex = 0;
          }

          this.countCoinsText.setText(`${this.countCoins}`);
        } else {
          msg.setText('Wrong answer!');

          this.time.addEvent({
            delay: 1000,
            callback: () => {
              msg.setText('');
              popUpcontainer.destroy();
              this.isPopupOpen = false;
            },
            callbackScope: this
          });

        }
      });
      popUpcontainer.add([optionText]);
    }


  }
}
