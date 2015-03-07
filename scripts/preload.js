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
    
        this.game.load.image('heavy', 'images/heavy.png');
        this.game.load.image('player', 'images/player.png');
        this.game.load.image('bullet', 'images/bullet.png');
        this.game.load.image('bullet_heavy', 'images/bullet_heavy.png');
        this.game.load.image('beam', 'images/beam.png');
        this.game.load.image('roid0', 'images/roid0.png');
        this.game.load.image('ground', 'images/ground.png');
        
        this.game.load.spritesheet('explosion', 'images/explosion.png', 16, 16);
        
        this.game.load.audio('shot', 'sounds/shot.wav');
        this.game.load.audio('hit', 'sounds/hit.wav');
        this.game.load.audio('jump', 'sounds/jump.wav');
        this.game.load.audio('explode', 'sounds/explode.wav');
        this.game.load.audio('big_explode', 'sounds/big_explode.mp3');
    },
    
    create: function () {
        this.state.start('game');
    }
};
