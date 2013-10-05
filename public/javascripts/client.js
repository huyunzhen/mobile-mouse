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
        // TODO: Fall back to compatible event API.
        var diffX = evt.webkitMovementX;
        var diffY = evt.webkitMovementY;

        console.log("Moved X: " + diffX + " Y: " + diffY);
    }
   

    // Attach control area events.
    control.onmousemove = rafWrap(moved);
})();
