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

const getGameData = (amount, category, difficultyLevel) => {
    fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficultyLevel}&type=boolean`
    )
        .then((response) => response.json())
        .then((question) => {
            // Check if there are enough questions for the requested difficulty level
            if (question.results.length < amount) {
                console.log(
                    `There are only ${question.results.length} questions for ${difficultyLevel} difficulty.`
                );
            } else {
                console.log(question);
                // Process the data here, display a question to the user
            }
        })
        .catch((error) => console.log(error));
};

getGameData(5, 23, 'easy');
