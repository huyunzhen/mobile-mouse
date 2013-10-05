var mouse = require("../mouse");

module.exports = function(req, res) {
    var method = req.query.m;
    if(!method) { 
        return res.send(500, "Missing method"); 
    }

    if(method === "m") {
        mouse.move(req.body.x, req.body.y);
        return res.send(200);
    }
    
    res.send(500, "Unknown method");
};
