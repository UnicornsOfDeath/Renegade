var MenuState = function(game){};

MenuState.prototype.preload = function() {
    console.log("menu has been called preload")
};

MenuState.prototype.create = function() {
    this.game.menuImages = [
        this.game.add.sprite(200, 0, 'join_menu'),
        this.game.add.sprite(200, 150, 'join_menu'),
        this.game.add.sprite(200, 300, 'join_menu'),
        this.game.add.sprite(200, 450, 'join_menu')
    ]

    this.game.input.gamepad.start();

    this.game.gamepads = new Array();
};

MenuState.prototype.update = function() {

    if (this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.game.menuImages[0].loadTexture('cancel_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad1) < 0) {
            this.game.gamepads.push(this.game.input.gamepad.pad1)
        }
    }

    if (this.game.input.gamepad.pad2.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.game.menuImages[1].loadTexture('cancel_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad2) < 0) {
            this.game.gamepads.push(this.game.input.gamepad.pad2)
        }
    }

    if (this.game.input.gamepad.pad3.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.game.menuImages[2].loadTexture('cancel_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad3) < 0) {
            this.game.gamepads.push(this.game.input.gamepad.pad3)
        }
    }

    if (this.game.input.gamepad.pad4.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.game.menuImages[3].loadTexture('cancel_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad4) < 0) {
            this.game.gamepads.push(this.game.input.gamepad.pad4)
        }
    }

    if (this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_B)) {
        this.game.menuImages[0].loadTexture('join_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad1) >= 0) {
            this.game.gamepads.splice(this.game.gamepads.indexOf(this.game.input.gamepad.pad1), 1)
        }
    }

    if (this.game.input.gamepad.pad2.isDown(Phaser.Gamepad.XBOX360_B)) {
        this.game.menuImages[1].loadTexture('join_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad2) >= 0) {
            this.game.gamepads.splice(this.game.gamepads.indexOf(this.game.input.gamepad.pad2), 1)
        }
    }

    if (this.game.input.gamepad.pad3.isDown(Phaser.Gamepad.XBOX360_B)) {
        this.game.menuImages[2].loadTexture('join_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad3) >= 0) {
            this.game.gamepads.splice(this.game.gamepads.indexOf(this.game.input.gamepad.pad3), 1)
        }
    }

    if (this.game.input.gamepad.pad4.isDown(Phaser.Gamepad.XBOX360_B)) {
        this.game.menuImages[3].loadTexture('join_menu')
        if (this.game.gamepads.indexOf(this.game.input.gamepad.pad4) >= 0) {
            this.game.gamepads.splice(this.game.gamepads.indexOf(this.game.input.gamepad.pad4), 1)
        }
    }

    if (this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_START)) {
        this.state.start('game');
    }
};

MenuState.prototype.render = function() {
    //this.game.debug.body(this.ship);
}