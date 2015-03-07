var SHIP_SPEED = 500.0;
var FRICTION = 5.0;
var GUN_LOCK = 10;
var TURN_DURATION = 120;
var Ship = function(game, group, bulletGroup, x, y,
                    shotSound, jumpSound) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'ship');
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  this.bulletGroup = bulletGroup;
  
  game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.speed = 0;
  
  this.gunLock = GUN_LOCK;

  this.radius = Math.min(this.width, this.height) / 2;
  this.canJump = true;

  this.shotSound = shotSound;
  this.jumpSound = jumpSound;
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
    var muzzleOffset = angleToPoint(this.angle,
                                    this.height / 2);
    muzzleOffset.add(this.x, this.y);
    new Bullet(this.game, this.bulletGroup,
               muzzleOffset.x, muzzleOffset.y,
               this.angle);
    this.shotSound.play();
    this.gunLock = GUN_LOCK;
  }
};

Ship.prototype.jump = function() {
  /*
  if (this.canJump) {
    this.canJump = false;
    var radiusStart = Math.min(this.width, this.height) / 2;
    var jumpUp = this.game.add.tween(this).to({radius:radiusStart + JUMP_HEIGHT},
                                              JUMP_DURATION,
                                              Phaser.Easing.Quadratic.Out);
    var jumpDown = this.game.add.tween(this).to({radius:radiusStart},
                                                JUMP_DURATION,
                                                Phaser.Easing.Quadratic.In);
    jumpDown.onComplete.add(function() {
      this.canJump = true;
    }, this);
    jumpUp.chain(jumpDown);
    jumpUp.start();
    this.jumpSound.play();
  }*/
};