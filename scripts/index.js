import { BootScene } from './scene/boot-scene.js';
import { GameScene } from './scene/game-scene.js';


const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#ddc6a1',
  render: { pixelArt: true, antialias: false },
  width: 1920,
  height: 1080,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 },
        debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);
