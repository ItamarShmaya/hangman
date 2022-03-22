'use strict';

function hangman(){

    const prompt = require('prompt-sync')();                    // setting prompt to take user input (npm install prompt-sync)
    let figlet = require('figlet');                             // getting awesome fonts

    const wordsList = ['Banana', 'Fuzzy', 'Grape', 'Majestic', 'Neighbor', 'Noise', 'Voyage', 'Scandal', 'Phone', 'Passenger'];
    let chosenWord = wordsList[Math.floor(Math.random() * wordsList.length)];       // chooses a word randomly
    let hiddenWord = [];                                                            // declare the hidden word as an array to be able to change letters
    let turns = 10;                                                                 
    let letterAmount = 0;                                                           // variable to count the amount of times a letter apears in the word
    const regexp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;                   // regular expression for special character and numbers to test input
    for(let i = 0; i < chosenWord.length; i++) {                                    // storing asterisks to hide the word using the length of the chosen word
        hiddenWord[i] = ' * ';
    }

    function introduction() {                                                       // function to introduce the game
        console.log(figlet.textSync('Hangman!', {                                   // special font
            font: 'Bloody'
        }));

        console.log('Welcome to hangman game!');
        console.log('Guess the word, one letter at a time');
        console.log('You may try guessing the whole word but beware')
        console.log('Guessing wrong will lose you two turns instead of one\n');
        console.log('----------------------------------------\n')
    }

    function displayChosenWord() {                                              // function to display the word
        console.log('The word is: \n');
        console.log(hiddenWord.join(' ') + '\n');
    }

    function checkGuess(word, guess) {                                          // function to check if the word contains the guess
        return (word.toLowerCase().includes(guess)) ? true : false;
    }

    function updateWord(guess) {                                                // function to update the word
        for(let i = 0; i < chosenWord.length; i++) {                            // iterating through chosen word using it's length
            if(chosenWord.charAt(i).toLowerCase() === guess) {                  // checking if chosen word contains the guess using 'i' as index, converting to lower case
                hiddenWord[i] = guess;                                          // if chosen word contain the guess replace the the letter in the same index in hidden word with the correct guess 
                letterAmount++;                                                 // counts the amount of time a letter apears in the word
          }                                                                    
        }                                              
    }

    function startGame() {                                                     // function to initialize the game 
        introduction();                                                        // calling introduction()
        let guess;                                                             // declaring guess so won't have to declare everytime inside the loop
        while (!isGameOver()) {                                                // a while loop using isGameOver() to loop while the game is not over
            console.log(`You have ${turns} guesses remaining`);                // template literal to interpolate turns 
            displayChosenWord();                                               // calling displayChosenWord()

            guess = prompt('Enter a guess: ').toLowerCase();                    // asking for user input and storing in 'guess' variable
            if(isValidInput(guess)) {                                           // check to see if the guess is valid using isValidInput()
                if(guess.length > 1) {                                          // check to see if guess is 1 letter or a word
                    if(guess.toLowerCase() === chosenWord.toLowerCase()) {      // if it's a word convert to lower case and compare to the chosen word
                        hiddenWord = chosenWord;                                // if it's correct chosenWord is assigned to HiddenWord which stops the loop
                    } else {
                        console.log(`'${guess}' is incorrect`)                  // if not, infrom the user
                        turns -= 2;                                             // takes two turns cause why not, high risk high reward 
                    }
                } else {                                                              // if the guess is a single letter
                    if(checkGuess(chosenWord, guess)) {                               // calling checkGuess() to check if the chosen word contains the letter                               
                        updateWord(guess);                                            // if yes call updateWord();    
                        if(letterAmount > 1)                                          // check if the letter guessed appears more than once to adjust the message
                            console.log(`'${guess}' appears ${letterAmount} times\n`);    // display number of times the letter appears in the word if more than once
                        else
                        console.log(`'${guess}' appears once\n`);                         //using 'once' if it's just once
                        letterAmount = 0;                                                 // resets letterAmount for next time
                    } else {                                                              // if guess is wrong
                        console.log(`'${guess}' does not appear\n`);                      // infrom the user
                        turns--;                                                          // takes 1 turn for a wrong guess 
                    }
                }

            } else {                                                                            // if the guess was invalid
                console.log('Invalid input, please use only one letter or a word\n')            // display invalid message, not taking turns
            }
        }
    }

    function isGameOver() {                                                           // function to check if the game is over or not using gameLost() and gameWon()
        return (gameLost() || gameWon()) ? true : false;                              // returns true if game is over
    }

    function isValidInput(input) {                                                    // functoin to check the validity of the input
        if(!regexp.test(input) || !input === '') {                                    // if the guess does not conatin a special character, number or is an empty string. using regular expression declared at the top
            if(input.length === 1 || input.length === chosenWord.length) {            // if the guess is 1 letter or a word with the same length as the chosenWord
                return true;                                                          // a word with different length will be treated as invalid so it won't take turns
            }
        } else {
            return false;
        }                                                                             //returns true if valid
    }

    function gameWon() {                                                                                     // function to check if the game was won by user                                                   
        if (!hiddenWord.toString().includes('*') && turns !== 0) {                                           // if the hidden word doesn't contain aestricks and there are still turns left
            (typeof(hiddenWord) === 'string') ? console.log(hiddenWord) : console.log(hiddenWord.join(''));  // check to see if hiddenWord is a string or still an array, 
            console.log('Congratulation! You guessed the word correctly');                                   // chosenWord was assigned to HiddenWord if user guessed correctly using a whole word and it broke the game when it got to .join()
            return true;                                                                                     // returns true for isGameOver()
        }
    }

    function gameLost() {                                                            // function to check if the game was lost
        if (hiddenWord.toString().includes('*') && turns === 0) {                    // if the hiddenWord still contains aestricks and there are no more turns left
            console.log('You didn\'t guess the word. Game over!');                   // inform the user the game is over
            console.log(`The word was ${chosenWord}`);                               // reveal the word
            return true;                                                             // returns true for isGameOver()
        }       
    }
 
    startGame();                                                                      // calls startGame() to start the game when hangman() is being called
}

hangman();                                                                           // start the game 
