var Bullet = function(game, group, x, y, angle, key,
                      speed) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     key);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  
  game.physics.arcade.enable(this);
  this.body.checkWorldBounds = true
  this.body.outOfBoundsKill = true;

  this.angle = angle;
  this.body.velocity = angleToPoint(angle,
                                    speed * SCALE);
};
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;