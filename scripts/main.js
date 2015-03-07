var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.stage.backgroundColor = 0xA4B1D9;
  
  this.sounds = {
    explode: this.game.add.audio("explode"),
    bump: this.game.add.audio("bump"),
    jump: this.game.add.audio("jump"),
    land: this.game.add.audio("land"),
    step: this.game.add.audio("step"),
    swooshes: [],
    hits: []
  };
  for (var i = 0; i <NUM_SWOOSHES; i++) {
    this.sounds.swooshes.push(this.game.add.audio("swoosh" + i));
  }
  for (var i = 0; i <NUM_HITS; i++) {
    this.sounds.hits.push(this.game.add.audio("hit" + i));
  }

  this.groups = {
    bg: this.game.add.group(),
    platforms: this.game.add.group(),
    enemies: this.game.add.group(),
    players: this.game.add.group(),
    enemyHits: this.game.add.group(),
    hits: this.game.add.group(),
    ui: this.game.add.group()
  };

  this.loadLevel(level);
  this.player = this.groups.players.getAt(0);
  this.arrow = this.game.add.sprite(this.player.x, this.player.y,
                                    'arrow_down', 0, this.groups.ui);
  this.arrow.anchor.setTo(0.5, 2);
  this.cursors = this.game.input.keyboard.createCursorKeys();
};

GameState.prototype.loadLevel = function(level) {
  this.groups.platforms.removeAll(true);
  for (var i = 0; i < level.length; i++) {
    new Platform(this.game, this.groups.platforms,
                 level[i].x, level[i].y, level[i].w, level[i].h);
  }
  
  this.groups.enemies.removeAll(true);
  this.groups.players.removeAll(true);
  // Try to place some jumpers randomly as long as they don't overlap
  var placeJumper = function(jumper) {
    var checkOverlaps = function(jumper) {
      var checkOverlap = function(group, jumper) {
        var overlaps = false;
        this.game.physics.arcade.overlap(group, jumper, function(a, b) {
          overlaps = true;
        }, null, this);
        return overlaps;
      };
      return
        checkOverlap(this.groups.platforms, jumper) &&
        checkOverlap(this.groups.players, jumper) &&
        checkOverlap(this.groups.enemies, jumper);
    };
    do {
      jumper.x = randInt(0, SCREEN_WIDTH);
      jumper.y = randInt(0, SCREEN_HEIGHT);
      if (checkOverlaps(jumper)) {
        continue;
      }
    } while (false);
  };
  for (var i = 0; i < 4; i++) {
    placeJumper(new Jumper(this.game, this,
                           this.groups.players, this.groups.hits,
                           0, 0, 'cat'));
    placeJumper(new Jumper(this.game, this,
                           this.groups.enemies, this.groups.enemyHits,
                           0, 0, 'dog'));
  }
  
  // Clear the rest
  this.groups.hits.removeAll(true);
  this.groups.enemyHits.removeAll(true);
  this.groups.ui.removeAll(true);
};

GameState.prototype.update = function() {
  // Collisions
  this.game.physics.arcade.collide(this.groups.players, this.groups.platforms);
  this.game.physics.arcade.collide(this.groups.enemies, this.groups.platforms);
  
  // Hitting
  this.game.physics.arcade.overlap(this.groups.enemies, this.groups.hits,
                                   function(p, hit) {
    hit.hasHit = true;
    p.takeHit(hit);
    arrayRandomChoice(this.sounds.hits).play();
  }, null, this);
  this.groups.hits.forEach(function(h) {
    if (h.hasHit) {
      h.kill();
    }
  }, this, true);

  // Movement
  var dx = 0;
  var dy = 0;
  if (this.cursors.left.isDown) {
    dx = -1;
  } else if (this.cursors.right.isDown) {
    dx = 1;
  }
  if (this.cursors.up.isDown) {
    dy = 1;
  } else if (this.cursors.down.isDown) {
    dy = -1;
  }
  this.groups.players.forEach(function(p) {
    if (p == this.player) {
      p.move(dx, dy);
    } else {
      p.move(0, 0);
    }
  }, this, true);
  this.groups.enemies.forEach(function(p) {
    p.move(0, 0);
  }, this, true);

  // Other controls, attack/jump
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
    this.player.attack(dx, dy);
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
    this.player.jump();
  }
  
  this.arrow.x = this.player.x;
  this.arrow.y = this.player.y;
};