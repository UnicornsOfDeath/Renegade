var GUN_LOCK_ENEMY = 100;
var ACCEL_ENEMY = 1;
var FRICTION_ENEMY = 1;
var WANDER_LOCK = 250;
var ENEMY_SPEED = 100;
var BULLET_SPEED_ENEMY = 500.0;

var Roid = function(game, group, bulletGroup,
                    playerGroup,
                    x, y, power,
                    shotSound) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'heavy');
  this.anchor.setTo(0.5, 0.75);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  this.bulletGroup = bulletGroup;
  this.playerGroup = playerGroup;
  
  game.physics.arcade.enable(this);
  this.body.setSize(this.width, this.width);
  this.body.allowRotation = true;

  this.game = game;
  this.health = power;
  this.power = power;
  this.angle = Math.random() * 360;
  this.target = null;
  this.wanderSomewhere();
  
  this.shotSound = shotSound;
  this.gunLock = GUN_LOCK_ENEMY;
  this.wanderLock = WANDER_LOCK;
};
Roid.prototype = Object.create(Phaser.Sprite.prototype);
Roid.prototype.constructor = Roid;

Roid.prototype.wanderSomewhere = function() {
  this.target = new Phaser.Point(
    Math.random() * 0.8 + 0.1,
    Math.random() * 0.8 + 0.1);
  this.target.multiply(this.game.world.width,
                       this.game.world.height);
  this.body.velocity.setTo(this.target.x - this.x,
                           this.target.y - this.y);
  this.body.velocity.setMagnitude(ENEMY_SPEED);
};

Roid.prototype.update = function() {
  // Check if this is out of bounds and moving out
  // If so, destroy
  if ((this.x - this.width < 0 && this.body.velocity.x < 0 ||
      this.x + this.width > this.game.world.width && this.body.velocity.x > 0) &&
      (this.y - this.height < 0 && this.body.velocity.y < 0 ||
      this.y + this.height > this.game.world.height && this.body.velocity.y > 0)) {
    this.destroy();
    console.log("destroy");
  }
  
  // Firing update
  this.gunLock--;
  if (this.gunLock < 0) {
    this.gunLock = 0;
  }
  
  // Fire
  if (this.gunLock === 0) {
    var offY = angleToPoint(this.angle, this.height / 2);
    var offX = angleToPoint(this.angle + 90, -this.width * 0.12);
    var muzzleOffset = Phaser.Point.add(offX, offY);
    muzzleOffset.add(this.x, this.y);
    new Bullet(this.game, this.bulletGroup,
               muzzleOffset.x, muzzleOffset.y,
               this.angle, 'bullet_heavy',
               BULLET_SPEED_ENEMY);
    this.shotSound.play();
    this.gunLock = GUN_LOCK_ENEMY;
  }
  
  // Moving around randomly
  this.wanderLock--;
  if (this.wanderLock < 0) {
    this.wanderLock = WANDER_LOCK;
    this.wanderSomewhere();
  }
  
  // Move towards target
  if (this.target.distance(new Phaser.Point(this.x, this.y)) < 10) {
    // Too close; stop
    var mag = this.body.velocity.getMagnitude();
    mag -= FRICTION_ENEMY;
    if (mag < 0) {
      mag = 0;
    }
    this.body.velocity.setMagnitude(mag);
  } else {
    var accel = new Phaser.Point(
      this.target.x - this.x,
      this.target.y - this.y);
    accel.setMagnitude(ACCEL_ENEMY);
    this.body.velocity.add(accel.x, accel.y);
    if (this.body.velocity.getMagnitude() > ENEMY_SPEED) {
      this.body.velocity.setMagnitude(ENEMY_SPEED);
    }
  }
  
  // Rotate to face the closest player
  var closest = null;
  var closestD = 0;
  for (var i = 0; i < this.playerGroup.length; i++) {
    var player = this.playerGroup.getAt(i);
    if (!player.alive) {
      continue;
    }
    var d = Phaser.Math.distance(player.x,
                                 this.x,
                                 player.y,
                                 this.y);
    if (closest === null || d < closestD) {
      closest = player;
      closestD = d;
    }
  }
  if (closest !== null) {
    this.rotation = Math.atan2(player.y - this.y,
                               player.x - this.x);
    this.rotation += Math.PI / 2;
  }
};

Roid.prototype.onHit = function(power) {
  this.health -= power;
  this.tint = 0xff0000;
  this.game.add.tween(this).to({tint:0xffffff},
                               10,
                               Phaser.Easing.Linear.Out).start();
};

var RoidGenerator = function(game, group,
                             bulletGroup,
                             playerGroup,
                             shotSound) {
  this.game = game;
  this.group = group;
  this.bulletGroup = bulletGroup;
  this.playerGroup = playerGroup;
  this.timer = 0;
  this.interval = 100;
  this.shotSound = shotSound;
};

RoidGenerator.prototype.setInterval = function(interval) {
  this.interval = interval;
};

RoidGenerator.prototype.update = function() {
  if (this.timer <= 0) {
    var spawnPos = angleToPoint(Math.random() * 180,
                                this.game.world.width / 2 + 100);
    spawnPos.add(this.game.world.width / 2,
                 this.game.world.height / 2);
    new Roid(this.game, this.group,
             this.bulletGroup,
             this.playerGroup,
             spawnPos.x, spawnPos.y,
             5,
             this.shotSound); // TODO: random power and roids
    this.timer = (Math.random() + 0.5) * this.interval;
    console.log("roid");
  }
  this.timer--;
};