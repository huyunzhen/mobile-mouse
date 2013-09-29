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

module.exports.init = init;
