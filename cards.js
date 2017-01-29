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

        //canvas.width = $(document).width();
        //canvas.height = $(document).height();

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

class Ctx {
    constructor(ctx) {
        this.raw_ctx = ctx;
    }

    wipe() {
        this.raw_ctx.clearRect(-10, -10, $(document).width()+20, $(document).height()+20);
    }

    ellipse(x, y, w, h) {
        this.raw_ctx.beginPath();
        h = h || w
        this.raw_ctx.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
        this.raw_ctx.fill();
    }

    black() {
        this.raw_ctx.fillStyle = "black";
    }

    fill(col) {
        this.raw_ctx.fillStyle = col;
    }

    stroke(col) {
        this.raw_ctx.strokeStyle = col;
    }

    spot(x, y) {
        this.ellipse(x, y, 5, 5);
    }

    text(str, x, y) {
        this.raw_ctx.fillText(str, x, y);
    }

    save() {
        this.raw_ctx.save();
    }

    restore() {
        this.raw_ctx.restore();
    }

    rect(x, y, w, h) {
        this.raw_ctx.fillRect(x, y, w, h);
    }

    strokeRect(x, y, w, h) {
        this.raw_ctx.strokeRect(x, y, w, h);
    }

    translate(x, y) {
        this.raw_ctx.translate(x, y);
    }

    rotate(q) {
        this.raw_ctx.rotate(q);
    }
}

class CardTable {
    constructor() {
        this.canvas = createCanvas();
        this.ctx = new Ctx(this.canvas.getContext("2d"));

        $( "body" ).prepend( this.canvas );

        this.card_piles = [];
        this.beginLoop();
        this.fps = 0;
    }

    beginLoop() {
        this.lastFrame = Date.now();
        this.loop();
    }

    loop() {
        this.canvasW = document.body.clientWidth;
        this.canvasH = document.body.clientHeight;
        this.canvas.width = this.canvasW;
        this.canvas.height = this.canvasH;

        var thisFrame = Date.now();
        var elapsed = thisFrame - this.lastFrame;

        window.requestAnimationFrame(() => {this.loop()});

        this.update(elapsed);
        this.draw();

        this.lastFrame = thisFrame;
    }

    update(elapsed) {
        this.fps = Math.floor(0.8 * this.fps + 0.2 * 1000/elapsed);
        for (var card_pile of this.card_piles) {
            card_pile.update(elapsed);
        }
    }

    draw() {
        this.ctx.wipe();
        this.ctx.black();

        for (var card_pile of this.card_piles) {
            card_pile.draw(this.ctx);
        }
    }

    addCardPile(cardPile) {
        this.card_piles.push(cardPile);
    }
}

class Card {
    constructor(width, height, anchor="bottom") {
        this.width = width;
        this.height = height;
        this.anchor = anchor;

        this.transform = new Transform();
        this.target = new Transform();
        this.hovered = false;

        this.scale = 1;
        this.targetScale = 1;
    }

    mouseCollides(mouse) {
        var anch = this.adjustAnchor();
        if (this.transform.position.x < mouse.x - anch.x && mouse.x - anch.x < this.transform.position.x + this.width * this.scale) {
            if (this.transform.position.y < mouse.y - anch.y && mouse.y - anch.y < this.transform.position.y + this.height * this.scale) {
                return true;
            }
        }
        return false;
    }

    adjustAnchor() {
        var x, y;
        switch(this.anchor) {
            case "bottom":
                x = -this.width/2;
                y = -this.height;
                break;
            case "center":
                x = -this.width/2;
                y = -this.height/2;
                break;
            case "top":
                x = -this.width/2;
                y = 0;
                break;
        }
        return {x: x * this.scale, y: y * this.scale};
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.transform.position.x, this.transform.position.y);
        ctx.rotate(this.transform.rotation);
        ctx.fill('white');
        ctx.stroke('black');
        var anch = this.adjustAnchor();
        ctx.rect(anch.x, anch.y, this.width * this.scale, this.height * this.scale);
        ctx.strokeRect(anch.x, anch.y, this.width * this.scale, this.height * this.scale);
        ctx.restore();
    }

    update(elapsed) {
        this.transform.position.x = Math.max(0, 0.15) * this.target.position.x + 0.85 * this.transform.position.x;
        this.transform.position.y = Math.max(0, 0.15) * this.target.position.y + 0.85 * this.transform.position.y;
        this.transform.rotation = 0.15 * this.target.rotation + 0.85 * this.transform.rotation;
        if (this.hovered) {
            this.targetScale = 1.6;
        } else {
            this.targetScale = 1;
        }
        this.scale = 0.15 * this.targetScale + 0.85 * this.scale;
    }
}

function map(x, a, b, c, d) {
    if (c === d) {
        return c;
    }
    if (a === b) {
        return (c/2 + d/2);
    }
    return c + (x-a) * (d-c)/(b-a);
}

class Transform {
    constructor() {
        this.position = {x: 0, y: 0};
        this.rotation = 0;
    }
}

class CardPile {
    constructor(x, y, options={}) {
        this.x = x;
        this.y = y;
        this.horizontalSpread = options.horizontalSpread || 500;
        this.verticalSpread = options.verticalSpread || 0;
        this.angleSpread = options.angleSpread || 0;
        this.disturbance = options.disturbance || 0;
        this.angleDisturbance = options.disturbance || 0;
        this.cards = [];
    }

    update(elapsed) {
        var m = {x: Mouse.x - this.x, y: Mouse.y - this.y};
        var i = 0;

        var changed = false;
        var skip = false;
        for (var i = 0; i < this.cards.length; i ++) {
            var card = this.cards[i];
            if (card.hovered && card.mouseCollides(m)) {
                skip = true;
            }
        }

        if (!skip) {
            for (i = this.cards.length - 1; i >= 0; i --) {
                var card = this.cards[i];
                if (card.mouseCollides(m)) {
                    if (!card.hovered) {
                        changed = true;
                    }
                    card.hovered = true;
                    break;
                } else {
                    if (card.hovered) {
                        changed = true;
                    }
                    card.hovered = false;
                }
            } i--;
            for (; i >= 0; i --) {
                if (this.cards[i].hovered) {
                    changed = true;
                }
                this.cards[i].hovered = false;
            }
        }
        for (var card of this.cards) {
            card.update(elapsed);
        }
        if (changed) {
            this.updateTransforms();
        }
    }

    updateTransforms() {
        for (var i = 0; i < this.cards.length; i ++) {
            var card = this.cards[i];
            card.target.position.x = map(i, 0, this.cards.length - 1, -this.horizontalSpread/2, this.horizontalSpread/2) + Math.random() * this.disturbance;
            card.target.position.y = map(i, 0, this.cards.length - 1, -this.verticalSpread/2, this.verticalSpread/2) + Math.random() * this.disturbance;

            card.target.rotation = map(i, 0, this.cards.length - 1, -this.angleSpread/2, this.angleSpread/2) + Math.random() * this.angleDisturbance;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        for (var i = 0; i < this.cards.length; i ++) {
            var card = this.cards[i];
            card.draw(ctx);
        }
        for (var i = 0; i < this.cards.length; i ++) {
            if (this.cards[i].hovered) {
                this.cards[i].draw(ctx);
            }
        }
        ctx.restore();
    }

    addCard(card) {
        this.cards.push(card);
        this.updateTransforms();
    }
}

function createCanvas() {
    var canvas = $( "<canvas></canvas>" ).attr( "id", "canvas" )[0];
    $( canvas ).css({
        "display": "block",
    });
    $( canvas ).mousemove(function(event) {
        var parentOffset = $(this).parent().offset();
        Mouse.x = event.pageX - parentOffset.left;
        Mouse.y = event.pageY - parentOffset.top;
    })
    return canvas;
}

var Mouse = {
    x: -1000,
    y: -1000,
}

$(document).ready(function() {
    $( "html" ).css({"overflow": "hidden", "height": "100%"});
    $( "body" ).css({"overflow": "hidden", "height": "100%"});

    document.addEventListener
});
