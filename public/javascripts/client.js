(function run() {
    var control = document.querySelector(".control");
    // Used for diff behaviour simulation.
    var oldX = null;
    var oldY = null;

    var ws = null;

    // Establish Websocket connection with server.
    function connect() {
        ws = new WebSocket('ws://' + location.host);
        ws.onopen = function() {
            console.log("Connected to the server");
        };
    }

    function rpc(method, data) {
        // Ignore commands before Websocket channel is ready.
        if(!ws) { return; }

        var payload = JSON.stringify([
            method,
            data
        ]);

        ws.send(payload);
    }

    // Throttle calls with Request Animation Frame.
    function rafWrap(fn) {
        return function() {
            var args = arguments;
            var that = this;

            window.requestAnimationFrame(function() {
                fn.apply(that, args);
            });
        };
    }


    function moved(evt) {
        var diffX = evt.webkitMovementX;
        var diffY = evt.webkitMovementY;

        // Ignore "in-place" moves.
        if(!diffX && !diffY) { return; }

        // Send mouse move event.
        rpc("m", {x: diffX, y: diffY});
    }


    function touchMoved(evt) {
        evt.preventDefault();

        // Ignore anything but first thinger (for now).
        var touch = evt.targetTouches[0];
        var newX = touch.screenX;
        var newY = touch.screenY;

        // We have first diff, pass the move action.
        if(oldX !== null && oldY !== null) {
            rpc("m", {
                x: newX - oldX,
                y: newY - oldY
            });
        }

        // Store the new coordinates as previous for next call.
        oldX = newX;
        oldY = newY;
    }


    // Tap registered.
    function clicked(evt) {
        evt.preventDefault();
        rpc("c");
    }


    // Finger raised from surface.
    function touchEnded(evt) {
        // Reset old coordinates to prevent cursor skipping.
        oldX = null;
        oldY = null;
    }


    // Attach control area events.
    control.onmousemove = rafWrap(moved);
    control.ontouchmove = rafWrap(touchMoved);
    control.onclick = clicked;
    control.ontouchend = touchEnded;

    // Start Websocket.
    connect();
})();
