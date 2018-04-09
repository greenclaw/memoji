
const EMOJI_NUM = 6;
const CARD_CLONES = 2;
const CARDS_TOTAL = EMOJI_NUM * CARD_CLONES;
const GAME_DURATION =3;

// let onClickHandler = (event) =>  {
//     event.target.classList.add("active")
// }

// let mapper = (card) => {card.addEventListener('onclick', onClickHandler)}

class Item {


    constructor() {
        this.item_prototype = null;
        this.buildItem(null);
    }

    buildItem(type) {
        var type_i = Number(type);

        if (this.item_prototype === undefined || this.item_prototype === null) {

            var item = document.createElement('div');
            item.className = 'memoji-item';

            var card = document.createElement('div');
            card.className = 'memoji-card';
            item.appendChild(card);

            var back = document.createElement('div');
            back.className = 'memoji-back';
            card.appendChild(back);

            var front = back.cloneNode();
            front.className = 'memoji-front';
            card.appendChild(front);

            this.item_prototype = item.cloneNode(true);
            if (type === null || type === undefined) { return item; }

            if (type_i <= EMOJI_NUM && type_i > 0) {
            
                var icon = document.createElement('i');
                icon.className = Item.possibleClasses[type_i - 1];
                back.appendChild(icon);
                
            }
            return item;
            
        } else {
            var item = this.item_prototype.cloneNode(true);
            var back = item.querySelector('.memoji-back');

            if (type_i <= EMOJI_NUM && type_i > 0) {
            
                var icon = document.createElement('i');
                icon.className = Item.possibleClasses[type_i];
                back.appendChild(icon);
    
            }
            return item;
        }
        
    }

    getPrototype() {
        return this.item_prototype.cloneNode(true);
    }
}

Item.possibleClasses = {
    1: "icon-bear-face",
    2: "icon-koala-face",
    3: "icon-lion-face",
    4: "icon-panda-face", 
    5: "icon-tiger-face", 
    6: "icon-unicorn-face"
};

var parentElement = document.querySelector('.wrapper');

class Game {
    constructor(parentElement) {
        this.cards = [];
        this.parentElement = parentElement;
        this.item = new Item();
        // this.finish.bind(this.finish);
    }


    genCards() {

        var total_cards = [];

        
        for (var card_index = 0; card_index < CARDS_TOTAL; card_index += 1 ) {
            // var check = 100;
            while(this.cards[card_index] === undefined) {
                // check -= 1;
                // alert("Card"+ card_index +" not yet initialized " + cards[card_index]);
                var card_type = Math.floor(Math.random() * EMOJI_NUM);
                if (total_cards[card_type] === undefined) {
                    total_cards[card_type] = 0;
                }
                if (total_cards[card_type] < 2) {
                    this.cards[card_index] = this.item.buildItem(card_type + 1);
                    total_cards[card_type]++;
                }
            }
            
            this.parentElement.appendChild(this.cards[card_index]);
            // alert("Card " + card_index + "must initialized " + cards[card_index]);
        }
    }

    start(duration, timerNode) {
        var timer = duration, minutes, seconds;
        window.clearTimer = setInterval( function () {

            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            timerNode.innerHTML = minutes + ":" + seconds;
    
            if (--timer < 0) {
                // console.log(this);
                clearTimeout(window.clearTimer);
                var modal = document.getElementById('modal-form');
                modal.querySelector('.info').innerHTML = "<span>L</span><span>o</span><span>s</span><span>e</span>";
                var spans = modal.querySelectorAll('span');
                for(var i = 1; i < spans.length; i++) {
                    spans[i].style.animationDelay = (0.13 * i) + 's';
                }
                modal.style.visibility = 'visible';
            }
        }, 1000);
    }

    finish(status) {
        clearTimeout(window.clearTimer);
        var modal = document.getElementById('modal-form');
        if (status === 'win') {
            modal.querySelector('.info').innerHTML = "<span>W</span><span>i</span><span>n</span>";
            
        }
        if (status === 'lose') {
            modal.querySelector('.info').innerHTML = "<span>L</span><span>o</span><span>s</span><span>e</span>";
        }
        var spans = modal.querySelectorAll('span');
        for(var i = 1; i < spans.length; i++) {
            spans[i].style.animationDelay = (0.13 * i) + 's';
        }
        modal.style.visibility = 'visible';
    }

}

var cardClicker = function(event) {
    // var thisEvent = this;
    
    var activator = function(thisEvent) {
        (thisEvent.classList.contains('active')) ? 
        thisEvent.classList.remove("active") : 
        thisEvent.classList.add("active")
    }

    var turnToWinned = function(node) {
        node.classList.add('winned');
        node.classList.remove('active');
        node.removeEventListener('click', cardClicker);
        window.totalEmojiWinned += 1;
        if (window.totalEmojiWinned >= 12) {
            window.game.finish('win');
            window.totalEmojiWinned = 0;
            // window.removeEventListener('DOMContentLoaded', cardsClickListener);
        }
    }

    var turnToLosed = function(node) {
        node.classList.add('losed');
        node.classList.remove('active');
        node.classList.remove('picked');
        window.losed.push(node);
    }
    
    activator(this);

    if (window.losed !== undefined) {

        window.losed.forEach(function(card) {
            card.classList.remove('losed');
        })

        window.losed = undefined;
    }

    if (window.beforeLastPicked === undefined) {
        
        window.beforeLastPicked = this;
        window.beforeLastPicked.classList.add('picked');
        
    } else {

        if (!this.classList.contains('picked')) {

            var beforeLastPicked = window.beforeLastPicked.querySelector('i');
            var lastPicked = this.querySelector('i');


            if (beforeLastPicked.classList.contains(lastPicked.classList)) {

                turnToWinned(this);
                turnToWinned(window.beforeLastPicked);

            } else {

                window.losed = [];
                turnToLosed(this);
                turnToLosed(window.beforeLastPicked);

            }

            window.beforeLastPicked = undefined;
        }
        
    }
    
}


function startGame(event) {
    window.totalEmojiWinned = 0;
    var modalForm = document.getElementById('modal-form');
    modalForm.style.visibility = 'hidden';

    var gameParentNode = document.querySelector('.wrapper');
    gameParentNode.innerHTML = "";

    window.game = null;
    window.game = new Game(gameParentNode);
    window.game.genCards();

    window.cards = Array.from(document.querySelectorAll('.memoji-item > .memoji-card'));

    window.cards.forEach(function(card){
        card.addEventListener('click', cardClicker, false);
    })

    var timerNode = document.getElementById('timer');

    timerNode.innerText="01:00";
    window.game.start(GAME_DURATION, timerNode);

}

window.addEventListener('DOMContentLoaded', startGame, false);
document.getElementById('play-btn').addEventListener('click', startGame, false);

// window.totalEmojiWinned = 0;
// window.gameStatus = 'started';



