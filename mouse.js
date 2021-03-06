var x11 = require("x11");

var ACCEL = 2.0;

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


function currentPosition(callback) {
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
    display.client.WarpPointer(0, root, 0, 0, 0, 0,
                               parseInt(x, 10),
                               parseInt(y, 10)
    );
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


function click(button) {
    if(button === undefined) {
        button = 1;
    }

    var root = display.screen[0].root;

    display.client.require('xtest', function(Test) {
        Test.FakeInput(Test.ButtonPress, button, 0, root, 0, 0);
        Test.FakeInput(Test.ButtonRelease, button, 0, root, 0, 0);
    });
}


module.exports.init = init;
module.exports.currentPosition = currentPosition;
module.exports.move = move;
module.exports.click = click;
