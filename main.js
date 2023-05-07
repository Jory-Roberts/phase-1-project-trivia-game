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

let score = 0;

const scoreElement = document.getElementById('score');

const difficultyLevels = ['easy', 'medium', 'hard'];
console.log(difficultyLevels);

const category = [
    {
        name: 'Books',
        id: 10,
    },
    {
        name: 'Video Games',
        id: 15,
    },
    {
        name: 'Computers',
        id: 18,
    },
    {
        name: 'Sports',
        id: 21,
    },
];

const categorySelect = document.getElementById('category');
const numberOfQuestions = document.getElementById('amount');
console.log(category);
console.log(categorySelect);
console.log(numberOfQuestions);

const getQuestionData = async (amount, category, difficultyLevel) => {
    try {
        const response = await fetch(
            `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficultyLevel}&type=boolean`
        );
        const data = await response.json();

        if (data.results.length < amount) {
            console.log(
                `There are only ${data.results.length} questions for ${difficultyLevel} difficulty.`
            );
        } else {
            const questions = Array.from(data.results);
            const randomizedQuestions = [];

            while (randomizedQuestions.length < amount) {
                const randomNumber = Math.floor(
                    Math.random() * questions.length
                );
                const question = questions.splice(randomNumber, 1)[0];
                randomizedQuestions.push(question);
            }

            console.log(randomizedQuestions);
            renderQuestionData(randomizedQuestions);
        }
    } catch (error) {
        console.log(error);
    }
};

getQuestionData(5, 9, 'medium');

// getQuestionData(10, 9, 'hard'); // returns 0 questions as expected

const createCard = (question) => {};

const addRadioChangeListeners = (radioButtons) => {
    radioButtons.map((radio) => {
        radio.addEventListener('change', (e) => {
            radioButtons.map((button) => {
                //Changes selection visually between T/F
                button.checked = button == e.target;
            });
            const selectedCard = e.target.closest('.card');
            const correctAnswer = selectedCard.getAttribute('data-answer');

            if (e.target.value === correctAnswer) {
                score++;
                console.log('Correct answer!');
            } else {
                score--;
                console.log('Wrong answer!');
            }

            console.log('Current score:', score);
            scoreElement.textContent = `${score}`;
        });
    });
};

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

        const radioButtons = Array.from(
            card.querySelectorAll('input[type=radio]')
        );
        addRadioChangeListeners(radioButtons);

        card.appendChild(cardFront);

        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
};

const handleUserInput = () => {
    const selectedAmount = parseInt(numberOfQuestions.value);
    const selectedCategory = categorySelect.value;

    if (selectedCategory && selectedAmount) {
        const difficultyLevel =
            difficultyLevels[
                Math.floor(Math.random() * difficultyLevels.length)
            ];

        getQuestionData(selectedAmount, selectedCategory, difficultyLevel);
    } else {
        console.log('Please select both category and amount');
    }
};

const addingEventListeners = () => {
    const submitButton = document.getElementById('button');
    submitButton.addEventListener('click', handleUserInput);
};

addingEventListeners();

/*updated TODOs: 
    -Add event Listener to submitt buttons
    -Add event listener to radio buttons (need to correct issue with buttons not de selecting. Need to add name attribute to both. Possibly change to 'change' event)
    -Provide way to add a hint feature to reveal correct answer
    - Add functionality for the score
     */
