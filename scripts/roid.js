var Roid = function(game, group, x, y, power) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'roid0');
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);
  
  game.physics.arcade.enable(this);
  this.body.allowRotation = true;

  this.health = power;
  this.power = power;
  this.angle = Math.random() * 360;
  this.angularVelocity = Math.random() * 2 - 1;
  var target = new Phaser.Point(Math.random() * 0.5 + 0.25,
                                Math.random() * 0.5 + 0.25);
  target.multiply(game.world.width,
                  game.world.height);
  this.body.velocity.setTo(target.x - this.x,
                           target.y - this.y);
  this.body.velocity.setMagnitude(Math.random() * 50 + 100);
};
Roid.prototype = Object.create(Phaser.Sprite.prototype);
Roid.prototype.constructor = Roid;

Roid.prototype.update = function() {
  this.angle += this.angularVelocity;
  
  // Check if this is out of bounds and moving out
  // If so, destroy
  if ((this.x - this.width < 0 && this.body.velocity.x < 0 ||
      this.x + this.width > this.game.world.width && this.body.velocity.x > 0) &&
      (this.y - this.height < 0 && this.body.velocity.y < 0 ||
      this.y + this.height > this.game.world.height && this.body.velocity.y > 0)) {
    this.destroy();
    console.log("destroy");
  }
};

Roid.prototype.onHit = function(power) {
  this.health -= power;
  this.tint = 0xff0000;
  this.game.add.tween(this).to({tint:0xffffff},
                               10,
                               Phaser.Easing.Linear.Out).start();
};

var RoidGenerator = function(game, group) {
  this.game = game;
  this.group = group;
  this.timer = 0;
  this.interval = 100;
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
             spawnPos.x, spawnPos.y,
             5); // TODO: random power and roids
    this.timer = (Math.random() + 0.5) * this.interval;
    console.log("roid");
  }
  this.timer--;
};