var x11 = require("x11");

var ACCEL = 1.75;

var display = null;
var screenSize = null;


function init() {
    x11.createClient(function(err, d) {
        if(!!err) {
            throw new Error(err);
        }

        display = d;
        console.log("Created X11 client.");

        // Fetch viewport size.
        var root = display.screen[0].root;
        display.client.GetGeometry(root, function(err, result) {
            screenSize = [result.width, result.height];
        });
    });
}


function checkInit() {
    if(display === null) {
        throw new Error("X11 hasn't been initialized yet.");
    }
    return true;
}


function currentPosition(callback) {
    checkInit();
    var root = display.screen[0].root;
   
    display.client.QueryPointer(root, function(err, result) {
        if(!!err) {
            throw new Error(err);
        }

        callback([result.rootX, result.rootY]);
    });
}


function changePosition(x, y) {
    var root = display.screen[0].root;
    display.client.WarpPointer(0, root, 0, 0, 0, 0, parseInt(x), parseInt(y));
}


function move(diffX, diffY) {
    currentPosition(function(current) {
        // Pseudo-acceleration.
        if(Math.abs(diffX) > 3) { diffX *= ACCEL; }
        if(Math.abs(diffY) > 3) { diffY *= ACCEL; }

        // Update position based on current one.
        var newX = current[0] + diffX;
        var newY = current[1] + diffY;

        changePosition(
            // Don't go outside the screen.
            Math.min(newX, screenSize[0]),
            Math.min(newY, screenSize[1])
        );
    });
}


module.exports.init = init;
module.exports.currentPosition = currentPosition;
module.exports.move = move;
