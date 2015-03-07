var GUN_LOCK_ENEMY = 200;

var Roid = function(game, group, bulletGroup,
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
  
  game.physics.arcade.enable(this);
  this.body.allowRotation = true;

  this.health = power;
  this.power = power;
  this.angle = Math.random() * 360;
  var target = new Phaser.Point(Math.random() * 0.5 + 0.25,
                                Math.random() * 0.5 + 0.25);
  target.multiply(game.world.width,
                  game.world.height);
  this.body.velocity.setTo(target.x - this.x,
                           target.y - this.y);
  this.body.velocity.setMagnitude(Math.random() * 50 + 100);
  
  this.shotSound = shotSound;
  this.gunLock = GUN_LOCK_ENEMY;
};
Roid.prototype = Object.create(Phaser.Sprite.prototype);
Roid.prototype.constructor = Roid;

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
               this.angle, 'bullet_heavy');
    this.shotSound.play();
    this.gunLock = GUN_LOCK_ENEMY;
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
                             shotSound) {
  this.game = game;
  this.group = group;
  this.bulletGroup = bulletGroup;
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
             spawnPos.x, spawnPos.y,
             5,
             this.shotSound); // TODO: random power and roids
    this.timer = (Math.random() + 0.5) * this.interval;
    console.log("roid");
  }
  this.timer--;
};