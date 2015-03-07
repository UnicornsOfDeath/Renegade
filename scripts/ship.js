var SHIP_SPEED = 300.0;
var FRICTION = 10.0;
var GUN_LOCK = 10;
var TURN_DURATION = 120;
var BULLET_SPEED = 1000.0;
var Ship = function(game, group, bulletGroup, x, y,
                    shotSound) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'player');
  this.anchor.setTo(0.5, 0.7);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  this.bulletGroup = bulletGroup;
  
  game.physics.arcade.enable(this);
  this.body.setSize(this.width, this.width);
  this.body.collideWorldBounds = true;
  this.speed = 0;
  
  this.gunLock = GUN_LOCK;

  this.radius = Math.min(this.width, this.height) / 2;

  this.shotSound = shotSound;
};
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.move = function(angle) {
  // Set angle so that we tween the right direction
  var newAngle = angle;
  if (Math.abs(newAngle - this.angle) > 180) {
    if (this.angle < 0) {
      newAngle -= 360;
    } else {
      newAngle += 360;
    }
  }
  this.game.add.tween(this).to({angle:newAngle},
                               TURN_DURATION,
                               Phaser.Easing.Back.Out).start();
  this.speed = SHIP_SPEED * SCALE;
};

Ship.prototype.update = function() {
  // Friction
  this.speed -= FRICTION;
  if (this.speed < 0) {
    this.speed = 0;
  }
  this.body.velocity = angleToPoint(this.angle,
                                    this.speed);
  
  // Firing update
  this.gunLock--;
  if (this.gunLock < 0) {
    this.gunLock = 0;
  }
};

Ship.prototype.fire = function() {
  if (this.gunLock === 0) {
    var offY = angleToPoint(this.angle, this.height / 2);
    var offX = angleToPoint(this.angle + 90, this.width * 0.12);
    var muzzleOffset = Phaser.Point.add(offX, offY);
    muzzleOffset.add(this.x, this.y);
    new Bullet(this.game, this.bulletGroup,
               muzzleOffset.x, muzzleOffset.y,
               this.angle, 'bullet', BULLET_SPEED);
    this.shotSound.play();
    this.gunLock = GUN_LOCK;
  }
};

Ship.prototype.onHit = function(power) {
  this.health -= power;
  this.tint = 0xff0000;
  this.game.add.tween(this).to({tint:0xffffff},
                               10,
                               Phaser.Easing.Linear.Out).start();
};
