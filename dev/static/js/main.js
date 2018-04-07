var cards = Array.from(document.querySelectorAll('.memoji-item > .memoji-card'));
// let onClickHandler = (event) =>  {
//     event.target.classList.add("active")
// }

// let mapper = (card) => {card.addEventListener('onclick', onClickHandler)}

var cardClicker = function(event) {
    (this.classList.contains('active')) ? 
        this.classList.remove("active") : 
        this.classList.add("active")
}

var cardsClickListener = function(event){
    console.log('cardClicker');
    event.stopPropagation();
    cards.forEach(function(card){
        card.addEventListener('click', cardClicker, false);
    })
    
}

// var cardsClickListeners = 


window.addEventListener('DOMContentLoaded', cardsClickListener, false);
