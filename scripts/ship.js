var SHIP_SPEED = 300.0;
var FRICTION = 10.0;
var GUN_LOCK = 10;
var TURN_DURATION = 120;
var BULLET_SPEED = 1000.0;
var REGEN_TIMER = 120;
var Ship = function(game, group, bulletGroup, uiGroup,
                    x, y,
                    shotSound) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'player');
  this.anchor.setTo(0.5, 0.7);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  this.bulletGroup = bulletGroup;
  
  this.healthBar = new Phaser.Sprite(game,
                                     x, y,
                                     'health');
  this.healthBar.anchor.setTo(0.5, 3);
  uiGroup.add(this.healthBar);
  this.health = 4;
  
  game.physics.arcade.enable(this);
  this.body.setSize(this.width, this.width);
  this.body.collideWorldBounds = true;
  this.speed = 0;
  this.moveAngle = 0;
  
  this.gunLock = GUN_LOCK;

  this.radius = Math.min(this.width, this.height) / 2;

  this.shotSound = shotSound;
  
  // Score
  this.score = 0;
  this.scoreText = game.add.text(x, y,
                                 "", {
    font: "14px Arial", fill: "#ff0000",
    fontWeight: "bold", align: "center"});
  this.scoreText.anchor.setTo(0.5, -1);
  uiGroup.add(this.scoreText);
  
  this.regenLock = REGEN_TIMER;
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
  this.moveAngle = angle;
  
  this.speed = SHIP_SPEED * SCALE;
};

Ship.prototype.face = function(angle) {
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
}

Ship.prototype.update = function() {
  // Healthbar
  this.healthBar.x = this.x;
  this.healthBar.y = this.y;
  this.healthBar.frame = this.health - 1;
  if (this.health <= 0) {
    this.healthBar.visible = false;
  }
  
  // Health regen
  if (this.health < 4) {
    this.regenLock--;
    if (this.regenLock <= 0) {
      this.health++;
      this.regenLock += REGEN_TIMER;
    }
  }
  
  // Score text
  this.scoreText.x = this.x;
  this.scoreText.y = this.y;
  this.scoreText.text = this.score;
  
  // Friction
  this.speed -= FRICTION;
  if (this.speed < 0) {
    this.speed = 0;
  }
  this.body.velocity = angleToPoint(this.moveAngle,
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
               this.angle, 'bullet', BULLET_SPEED,
               this);
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
