(function run() {
    var control = document.querySelector(".control");

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
        control.onmousemove = null;
        // TODO: Fall back to compatible event API.
        var diffX = evt.webkitMovementX;
        var diffY = evt.webkitMovementY;

        // Send mouse move event.
        rpc("move", {x: diffX, y: diffY});
    }


    function rpc(method, data, callback) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(xmlhttp);
            }
        }

        xmlhttp.open("POST", "/rpc/?m=" + method, true);
        xmlhttp.send(JSON.stringify(data));
    };
   

    // Attach control area events.
    control.onmousemove = rafWrap(moved);
})();