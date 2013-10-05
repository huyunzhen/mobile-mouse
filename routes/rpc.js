var mouse = require("../mouse");

module.exports = function(req, res) {
    console.log(req.query);
    console.log(req.body);

    res.send(200);

    /*mouse.currentPosition(function(position) {
        res.json({
            position: position
        });
    });*/
};
