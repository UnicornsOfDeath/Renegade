var GAUGE_WIDTH = 448;
var Gauge = function(game, group, x, y) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'gauge_back');
  group.add(this);
  this.anchor.setTo(0.5, 0.5);
  this.bar = new Phaser.Sprite(game,
                               x - this.width / 2 + 33, y,
                               'gauge_front');
  this.bar.anchor.setTo(0, 0.5);
  this.bar.width = GAUGE_WIDTH;
  group.add(this.bar);
};
Gauge.prototype = Object.create(Phaser.Sprite.prototype);
Gauge.prototype.constructor = Gauge;

Gauge.prototype.setValue = function(value) {
  this.bar.width = value * GAUGE_WIDTH;
};

Gauge.prototype.hide = function() {
  this.visible = false;
  this.bar.visible = false;
};