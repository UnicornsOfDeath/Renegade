var DirectionArrow = function(game, parent) {
  Phaser.Sprite.call(this,
                     game,
                     0, 0,
                     'arrow');
  this.anchor.x = -3;
  parent.addChild(this);
};
DirectionArrow.prototype = Object.create(Phaser.Sprite.prototype);
DirectionArrow.prototype.constructor = DirectionArrow;

DirectionArrow.prototype.move = function(dx, dy) {
  if (Math.abs(dx) > 0) {
    if (dy > 0) {
      // diagonal up
      this.angle = -45;
    } else if (dy < 0) {
      // diagonal down
      this.angle = 45;
    } else {
      // straight
      this.angle = 0;
    }
  } else {
    if (dy > 0) {
      // up
      this.angle = -90;
    } else if (dy < 0) {
      // down
      this.angle = 90;
    }
  }
  this.visible = Math.abs(dx) > 0 || Math.abs(dy) > 0;
};


var Jumper = function(game, theGame, group, hitGroup, x, y, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     sprite);
  this.theGame = theGame;
  this.anchor.setTo(0.48, 0.6);
  game.physics.arcade.enable(this);
  this.body.setSize(25, 50, 0, 11);
  this.body.gravity.y = GRAVITY;
  group.add(this);

  this.directionArrow = new DirectionArrow(game, this);

  this.speed = 200;
  this.accel = 25;
  this.decelScalar = 0.8;
  this.jumpSpeed = GRAVITY * -0.8;
  
  this.animations.add('idle', arrayRange(0, 3), 10, true);
  this.animations.add('run', arrayRange(16, 23), 20, true);
  this.animations.add('jump', arrayRange(34, 35), 10, true);
  this.animations.add('hit', arrayRange(144, 150), 13, false);
  this.animations.add('hit_up', arrayRange(128, 140), 20, false);
  this.animations.add('hurt', arrayRange(65, 72), 15, false);
  this.animations.play('idle');
  this.directionArrow.visible = false;
  this.state = 'active';
  this.hitGroup = hitGroup;
  
  this.theGame.sounds.step.play('', 0, 0.5, true);
};
Jumper.prototype = Object.create(Phaser.Sprite.prototype);
Jumper.prototype.constructor = Jumper;

Jumper.prototype.setPose = function(pose) {
  // Don't change pose if inactive
  if (this.state != 'active') {
    return;
  }
  this.animations.play(pose);
};

Jumper.prototype.run = function(dir) {
  this.body.velocity.x += dir * this.accel;
  this.body.velocity.x = Phaser.Math.clamp(this.body.velocity.x,
                                           -this.speed, this.speed);
  // Turning around
  this.turn(this.body.velocity.x);
  if (this.body.touching.down) {
    this.setPose('run');
  }
};

Jumper.prototype.stop = function() {
  // Can't stop if taking hit
  if (this.body.touching.down && this.state != 'hurt') {
    this.body.velocity.x *= this.decelScalar;
  }
};

Jumper.prototype.move = function(dx, dy) {
  // Can't move when not active
  if (this.state != 'active') {
    return;
  }
  if (Math.abs(dx) > 0) {
    this.run(dx);
  } else {
    this.stop();
  }
  this.directionArrow.move(dx, dy);
};

Jumper.prototype.jump = function() {
  if (this.body.touching.down) {
    this.body.velocity.y = this.jumpSpeed;
    this.theGame.sounds.jump.play();
  }
};

Jumper.prototype.attack = function(dx, dy) {
  if (this.state == 'attacking') {
    return;
  }
  if (dx === 0 && dy === 0) {
    if (this.scale.x > 0) {
      dx = 1;
    } else {
      dx = -1;
    }
  }
  // Turn the right way
  this.turn(dx);
  
  var animName = 'hit';
  if (dy > 0) {
    animName = 'hit_up';
  }
  arrayRandomChoice(this.theGame.sounds.swooshes).play();
  var a = this.animations.play(animName);
  this.state = 'attacking';
  this.body.moves = false;
  a.onComplete.add(function() {
    this.state = 'active';
    this.body.moves = true;
  }, this);
  
  // Add a hitbox
  var hitbox = this.game.add.sprite(this.x, this.y, 'temp', 0, this.hitGroup);
  if (dy <= 0) {
    hitbox.x += dx * 36;
    hitbox.anchor.setTo(0.5, 0.35);
    hitbox.scale.setTo(72, 48);
  } else {
    // Uppercut!
    hitbox.x += dx * 16;
    hitbox.y -= 36;
    hitbox.anchor.setTo(0.5, 0.5);
    hitbox.scale.setTo(64, 72);
  }
  hitbox.alpha = 0.1;
  this.game.physics.arcade.enable(hitbox);
  // Hitbox lasts as long as the hit animation
  hitbox.lifespan = a.frameTotal * 1000.0 / a.speed;
  // Save the player's hit direction as this is where the enemy shall fly
  hitbox.dx = dx;
  hitbox.dy = dy;
  // Marker to remember whether this hit landed
  hitbox.hasHit = false;
};

Jumper.prototype.update = function() {
  // Landing, bumping
  if (this.body.touching.down && !this.body.wasTouching.down) {
    this.land();
  } else if (this.body.touching.up && !this.body.wasTouching.up) {
    // bump head
    this.theGame.sounds.bump.play();
  }
  
  // Running, stopping
  if (this.body.touching.down && Math.abs(this.body.velocity.x) > 10) {
    if (!this.theGame.sounds.step.isPlaying) {
      this.theGame.sounds.step.resume();
    }
  } else {
    this.theGame.sounds.step.pause();
    if (this.body.touching.down) {
      this.setPose('idle');
    }
  }
  
  // In air
  if (!this.body.touching.down) {
    this.setPose('jump');
  }
  
  this.game.debug.body(this);
};

Jumper.prototype.land = function() {
  this.theGame.sounds.land.play('', 0, 0.7);
  if (this.body.touching.down) {
    this.setPose('run');
  }
};

Jumper.prototype.takeHit = function(hit) {
  var impulse = {x: 200, y:400};
  this.body.velocity.x = hit.dx * impulse.x;
  this.body.velocity.y = -hit.dy * impulse.y;
  // Add a random impulse so hurt jumpers together don't end up together
  this.body.velocity.x += randInt(-30, 30);
  this.body.velocity.y += randInt(-30, 30);
  // Be hurt
  var a = this.animations.play('hurt');
  this.state = 'hurt';
  // Temporarily enable bouncing when hurt
  this.body.bounce.setTo(0.5, 0.5);
  a.onComplete.add(function() {
    this.state = 'active';
    this.body.bounce.setTo(0, 0);
  }, this);
};

Jumper.prototype.turn = function(dx) {
  if (dx < 0 ^ this.scale.x < 0) {
    this.scale.x *= -1;
  }
};
