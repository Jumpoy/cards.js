var canvas,
    ctx,
    currentScreen;

var width,
    height;

var update,
    draw,
    setup;

var mousePressed;

var MOUSE = {
    x: 0,
    y: 0,
}

var PI = Math.PI;

function beginLoop() {

    var frameId = 0;
    var lastFrame = Date.now();

    function loop() {
        var thisFrame = Date.now();

        var elapsed = thisFrame - lastFrame;

        frameId = window.requestAnimationFrame(loop);

        if (update !== undefined) {
            update(elapsed);
        }

        if (draw !== undefined) {
            draw();
        }

        lastFrame = thisFrame;
    }

    loop();
}

window.onload = function() {

}
