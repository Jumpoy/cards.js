var cT;

var c;
var hand;
var firstrow;
var secondrow;

var discard;

var buttons;

var playerlist;

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

class PlayerInfoCard extends Card {
    constructor(name, info) {
        super();
        this.name = name;
        this.info = info;
    }

    drawCard(ctx, x, y, w, h) {
        ctx.stroke('black');
        ctx.fill('#15f698');
        ctx.rect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.fill('black');
        ctx.font('sans-serif', 32);
        y += 15;
        ctx.centerText(this.name, x + w/2, y + 30);
        ctx.font('sans-serif', 13);
        var myString = 'Deck: ' + this.info.deck + ' | Hand: ' + this.info.hand + ' | VP: ' + this.info.vp;
        ctx.centerText(myString, x + w/2, y + 58);
        ctx.font('sans-serif', 16)
        ctx.centerText(this.info.status, x + w/2, y + 83);
        ctx.font('sans-serif', 13);
        myString = 'Actions: ' + this.info.actions + ' | Buys: ' + this.info.buys + ' | Gold: ' + this.info.gold;
        ctx.centerText(myString, x + w/2, y + 108);
    }
}

function copy(obj) {
    return $.extend(true, {}, obj);
}

$(document).ready(function() {

    // Initialise card table
    cT = new CardTable();

    // Create hand
    hand = new CardPile(0, 0, 108*1.2, 173*1.2, "bottom", {spread: {centered: false, x: 80}}, copy(SteadyHand));
    hand.resize = function(w, h) {
        this.transform.position.x = w/10;
        this.transform.position.y = h;
    }

    // Create discard
    discard = new CardPile(0, 0, 108*1.2, 173*1.2, "bottom", {
        hover: {
            spread: {
                centered: false,
                fromRight: true,
                perCard: true,
                x: -60,
                leftOnTop: true

            },
            spreadFromHovered: {
                right: 70,
                //left: 20
            },
        }
    }, CompressedPile);
    discard.resize = function(w, h) {
        this.transform.position.x = w * 9/10;
        this.transform.position.y = h;
    }

    // Create first row
    firstrow = new CardPile(0, 0, 108, 173, "center", {
        spread: {
            x: 108
        }
    }, copy(DisplayRow));
    firstrow.resize = function(w, h) {
        this.transform.position.x = w/2;
        this.transform.position.y = h/2 - 173/2 - 30;
    }

    // Create second row
    secondrow = new CardPile(0, 0, 108, 173, "center", {
        spread: {
            x: 108
        }
    }, copy(DisplayRow));
    secondrow.resize = function(w, h) {
        // Puts the BOTTOM of the first row at the TOP of this row
        this.move(firstrow.bottom, "top");
    }

    // Initialise player list
    playerlist = new CardPile(0, 0, 210, 143, "top", {
        spread: {
            x: 215
        },
        hoveredCard: {enabled: false}
    }, copy(DisplayRow));
    playerlist.resize = function(w, h) {
        this.transform.position.x = w/2;
        this.transform.position.y = 0;
    }

    buttons = new CardPile(0, 0, 200, 50, "top", {
        spread: {
            x: 0,
            y: 50,
            centered: false,
            fromRight: true,
        },
        hoveredCard: {enabled: false},
    }, copy(DisplayRow));
    buttons.resize = function(w, h) {
        this.transform.position.x = 120;
        this.transform.position.y = 0;
    }
    for (var i of ['Click', 'me please', 'now or', 'else!!!']) {
        c = new Button(i);
        buttons.addCard(c);
    }

    // Add cards to hand
    for (var i = 0; i < 5; i ++) {
        var img;
        if (i < 3) img = copper;
        else img = estate;
        c = new PictureCard( img);
        c.onClick = function() {
            if (this.parent === hand) {
                discard.stealCard(this);
            }
            this.grayed_out = true;
        }
        hand.addCard(c);
    }

    // Add cards for first row
    for (var link of firstrows) {
        c = new BorderedPictureCard( link, 10, "center");
        c.onClick = function() {
            this.num --;
        }
        firstrow.addCard(c);
    }

    // Add cards for second row
    for (var link of secondrows) {
        c = new BorderedPictureCard( link, 10, "center");
        c.onClick = function() {
            this.num --;
            this.grayed_out = true;
        }
        secondrow.addCard(c);
    }

    for (var i of ['Nick', 'James', 'Jash']) {
        c = new PlayerInfoCard(i, {
            deck: 5, hand: 5, vp: 3,
            status: 'Currently in buy phase',
            actions: 0, buys: 1, gold: 4
        });
        playerlist.addCard(c);
    }

    // Add card piles to card table
    cT.addCardPile(hand);
    cT.addCardPile(discard);
    cT.addCardPile(firstrow);
    cT.addCardPile(secondrow);
    cT.addCardPile(playerlist);
    cT.addCardPile(buttons);

    // Begin main loop
    cT.beginLoop();
});
