class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play(`${this.texture.key}-anim`, true);
        this.flipX = true;
        this.body.allowGravity = false;


        // Set default properties
      //  this.setCollideWorldBounds(true);
       // this.setBounce(0.2);
     //   this.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    
    preUpdate(t, delta){
        super.preUpdate(t, delta);
        this.setVelocityX(-400);
        if (this.x < -100) {
            this.destroy();
        }
    }


}

export default Enemy;