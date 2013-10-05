var x11 = require("x11");

var display = null;


function init() {
    x11.createClient(function(err, d) {
        if(!!err) {
            throw new Error(err);
        }

        display = d;
        console.log("Created X11 client.");
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


function move(diffX, diffY) {

}


module.exports.init = init;
module.exports.currentPosition = currentPosition;
module.exports.move = move;
