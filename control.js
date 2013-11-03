var mouse = require("./mouse");


function handleRPC(payload) {
    var content = JSON.parse(payload);

    var method = content[0];
    var data = content[1];

    if(method === "c") {
        return mouse.click();
    }

    if(method === "m") {
        return mouse.move(data.x, data.y);
    }

    console.error("Unrecognized RPC method: " + method);
}


module.exports = handleRPC;
