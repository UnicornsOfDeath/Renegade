var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
        var barBack = this.add.sprite(SCREEN_WIDTH / 2,
                                      SCREEN_HEIGHT / 2,
                                      'bar_back');
        barBack.anchor.setTo(0.5, 0.5);
        this.preloadBar = this.add.sprite(SCREEN_WIDTH / 2,
                                          SCREEN_HEIGHT / 2,
                                          'bar');
        this.preloadBar.anchor.setTo(0, 0.5);
        this.preloadBar.x -= this.preloadBar.width / 2;
        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.image('arrow', 'images/arrow.png');
        this.game.load.image('arrow_down', 'images/arrow_down.png');
        this.game.load.image('platform', 'images/platform.png');
        this.game.load.image('temp', 'images/temp.png');
        
        this.game.load.spritesheet('cat', 'images/cat.png', 128, 128);
        this.game.load.spritesheet('dog', 'images/dog.png', 128, 128);
        this.game.load.spritesheet('explosion', 'images/explosion.png', 16, 16);
        
        this.game.load.audio('bump', 'sounds/bump.wav');
        this.game.load.audio('jump', 'sounds/jump.wav');
        this.game.load.audio('land', 'sounds/land.wav');
        this.game.load.audio('explode', 'sounds/explode.wav');
        this.game.load.audio('step', 'sounds/step.ogg');
        for (var i = 0; i < NUM_SWOOSHES; i++) {
            this.game.load.audio('swoosh' + i, "sounds/sw/" + i + ".ogg");
        }
        for (var i = 0; i < NUM_HITS; i++) {
            this.game.load.audio('hit' + i, "sounds/hits/" + i + ".ogg");
        }
    },
    
    create: function () {
        this.state.start('game');
    }
};
