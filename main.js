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

const getQuestionData = (amount, category, difficultyLevel) => {
    fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficultyLevel}&type=boolean`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.results.length < amount) {
                console.log(
                    `There are only ${data.results.length} questions for ${difficultyLevel} difficulty.`
                );
            } else {
                const questions = [];
                while (questions.length < amount) {
                    const randomNumber = Math.floor(
                        Math.random() * data.results.length
                    );
                    const question = data.results[randomNumber];
                    if (!questions.includes(question)) {
                        questions.push(question);
                    }
                }
                console.log(questions);
                renderQuestionData(questions);
            }
        })
        .catch((error) => console.log(error));
};

getQuestionData(3, 15, 'medium');

getQuestionData(10, 9, 'hard'); // returns 0 questions as expected

const renderQuestionData = (questions) => {
    const container = document.getElementById('game');

    questions.forEach((question) => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-question', question.question);
        card.setAttribute('data-answer', question.correct_answer);

        console.log(card);

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const questionElement = document.createElement('p');
        questionElement.classList.add('question');
        questionElement.textContent = question.question
            .replaceAll('&#039;', `'`)
            .replaceAll('&quot;', `"`);
        cardFront.appendChild(questionElement);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const answerElement = document.createElement('p');
        answerElement.classList.add('answer');
        answerElement.textContent = question.correct_answer;
        cardBack.appendChild(answerElement);

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
};
