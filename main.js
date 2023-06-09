const game = document.getElementById('game');
console.log(game);

const scoreElement = document.getElementById('score');

const difficultyLevels = ['easy', 'medium', 'hard'];
console.log(difficultyLevels);

const category = [
    {
        name: 'Books',
        id: 10,
    },
    {
        name: 'Films',
        id: 11,
    },
    {
        name: 'Music',
        id: 12,
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
const generateButton = document.getElementById('button');
const resetButton = document.getElementById('resetButton');
console.log(category);
console.log(categorySelect);
console.log(numberOfQuestions);
console.log(generateButton);
console.log(resetButton);

let score = 0;
let timerDuration;
let roundInProgress = false;
let timerElement;
let timeLeft;
let timerId;

const setTimerDuration = (difficultyLevel) => {
    if (difficultyLevel === 'easy') {
        timerDuration = 30;
    }
    if (difficultyLevel === 'medium') {
        timerDuration = 45;
    }
    if (difficultyLevel === 'hard') {
        timerDuration = 60;
    }
};

const getQuestionData = async (amount, category, difficultyLevel) => {
    try {
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficultyLevel}&type=boolean`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        const totalQuestions = data.results.length;
        if (totalQuestions < amount) {
            enableGenerateQuestionsButton();
            displayMessage(
                `There are  ${totalQuestions} questions for ${difficultyLevel} difficulty.`
            );
        } else {
            const questions = Array.from(data.results);
            //creates array from results. returns an array based on the amount
            const randomizedQuestions = getRandomQuestions(questions, amount);

            console.log(randomizedQuestions);

            renderQuestionData(randomizedQuestions);
            setTimerDuration(difficultyLevel);
            startRound();
        }
    } catch (error) {
        console.error(error);
        displayMessage('Something went wrong!');
    }
};

const getRandomQuestions = (questions, amount) => {
    const randomizedQuestions = [];

    while (randomizedQuestions.length < amount) {
        const randomNumber = Math.floor(Math.random() * questions.length);
        const question = questions.splice(randomNumber, 1)[0];
        //Removes question at index from questions array
        randomizedQuestions.push(question);
    }

    return randomizedQuestions;
};

const startTimer = (timerDuration) => {
    timerElement = document.getElementById('timer');
    timeLeft = timerDuration;
    updateTimeElement();

    timerId = setInterval(() => {
        timeLeft--;
        updateTimeElement();
        console.log(`Time left: ${timeLeft} seconds`);

        if (timeLeft === 0) {
            displayMessage('Time is up!');
            console.log('Time is up!');
            clearInterval(timerId);
            finishRound();
        } else if (timeLeft <= 10) {
            console.log('You are here');
            timerElement.classList.add('timer-low');
        } else {
            timerElement.classList.remove('timer-low');
        }
    }, 1000);
};

const displayMessage = (message) => {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.add('message-box');
    messageElement.style.display = 'block';

    messageElement.addEventListener('mouseover', () => {
        messageElement.textContent = ' ';
        messageElement.style.display = 'none';
    });
};

const updateTimeElement = () => (timerElement.textContent = timeLeft);

const startRound = () => {
    roundInProgress = true;
    startTimer(timerDuration);
    disableGenerateQuestionsButton();
};

const finishRound = () => {
    roundInProgress = false;
    clearInterval(timerId);
    enableGenerateQuestionsButton();

    const unansweredQuestions = document.querySelectorAll(
        '.card:not(.flipped)'
    );
    if (unansweredQuestions.length > 0) {
        resetButton.disabled = true;
    } else {
        resetButton.disabled = false;
    }
};

const disableGenerateQuestionsButton = () => {
    const generateButton = document.getElementById('button');
    generateButton.disabled = true;
};

const enableGenerateQuestionsButton = () => {
    const generateButton = document.getElementById('button');
    generateButton.disabled = false;
};

const createCard = (question) => {
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

    const trueLabel = document.createElement('label');
    trueLabel.textContent = 'True';
    const trueInput = document.createElement('input');
    trueInput.type = 'radio';
    trueInput.value = 'True';

    cardBack.appendChild(trueInput);
    cardBack.appendChild(trueLabel);

    const falseLabel = document.createElement('label');
    falseLabel.textContent = 'False';
    const falseInput = document.createElement('input');
    falseInput.type = 'radio';
    falseInput.value = 'False';

    cardBack.appendChild(falseInput);
    cardBack.appendChild(falseLabel);

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    cardContainer.appendChild(card);

    return cardContainer;
};

const addRadioChangeListeners = (radioButtons) => {
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', (e) => {
            radioButtons.forEach((button) => {
                //Changes selection visually between T/F
                button.checked = button == e.target;
            });
            const selectedCard = e.target.closest('.card');
            const correctAnswer = selectedCard.getAttribute('data-answer');

            selectedCard.classList.add('flipped');

            if (e.target.value === correctAnswer) {
                score++;
                console.log('Correct answer!');
                selectedCard.classList.add('correct');
            } else {
                console.log('Wrong answer!');
                selectedCard.classList.add('wrong');
            }

            console.log('Current score:', score);
            scoreElement.textContent = `${score}`;

            const unansweredQuestions = document.querySelectorAll(
                '.card:not(.flipped)'
            );
            if (unansweredQuestions.length === 0) {
                displayMessage(
                    'No more questions! Please reset and generate more!!'
                );
                clearInterval(timerId);
                finishRound();
            }
        });
    });
};

const renderQuestionData = (questions) => {
    const container = document.getElementById('game');

    questions.forEach((question) => {
        const cardContainer = createCard(question);
        container.appendChild(cardContainer);
    });

    const radioButtons = Array.from(
        container.querySelectorAll('input[type=radio]')
    );
    addRadioChangeListeners(radioButtons);
};

const handleUserInput = () => {
    const selectedAmount = parseInt(numberOfQuestions.value);
    const selectedCategory = categorySelect.value;
    const selectedDifficultyLevel = level.value;

    getQuestionData(selectedAmount, selectedCategory, selectedDifficultyLevel);
};

const resetSelections = () => {
    const flippedCards = document.querySelectorAll('.card.flipped');
    flippedCards.forEach((card) => {
        card.classList.remove('flipped');
        card.classList.remove('correct');
        card.classList.remove('wrong');
    });
    score = 0;
    scoreElement.textContent = `${score}`;

    enableGenerateQuestionsButton();
    roundInProgress = false;
    clearInterval(timerId);
    timerElement.textContent = '0';
    //Loop to clear game elements when 'reset' is clicked
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
};

const addingEventListeners = () => {
    generateButton.addEventListener('click', handleUserInput);
    resetButton.addEventListener('click', resetSelections);
};

addingEventListeners();
