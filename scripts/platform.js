var Platform = function(game, group, x, y, w, h) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     'platform');
  this.width = w;
  this.height = h;
  game.physics.arcade.enable(this);
  this.body.immovable = true;
  group.add(this);
};
Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;