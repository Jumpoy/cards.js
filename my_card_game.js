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
];

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
];

$(document).ready(function() {
    cT = new CardTable();
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    hand = new CardPile(w/3, h-15, {spread: {x: 80}}, SteadyHand);
    hand.resize = function(w, h) {
        this.transform.position.x = w/3;
        this.transform.position.y = h-15;
    }
    firstrow = new CardPile(w/2, h/2 - 173/2 - 24, {
        spread: {
            x: 92
        }
    }, DisplayRow);
    //firstrow.rect = makeRect(108, 173, "top");
    firstrow.resize = function(w, h) {
        this.transform.position.x = w/2;
        this.transform.position.y = h/2 - 173/2 - 30;

    }
    secondrow = new CardPile(w/2, h/2 + 173/2 - 20, {
        spread: {
            x: 92
        }
    }, DisplayRow);
    secondrow.resize = function(w, h) {
        this.move(firstrow.bottom);
    }
    for (var i = 0; i < 5; i ++) {
        var img;
        if (i < 3) {
            img = copper;
        }
        else {
            img = estate;
        }
        c = new PictureCard(108*1.2, 173*1.2, img);
        hand.addCard(c);
    }
    for (var link of firstrows) {
        c = new BorderedPictureCard(108, 173, link, 10, "center");
        c.onClick = function() {
            this.num --;
        }
        firstrow.addCard(c);
    }
    for (var link of secondrows) {
        c = new BorderedPictureCard(108, 173, link, 10, "top");
        c.onClick = function() {
            this.num --;
        }
        secondrow.addCard(c);
    }
    cT.addCardPile(hand);
    cT.addCardPile(firstrow);
    cT.addCardPile(secondrow);

    cT.beginLoop();
});
