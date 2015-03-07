var GAME_TIME = 1800;

var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.stage.backgroundColor = COLOR_DARKER;

  this.sounds = {
      explode: this.game.add.audio("explode"),
      death: this.game.add.audio("death"),
      big_explode: this.game.add.audio("big_explode"),
      hit: this.game.add.audio("hit"),
      hits: [this.game.add.audio("hit1"),
          this.game.add.audio("hit2"),
          this.game.add.audio("hit3")]
  };

  this.groups = {
    bg: this.game.add.group(),
    asteroids: this.game.add.group(),
    bullets_enemy: this.game.add.group(),
    bullets: this.game.add.group(),
    players: this.game.add.group(),
    ui: this.game.add.group()
  };
  
  var bg = new Phaser.TileSprite(this.game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT,
                                 'ground');
  this.groups.bg.add(bg);

  this.ship = new Ship(this.game,
                       this.groups.players,
                       this.groups.bullets,
                       this.groups.ui,
                       SCREEN_WIDTH / 2,
                       SCREEN_HEIGHT / 2,
                       this.game.add.audio("shot"));
  this.cursors = this.game.input.keyboard.createCursorKeys();
  
  this.roidGenerator = new RoidGenerator(this.game,
                                         this.groups.asteroids,
                                         this.groups.bullets_enemy,
                                         this.groups.players,
                                         this.game.add.audio('shot'));

  this.game.input.gamepad.start();
  
  this.player = new PlayerController(this.game.input.gamepad.pad1, this.ship);
  
  this.gauge = new Gauge(this.game, this.groups.ui,
                         SCREEN_WIDTH / 2, 50);
  this.gameTime = GAME_TIME;
};

GameState.prototype.loadLevel = function(level) {
  // Clear the rest
  this.groups.asteroids.removeAll(true);
  this.groups.bullets.removeAll(true);
  
  this.roidGenerator.setInterval(level.roidInterval);
};

GameState.prototype.update = function() {
  // Bullet to roid collisions
  this.game.physics.arcade.overlap(this.groups.asteroids, this.groups.bullets,
    function(roid, bullet) {
        var hitSoundIndex = Math.floor(Math.random() * 3)
     if (bullet.player !== null) {
       bullet.player.score++;
     }
     bullet.kill();
     roid.onHit(2);
     this.sounds.hits[hitSoundIndex].play();
    }, null, this);
  // Roid to roid collisions
  for (var i = 0; i < this.groups.asteroids.total; i++) {
    var roid1 = this.groups.asteroids.getAt(i);
    if (roid1.health < 0) {
      this.destroyAsteroid(roid1);
      i--;
      continue;
    }
    // Roid collisions
    for (var j = i; j < this.groups.asteroids.total; j++) {
      var roid2 = this.groups.asteroids.getAt(j);
      this.game.physics.arcade.collide(roid1, roid2);
    }
  }
  // Enemy bullet to player collisions
  this.game.physics.arcade.overlap(
    this.groups.bullets_enemy, this.groups.players,
    function(bullet, player) {
     bullet.kill();
     player.onHit(1);
     this.sounds.hit.play();
    }, null, this);

  this.player.update();

  // Move ship using arrows
  if (this.cursors.left.isDown) {
    if (this.cursors.up.isDown) {
      this.ship.move(-45);
    } else if (this.cursors.down.isDown) {
      this.ship.move(-135);
    } else {
      this.ship.move(-90);
    }
  } else if (this.cursors.right.isDown) {
    if (this.cursors.up.isDown) {
      this.ship.move(45);
    } else if (this.cursors.down.isDown) {
      this.ship.move(135);
    } else {
      this.ship.move(90);
    }
  } else if (this.cursors.up.isDown) {
    this.ship.move(0);
  } else if (this.cursors.down.isDown) {
    this.ship.move(180);
  }
  
  // Firing
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
    this.ship.fire();
  }

  // Spawn new asteroids
  this.roidGenerator.update();
  
  // Update game time
  this.gameTime--;
  this.gauge.setValue(this.gameTime / GAME_TIME);
  if (this.gameTime <= 0) {
    this.gauge.hide();
    this.roidGenerator.enabled = false;
  }
};

GameState.prototype.render = function() {
  //this.game.debug.body(this.ship);
}

GameState.prototype.destroyAsteroid = function(roid) {
  // Create explosion flames
  for (var k = 0; k < 10; k++) {
    var vel = new Phaser.Point(Math.random() - 0.5,
                               Math.random() - 0.5);
    vel.multiply(roid.width, roid.height);
    var explosion = this.game.add.sprite(roid.x - vel.x*0.5,
                                         roid.y - vel.y*0.5,
                                         'explosion');
    this.game.physics.arcade.enable(explosion);
    explosion.angle = Math.random() * 360;
    explosion.body.velocity.setTo(vel.x * -1.0, vel.y * -1.0);
    var anim = explosion.animations.add('play');
    anim.killOnComplete = true;
    anim.play(Math.random()*10 + 10);
  }
  this.groups.asteroids.remove(roid, true);
  this.sounds.death.play();
}
