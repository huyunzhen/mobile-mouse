var mouse = require("../mouse");

module.exports = function(req, res) {
    mouse.currentPosition(function(position) {
        res.json({
            position: position
        });
    });
};
