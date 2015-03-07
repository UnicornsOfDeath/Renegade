var PLANET_MIN_RADIUS_SCALE = 0.25;
var PLANET_SHRINK_DURATION = 200;
var LINK_ARC_DEGREES = 20;
var Planet = function(game, group, x, y, radius, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     sprite);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(SCALE, SCALE);
  group.add(this);

  this.radius = radius;
  this.health = radius * (1 - PLANET_MIN_RADIUS_SCALE);
  
  this.links = [];
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.link = function(beam) {
  this.links.push(beam);
};

Planet.prototype.getLink = function(ship) {
  var closestBeam = null;
  var closestAngle = 0;
  for (var i = 0; i < this.links.length; i++) {
    var beam = this.links[i];
    var angleShip = this.game.physics.arcade.angleBetween(this, ship);
    var angleBeam = this.game.physics.arcade.angleBetween(this, beam);
    var angle = Math.abs(angleShip - angleBeam);
    if (angle > Math.PI) {
      angle = 2 * Math.PI - angle;
    }
    if (angle < LINK_ARC_DEGREES * Math.PI / 180 &&
        (closestBeam === null || angle < closestAngle)) {
      closestBeam = beam;
      closestAngle = angle;
    }
  }
  return closestBeam;
};

Planet.prototype.overlaps = function(sprite) {
  var otherRadius = Math.min(sprite.width, sprite.height) / 2;
  var distance = this.game.physics.arcade.distanceBetween(this, sprite);
  return distance < otherRadius + this.radius;
};

Planet.prototype.update = function() {
  // Adjust size
  this.width = this.radius * 2;
  this.height = this.radius * 2;
}

// "ground" a sprite on the surface of this planet
Planet.prototype.ground = function(sprite) {
  var down = new Phaser.Point(this.x - sprite.x, this.y - sprite.y);
  var desiredDown = new Phaser.Point(down.x, down.y);
  desiredDown.setMagnitude(sprite.radius + this.radius);
  
  // make the sprite's velocity tangential too so it can slip around
  var magnitude = sprite.body.velocity.getMagnitude();
  sprite.body.velocity.x += (down.x - desiredDown.x) * 10.0;
  sprite.body.velocity.y += (down.y - desiredDown.y) * 10.0;
  if (magnitude > 1) {
    sprite.body.velocity.setMagnitude(magnitude);
  }
  sprite.x += down.x - desiredDown.x;
  sprite.y += down.y - desiredDown.y;
};

Planet.prototype.onHit = function(power) {
  this.game.add.tween(this).to({radius:this.radius - power},
                               PLANET_SHRINK_DURATION,
                               Phaser.Easing.Bounce.Out).start();
  this.health -= power;
}