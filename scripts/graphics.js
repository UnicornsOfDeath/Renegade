var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 576;

var GRAVITY = 500;

var NUM_SWOOSHES = 6;
var NUM_HITS = 18;

function arrayRange(start, end) {
    var a = [];
    for (var i = start; i <= end; i++) {
        a.push(i);
    }
    return a;
}

function arrayRandomChoice(a) {
    return a[Math.floor(Math.random() * a.length)];
}

function randInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}