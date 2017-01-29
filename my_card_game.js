var cT;

var c;
var cP;

$(document).ready(function() {
    cT = new CardTable();
    cP = new CardPile(document.body.clientWidth/2, document.body.clientHeight-15);
    for (var i = 0; i < 10; i ++) {
        c = new Card(100, 130);
        cP.addCard(c);
    }
    cT.addCardPile(cP);
})
