function Game() {
    this.winningNumber = generateWinningNumber(); 
    this.playersGuess = null; 
    this.pastGuesses = []; 

    this.provideHint = function(){
        var hintArray = [];
        hintArray.push(this.winningNumber); 
        for (var i = 2; i > 0; i--) {
            hintArray.push(generateWinningNumber())
        }
        return shuffle(hintArray); 
    }
}

var generateWinningNumber = function() {
    return Math.floor(Math.random() *100 +1); 
}

var shuffle = function(array) {
    
    var remainingElements = array.length;
    var shuffleToEnd, currentElement; 
    while (remainingElements) {
        shuffleToEnd = Math.floor(Math.random() * remainingElements--);

        currentElement = array[remainingElements];
        array[remainingElements] = array[shuffleToEnd]; 
        array[shuffleToEnd] = currentElement; 
    }
    
    return array; 
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber); 
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true; 
    }
    return false; 
}

Game.prototype.playersGuessSubmission = function(newGuess) {
    if (newGuess < 1 || newGuess > 100 || typeof newGuess !== 'number' || isNaN(newGuess)) {
        return 'That is an invalid guess.'
    } 
    this.playersGuess = newGuess; 
    return this.checkGuess(newGuess); 
}

Game.prototype.checkGuess = function(newGuess) {
    if (newGuess === this.winningNumber) {
        $( "#submit,#hint" ).prop( "disabled", true );
        return 'You Win!'
    } else if (this.pastGuesses.indexOf(newGuess) !== -1) {
        return 'You have already guessed that number.'
    }
    
    this.pastGuesses.push(newGuess); 
    $('.guess').eq(this.pastGuesses.length-1).html(newGuess); 

    if (this.pastGuesses.length === 5) {
        $('h2').html('Please click reset button below.'); 
        $( "#submit,#hint" ).prop( "disabled", true );
        return 'You Lose.'
    } else if (this.difference() < 10) {
        return 'You\'re burning up!' 
    } else if (this.difference() < 25) {
        return 'You\'re lukewarm.' 
    } else if (this.difference() < 50) {
        return 'You\'re a bit chilly.'
    } else if (this.difference() < 100) {
        return 'You\'re ice cold!' 
    }

} 

function newGame() {
    return new Game; 
}



$(document).ready(function() {
    var game = newGame(); 

    var cloneHeading1 = $('h1')[0].innerHTML; 
    var cloneHeading2 = $('h2')[0].innerHTML; 


    $('#submit').click(function() {
        var guess = $('#playerinput').val(); 
        $('#playerinput').val(""); 
        $('h1').html(game.playersGuessSubmission(parseInt(guess,10)));
    })

    $('#reset').click(function() {
        game = newGame(); 
        $('h1').html(cloneHeading1); 
        $('h2').html(cloneHeading2); 
        $('.guess').html("-"); 
        $( "#submit,#hint" ).prop( "disabled", false );
    });

    $('#hint').click(function() {
        var displayHint = "Hint: " + game.provideHint().join(', '); 
        $('h1').html(displayHint); 
    });


});
