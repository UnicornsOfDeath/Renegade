var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.stage.backgroundColor = COLOR_DARKER;
  
  this.sounds = {
    explode: this.game.add.audio("explode"),
    big_explode: this.game.add.audio("big_explode"),
    hit: this.game.add.audio("hit")
  };

  this.groups = {
    bg: this.game.add.group(),
    planets: this.game.add.group(),
    beams: this.game.add.group(),
    asteroids: this.game.add.group(),
    players: this.game.add.group(),
    bullets: this.game.add.group()
  };

  this.ship = new Ship(this.game,
                       this.groups.players,
                       this.groups.bullets,
                       SCREEN_WIDTH / 2,
                       SCREEN_HEIGHT / 2,
                       null,
                       this.game.add.audio("shot"),
                       this.game.add.audio("jump"));
  this.cursors = this.game.input.keyboard.createCursorKeys();
  
  this.roidGenerator = new RoidGenerator(this.game,
                                         this.groups.asteroids);
  
  this.loadLevel(level2);
};

GameState.prototype.loadLevel = function(level) {
  this.groups.planets.removeAll(true);
  for (var i = 0; i < level.planets.length; i++) {
    var l = level.planets[i];
    var planet = new Planet(this.game, this.groups.planets,
                            l.x * SCREEN_WIDTH, l.y * SCREEN_HEIGHT,
                            l.radius,
                            l.sprite);
    this.ship.planet = planet;
  }
  
  // Link up all planets with beams
  this.groups.beams.removeAll(true);
  for (var i = 0; i < this.groups.planets.total; i++) {
    var planet1 = this.groups.planets.getAt(i);
    for (var j = i; j < this.groups.planets.total; j++) {
      var planet2 = this.groups.planets.getAt(j);
      var beam = new Beam(this.game, this.groups.beams, planet1, planet2);
      planet1.link(beam);
      planet2.link(beam);
    }
  }
  
  // Clear the rest
  this.groups.asteroids.removeAll(true);
  this.groups.bullets.removeAll(true);
  
  this.roidGenerator.setInterval(level.roidInterval);
};

GameState.prototype.update = function() {
  // Bullet to roid collisions
  this.game.physics.arcade.overlap(this.groups.asteroids, this.groups.bullets,
                                   function(roid, bullet) {
                                    bullet.destroy();
                                    roid.onHit(2);
                                    this.sounds.hit.play();
                                   }, null, this);
  // Roid to planet collisions
  for (var i = 0; i < this.groups.asteroids.total; i++) {
    var roid = this.groups.asteroids.getAt(i);
    for (var j = 0; j < this.groups.planets.total; j++) {
      var planet = this.groups.planets.getAt(j);
      if (planet.overlaps(roid)) {
        planet.onHit(roid.power);
        roid.onHit(roid.health + 1);
        // Check for dead planets
        if (planet.health < 0) {
          this.destroyPlanet(planet);
          this.groups.planets.remove(planet, true);
          j--;
        }
      }
    }
  }
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
  
  // Check which beam we're over
  var closestBeam = this.ship.planet.getLink(this.ship);
  for (var i = 0; i < this.groups.beams.total; i++) {
    var beam = this.groups.beams.getAt(i);
    if (beam === closestBeam) {
      beam.alpha = 1.0;
    } else {
      beam.alpha = BEAM_ALPHA;
    }
  }
  
  // Firing
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
    this.ship.fire();
  }
  // Jumping
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
    this.ship.jump();
  }
  
  // Spawn new asteroids
  this.roidGenerator.update();
};

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
  this.sounds.explode.play();
}

GameState.prototype.destroyPlanet = function(planet) {
  // Create explosion flames
  for (var k = 0; k < 100; k++) {
    var vel = new Phaser.Point(Math.random() - 0.5,
                               Math.random() - 0.5);
    vel.multiply(planet.width, planet.height);
    var explosion = this.game.add.sprite(planet.x - vel.x*0.5,
                                         planet.y - vel.y*0.5,
                                         'explosion');
    this.game.physics.arcade.enable(explosion);
    explosion.angle = Math.random() * 360;
    explosion.body.velocity.setTo(vel.x * -1.0, vel.y * -1.0);
    var anim = explosion.animations.add('play');
    anim.killOnComplete = true;
    anim.play(Math.random()*10 + 10);
  }
  this.groups.planets.remove(planet, true);
  this.sounds.big_explode.play();
}