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

let score = 0;
let points;
let timerDuration;
let roundInProgress = false;
let timerElement;
let timeLeft;
let timerId;

const setTimerDuration = (difficultyLevel) => {
    if (difficultyLevel === 'easy') {
        timerDuration = 15;
    }
    if (difficultyLevel === 'medium') {
        timerDuration = 20;
    }
    if (difficultyLevel === 'hard') {
        timerDuration = 30;
    }
};

const getQuestionData = async (amount, category, difficultyLevel) => {
    try {
        if (roundInProgress) {
            console.log('A round is already in progress!');
            return;
        }
        disableGenerateQuestionsButton();
        const response = await fetch(
            `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficultyLevel}&type=boolean`
        );
        const data = await response.json();

        if (data.results.length < amount) {
            enableGenerateQuestionsButton();
            console.log(
                `There are only ${data.results.length} questions for ${difficultyLevel} difficulty.`
            );
        } else {
            const questions = Array.from(data.results);
            const randomizedQuestions = [];
            setTimerDuration(difficultyLevel);

            while (randomizedQuestions.length < amount) {
                const randomNumber = Math.floor(
                    Math.random() * questions.length
                );
                const question = questions.splice(randomNumber, 1)[0];
                randomizedQuestions.push(question);
            }

            console.log(randomizedQuestions);
            renderQuestionData(randomizedQuestions);
            roundInProgress = true;
            startTimer(timerDuration);
        }
    } catch (error) {
        console.log(error);
    }
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
            console.log('Time is up!');
            clearInterval(timerId);
            finishRound();
        }
    }, 1000);
};

const updateTimeElement = () => (timerElement.textContent = timeLeft);

const finishRound = () => {
    roundInProgress = false;
    clearInterval(timerId);
    enableGenerateQuestionsButton();
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
                score--;
                console.log('Wrong answer!');
                selectedCard.classList.add('wrong');
            }

            console.log('Current score:', score);
            scoreElement.textContent = `${score}`;
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

const addingEventListeners = () => {
    const generateButton = document.getElementById('button');
    generateButton.addEventListener('click', handleUserInput);
};

addingEventListeners();
