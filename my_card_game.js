var cT;

var c;
var hand;
var compressed;

$(document).ready(function() {
    cT = new CardTable();
    hand = new CardPile(document.body.clientWidth/2, document.body.clientHeight-15, {}, HandPile);
    compressed = new CardPile(document.body.clientWidth/2, document.body.clientHeight/2, {
        hover: {
            spread: {
                x: 300,
                angle: 0.2,
            },
            spreadFromHovered: {
                left: 50,
                right: 80
            }
        }
    }, CompressedPile);
    for (var i = 0; i < 10; i ++) {
        c = new NumberedCard(100, 130, i);
        hand.addCard(c);
        c = new NumberedCard(100, 130, i);
        compressed.addCard(c);
    }
    cT.addCardPile(hand);
    cT.addCardPile(compressed);
});

function f() {
    if (hand.cards.length < 7 || (Math.random() < 0.5 && hand.cards.length < 12)) {
        var c = new NumberedCard(100, 130, (Math.random()*20).toLocaleString())
        hand.addCard(c);
    }
    else {
        hand.removeNthCard(Math.floor(Math.random()*hand.cards.length));
    }
}
