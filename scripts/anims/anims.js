export let gameAnims = (anims) =>{
    anims.create({
        key: 'player-idle',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        frameRate: 7,
        repeat: -1
      });
  
      anims.create({
        key: 'player-run',
        frames: anims.generateFrameNumbers('player', { start: 5, end: 10 }),
        frameRate: 7,
        repeat: -1
      });
  
      anims.create({
        key: 'font-plaim',
        frames: anims.generateFrameNumbers('font-plaim', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      anims.create({
        key: 'back-palm-1-anim',
        frames: anims.generateFrameNumbers('back-palm-1', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      anims.create({
        key: 'back-palm-2-anim',
        frames: anims.generateFrameNumbers('back-palm-2', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      anims.create({
        key: 'door-open',
        frames: anims.generateFrameNumbers('door', { start: 0, end: 4 }),
        frameRate: 10,
      });

      anims.create({
        key: 'coin-anim',
        frames: anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      anims.create({
        key: 'chest-anim',
        frames: anims.generateFrameNumbers('chest', { start: 0, end: 7 }),
        frameRate: 5,
      });

      anims.create({
        key: 'key-anim',
        frames: anims.generateFrameNumbers('key', { start: 0, end: 7 }),
        frameRate: 5,
        repeat: -1
      });
}