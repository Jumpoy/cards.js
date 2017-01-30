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
        this.raw_ctx.clearRect(-10, -10, $(document).width() + 20, $(document).height() + 20);
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

        $("body").prepend(this.canvas);

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

        window.requestAnimationFrame(() => {
            this.loop()
        });

        this.update(elapsed);
        this.draw();

        this.lastFrame = thisFrame;
    }

    update(elapsed) {
        this.fps = Math.floor(0.8 * this.fps + 0.2 * 1000 / elapsed);
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
    constructor(width, height, anchor = "bottom") {
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
        switch (this.anchor) {
            case "bottom":
                x = -this.width / 2;
                y = -this.height;
                break;
            case "center":
                x = -this.width / 2;
                y = -this.height / 2;
                break;
            case "top":
                x = -this.width / 2;
                y = 0;
                break;
        }
        return {
            x: x * this.scale,
            y: y * this.scale
        };
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.transform.position.x, this.transform.position.y);
        ctx.rotate(this.transform.rotation);
        //ctx.fill('white');
        //ctx.stroke('black');
        var anch = this.adjustAnchor();
        this.drawCard(ctx, anch.x, anch.y, this.width * this.scale, this.height * this.scale);
        //ctx.strokeRect(anch.x, anch.y, this.width * this.scale, this.height * this.scale);
        ctx.restore();
    }

    drawCard(ctx, x, y, w, h) {
        ctx.fill('white');
        ctx.stroke('black');
        ctx.rect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
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

class NumberedCard extends Card {
    constructor(width, height, num, anchor="bottom") {
        super(width, height, anchor);
        this.num = num;
    }

    drawCard(ctx, x, y, w, h) {
        ctx.fill('white');
        ctx.stroke('black');
        ctx.rect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.fill('black');
        ctx.text(this.num, x+5, y+15)
        ctx.ellipse(x + w/2, y + h/2, 10, 10);
    }
}

function map(x, a, b, c, d) {
    if (c === d) {
        return c;
    }
    if (a === b) {
        return (c / 2 + d / 2);
    }
    return c + (x - a) * (d - c) / (b - a);
}

class Transform {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };
        this.rotation = 0;
    }
}

const CompressedPile = {
    spread: {
        x: 0,
        y: 0,
        angle: 0,
    },
    disturbance: {
        x: 0,
        y: 0,
        angle: 0,
    },
    spreadFromHovered: {
        left: 50,
        right: 120,
    },
    leftOnTop: false,
    hover: {
        spreadFromHovered: {
            left: 50,
            right: 106,
        },
        enabled: true,
        spread: {
            x: 200,
            y: 0,
            angle: 0,
        },
        disturbance: {
            x: 0,
            y: 0,
            angle: 0,
        }
    },
}

const HandPile = {
    spread: {
        x: 500,
        y: 0,
        angle: 0,
    },
    disturbance: {
        x: 0,
        y: 0,
        angle: 0,
    },
    spreadFromHovered: {
        left: 20,
        right: 70,
    },
    leftOnTop: false,
    hover: {
        spreadFromHovered: {
            left: 0,
            right: 0,
        },
        enabled: false,
        spread: {
            x: 200,
            y: 0,
            angle: 0,
        },
        disturbance: {
            x: 0,
            y: 0,
            angle: 0,
        }
    },
}

class CardPile {
    constructor(x, y, options, base) {
        base = base || CompressedPile;
        options = options || {};
        this.transform = new Transform();
        this.transform.position.x = x;
        this.transform.position.y = y;
        this.options = $.extend(true, base, options);

        this.hovered = false;
        this.hovered_index = -1;

        this.cards = [];
    }

    update(elapsed) {
        var m = {
            x: Mouse.x - this.transform.position.x,
            y: Mouse.y - this.transform.position.y
        };
        var i = 0;

        this.hovered = false;

        var changed = false;
        var skip = false;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (card.hovered && card.mouseCollides(m)) {
                skip = true;
                this.hovered = true;
                this.hovered_index = i;
            }
        }

        if (!skip) {
            for (i = this.cards.length - 1; i >= 0; i--) {
                var card = this.cards[i];
                if (card.mouseCollides(m)) {
                    if (!card.hovered) {
                        changed = true;
                    }
                    card.hovered = true;
                    this.hovered = true;
                    this.hovered_index = i;
                    break;
                } else {
                    if (card.hovered) {
                        changed = true;
                    }
                    card.hovered = false;
                }
            }
            i--;
            for (; i >= 0; i--) {
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
        var opt = this.hovered && this.options.hover.enabled ? this.options.hover : this.options;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            card.target.position.x = map(i, 0, this.cards.length - 1,
                    (opt.leftOnTop ? -1 : 1) * -opt.spread.x / 2,
                    (opt.leftOnTop ? -1 : 1) * opt.spread.x / 2) +
                Math.random() * opt.disturbance.x;

            card.target.position.y = map(i, 0, this.cards.length - 1,
                    -opt.spread.y / 2, opt.spread.y / 2) +
                Math.random() * opt.disturbance.y;

            card.target.rotation = map(i, 0, this.cards.length - 1, -opt.spread.angle / 2, opt.spread.angle / 2) + Math.random() * opt.disturbance.angle;
        }

        for (var i = 0; i < this.cards.length; i++) {
            if (this.hovered) {
                if (i < this.hovered_index) {
                    this.cards[i].target.position.x -= opt.spreadFromHovered.left;
                }
                if (i > this.hovered_index) {
                    this.cards[i].target.position.x += opt.spreadFromHovered.right;
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.transform.position.x, this.transform.position.y);
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            card.draw(ctx);
        }
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].hovered) {
                this.cards[i].draw(ctx);
            }
        }
        ctx.restore();
    }

    addCard(card) {
        this.cards.push(card);
        console.log(card);
        this.updateTransforms();
    }

    removeCard(card) {
        for (var i = 0; i < this.cards.length; i ++) {
            if (this.cards[i] === card) {
                this.cards.splice(i, 1);
                break;
            }
        }
        this.updateTransforms();
    }

    removeNthCard(n) {
        this.cards.splice(n, 1);
        this.updateTransforms();
    }
}

function createCanvas() {
    var canvas = $("<canvas></canvas>").attr("id", "canvas")[0];
    $(canvas).css({
        "display": "block",
    });
    $(canvas).mousemove(function(event) {
        var parentOffset = $(this).parent().offset();
        Mouse.x = event.pageX - parentOffset.left;
        Mouse.y = event.pageY - parentOffset.top;
    })
    $(canvas).on('click', function() {
        f();
    })
    return canvas;
}

var Mouse = {
    x: -1000,
    y: -1000,
}

$(document).ready(function() {
    $("html").css({
        "overflow": "hidden",
        "height": "100%"
    });
    $("body").css({
        "overflow": "hidden",
        "height": "100%"
    });

});
