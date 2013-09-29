var mouse = require("../mouse");

exports.index = function(req, res) {
    mouse.currentPosition(function(position) {
        res.render('index', {
            x: position[0],
            y: position[1]
        });
    });
};
