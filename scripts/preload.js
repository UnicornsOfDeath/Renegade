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
        this.game.load.image('join_menu', 'images/join_menu.png');
        this.game.load.image('cancel_menu', 'images/cancel_menu.png');
        this.game.load.image('gauge_front', 'images/gauge_front.png');
        this.game.load.image('gauge_back', 'images/gauge_back.png');

        this.game.load.spritesheet('explosion', 'images/explosion.png', 16, 16);
        this.game.load.spritesheet('health', 'images/health.png', 57, 10);

        this.game.load.audio('death', 'sounds/death.wav');
        this.game.load.audio('shot', 'sounds/shot.wav');
        this.game.load.audio('hit', 'sounds/hit.wav');
        this.game.load.audio('hit1', 'sounds/impact1.wav');
        this.game.load.audio('hit2', 'sounds/impact2.wav');
        this.game.load.audio('hit3', 'sounds/impact3.wav');
        this.game.load.audio('explode', 'sounds/explode.wav');
        this.game.load.audio('big_explode', 'sounds/big_explode.mp3');
    },
    
    create: function () {
        this.state.start('menu');
    }
};
