var BEAM_ALPHA = 0.3;
var Beam = function(game, group, planet1, planet2, radius) {
  Phaser.Sprite.call(this,
                     game,
                     (planet1.x + planet2.x) / 2, (planet1.y + planet2.y) / 2,
                     'beam');
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(SCALE, SCALE);
  this.alpha = BEAM_ALPHA;
  this.width = game.physics.arcade.distanceBetween(planet1, planet2);
  this.rotation = game.physics.arcade.angleBetween(planet1, planet2);
  group.add(this);
};
Beam.prototype = Object.create(Phaser.Sprite.prototype);
Beam.prototype.constructor = Beam;