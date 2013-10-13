(function run() {
    var control = document.querySelector(".control");
    // Used for diff behaviour simulation.
    var oldX = null;
    var oldY = null;


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


    function rpc(method, data, callback) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                if(!!callback) { callback(xmlhttp); }
            }
        };

        xmlhttp.open("POST", "/rpc/?m=" + method, true);
        xmlhttp.setRequestHeader("Content-type","application/json");
        xmlhttp.send(JSON.stringify(data));
    }


    // Attach control area events.
    control.onmousemove = rafWrap(moved);
    control.ontouchmove = rafWrap(touchMoved);
    control.onclick = clicked;
    control.ontouchend = touchEnded;
})();
