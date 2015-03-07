// Colours
var COLOR_MAIN = 0x0064BF;
var COLOR_DARK = 0x00437F;
var COLOR_LIGHT = 0x0085FF;
var COLOR_DARKER = 0x002140;
var COLOR_ALT = 0x0078E5;

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 576;

var SCALE = 0.3;

function angleToPoint(angle, magnitude) {
  var radians = angle * Math.PI / 180;
  var point = new Phaser.Point(Math.sin(radians),
                               -Math.cos(radians));
  point.setMagnitude(magnitude);
  return point;
}