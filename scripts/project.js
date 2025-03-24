// HTML elements

const hint = document.getElementById('hint');
const remaining = document.getElementById('remaining');
const image = document.getElementById('hangman_image');
const answers = document.getElementById('answers');
const keyBlock = document.getElementById('key_block');
const result = document.getElementById('results');

// variables
const fetch_file_location = "../Data/words.json";

const answerDiv = document.createElement("div"); // Create a new div element
answerDiv.classList.add("answer"); // Add class "answer"
answerDiv.innerHTML = "&nbsp;"; // Set text content to "A"

const maxTrials = 6;

const interval = 100; // animation timeout in milliseconds

let wordsArray;
let randomIndex = 0;
let randomWord = '';
let randomHint = '';

let game;

// display answer words
function displayAnswer(chars){
    answers.innerHTML = '';
    for(i=0; i < chars.length; i++){
        answerDiv.innerHTML = chars[i];
        if (chars[i] === ' '){
            answerDiv.innerHTML = '&nbsp;';
        }
        answers.innerHTML += answerDiv.outerHTML;
    }
}

function endGame(gameStatus){
    result.innerText = gameStatus;
    keyBlock.classList.remove('no-show');
    keyBlock.classList.add('block');

    // animate display
    let intervalId;
    let topDecrement = 20;
    let endTop = 0;
    let top = 200;
    
    //apply the interval in milliseconds
    intervalId  = setInterval(function(){

        keyBlock.style.top=`${top}px`;
        top -= topDecrement;

        //decide if enough intervals have elapsed
        if(top < endTop){
            // show correct word
            displayAnswer(game.letters);
            //stop the interval
            clearInterval(intervalId);
        }
    }, interval);

}

function updateHangman(){
    remaining.innerText = `Remaining: ${game.maxCount - game.errorCount}`;
    image.src = `../images/hangman_${game.errorCount}.png`;
}

function buttonClick(event){
    // update button
    event.target.classList.add("clicked");
    event.target.removeEventListener("click", buttonClick);

    // update game instance
    userKey = event.target.textContent.trim();
    //console.log(userKey); 
    
    // check user input
    if (game.checkKey(userKey)){
        // update display words
        chars = game.getLetters();
        displayAnswer(chars);
    }else{
        updateHangman();
    }
    
    // check game status
    let gameStatus = game.checkStatus();
    if(gameStatus != 'inGame'){
        endGame(gameStatus);
    }
}

function addButtonEvents(){
    document.querySelectorAll(".key_row").forEach(div => {
        Array.from(div.children).forEach(child => {
            child.addEventListener("click", buttonClick);
        });
      });
}

function resetButtonStyles(){
    document.querySelectorAll(".key_row").forEach(div => {
        Array.from(div.children).forEach(child => {
            child.classList.remove("clicked");
        });
      });
}

// initialize game
function initializeGame(){
    // get new word and new game
    randomIndex = Math.floor(Math.random() * wordsArray.length);
    [randomWord, randomHint] = wordsArray[randomIndex];
    game = new Game(randomWord, maxTrials);

    // display hint
    hint.innerHTML = `${randomHint}`;
    
    // display words as space
    displayAnswer(game.getLetters());

    // reset hang picture
    updateHangman();

    // add events to keys
    addButtonEvents();

    // reset button style
    resetButtonStyles();
    
    // show keys
    keyBlock.classList.remove('block');
    keyBlock.classList.add('no-show');
}

// fetch json and initialize game
fetch(fetch_file_location)
    .then(response => response.json())  
    .then(data => {
        wordsArray = Object.entries(data); 
        initializeGame();
    })
    .catch(error => console.error("Error loading JSON:", error));
    
// add event to restart button
document.getElementById('restart').addEventListener("click", initializeGame);