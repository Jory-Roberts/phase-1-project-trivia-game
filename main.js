/*
PSEUDOCODE:

variables:
    for game
    for score
    for difficultyLevel = [use array]


function to fetch data from API {
    fetch(data from API)
    Grab genre data from API
    array method => (function to render genre data to the DOM)

}

function to render genre data to the DOM {
    create.element(something)
    create.element(something)
    create(element(something)

  
}

function to flip card {
    attach event listener to card
    create.element(something)
    create.element(something)
    create.element(something)


    function to start timer {
    this function counts down from a set time
    }

    function to handle score {
    score should increase if answers are correct
    score should decrease if answers are incorrect
    }

    function to persist scoreboard {
    
    }
*/
const game = document.getElementById('game');
console.log(game);
const score = document.getElementById('score');
console.log(score);

const difficultyLevels = ['easy', 'medium', 'hard'];
console.log(difficultyLevels);

const getGameData = () => {
    fetch(
        'https://opentdb.com/api.php?amount=3&category=23&difficulty=easy&type=boolean'
    )
        .then((response) => response.json())
        .then((category) => console.log(category));
};

getGameData();
