
var PlayerController = function(gamepad, ship) {
    this.gamepad = gamepad;
    this.ship = ship;
}

PlayerController.prototype.update = function() {
    if (this.gamepad.connected) {
        var rightStickX = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        var rightStickY = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        
        console.log("x " + rightStickX);
        console.log("y " + rightStickY);
        
        if (rightStickX || rightStickY) {
            var angle = Math.atan2(rightStickY, rightStickX) * 180 / Math.PI + 90;
            this.ship.move(angle);
        }
        
        if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
            this.ship.fire();
        }
    }
}