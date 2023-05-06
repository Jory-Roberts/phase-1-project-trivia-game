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

getQuestionData(5, 15, 'medium');

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

        const trueLabel = document.createElement('label');
        trueLabel.textContent = 'True';
        const trueInput = document.createElement('input');
        trueInput.type = 'radio';
        trueInput.value = 'True';

        card.appendChild(trueInput);
        card.appendChild(trueLabel);

        const falseLabel = document.createElement('label');
        falseLabel.textContent = 'False';
        const falseInput = document.createElement('input');
        falseInput.type = 'radio';
        falseInput.value = 'False';

        card.appendChild(falseInput);
        card.appendChild(falseLabel);

        card.appendChild(cardFront);

        cardContainer.appendChild(card);
        container.appendChild(cardContainer);

        // Add event listeners to the radio buttons
        const radioButtons = card.querySelectorAll('input[type=radio]');

        radioButtons.forEach((radio) => {
            radio.addEventListener('change', (e) => {
                radioButtons.forEach((button) => {
                    button.checked = button == e.target;
                });
                if (e.target.value == 'True') {
                    console.log('clicking true');
                }
                if (e.target.value == 'False') {
                    console.log('clicking false');
                }
            });
        });

        /*const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const answerElement = document.createElement('p');
        answerElement.classList.add('answer');
        answerElement.textContent = question.correct_answer;
        cardBack.appendChild(answerElement);
        card.appendChild(cardBack);
        */

        card.appendChild(cardFront);

        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
};

const addingEventListeners = () => {
    const submitButton = document.getElementById('button');
    submitButton.addEventListener('click', () => {
        console.log('handle submit');
    });
};

addingEventListeners();

/*updated TODOs: 
    -Add event Listener to submitt buttons
    -Add event listener to radio buttons (need to correct issue with buttons not de selecting. Need to add name attribute to both. Possibly change to 'change' event)
    -Provide way to add a hint feature to reveal correct answer
    - Add functionality for the score
     */
