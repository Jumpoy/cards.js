var cT;

var c;
var hand;
var firstrow;
var secondrow;

var copper = 'http://dominion-o-dude.herokuapp.com/static/images/scans/common/copper.jpg';
var estate = 'http://dominion-o-dude.herokuapp.com/static/images/scans/common/estate.jpg';

var firstrows = [
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/copper.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/silver.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/gold.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/estate.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/duchy.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/province.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/common/curse.jpg'
]

var secondrows = [
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/moat.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/cellar.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/workshop.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/woodcutter.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/bureaucrat.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/remodel.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/throneroom.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/witch.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/festival.jpg',
    'http://dominion-o-dude.herokuapp.com/static/images/scans/base/market.jpg',
]

$(document).ready(function() {
    cT = new CardTable();
    hand = new CardPile(document.body.clientWidth/2, document.body.clientHeight-15, {}, SteadyHand);
    firstrow = new CardPile(document.body.clientWidth/2, document.body.clientHeight/2 - 173/2 - 24, {
        spread: {
            x: 92
        }
    }, DisplayRow);
    secondrow = new CardPile(document.body.clientWidth/2, document.body.clientHeight/2 + 173/2 + 10, {
        spread: {
            x: 92
        }
    }, DisplayRow);
    for (var i = 0; i < 5; i ++) {
        if (i < 3) {
            c = new PictureCard(108, 173, copper);
        }
        else {
            c = new PictureCard(108, 173, estate);
        }
        hand.addCard(c);
    }
    for (var link of firstrows) {
        c = new PictureCard(108, 173, link, "center");
        firstrow.addCard(c);
    }
    for (var link of secondrows) {
        c = new PictureCard(108, 173, link, "center");
        secondrow.addCard(c);
    }
    cT.addCardPile(hand);
    cT.addCardPile(firstrow);
    cT.addCardPile(secondrow);
});
