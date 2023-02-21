const quizContainer = document.querySelector('.quiz-container');
const startScreen = document.querySelector('.start-screen');
const questionScreen = document.querySelector('.question-screen');
const saveScreen = document.querySelector('.save-screen');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const saveForm = document.querySelector('.save-form');
const clearButton = document.getElementById('clear-btn');
const highScoresDropdown = document.querySelector('.high-scores-dropdown');
const highScoresListEl = document.createElement('ol');


let currentQuestionIndex = 0;
let timer = 180;
let intervalId;
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let score;

startBtn.addEventListener('click', startGame);

function startGame() {
  startScreen.classList.add('hide');
  questionScreen.classList.remove('hide');
  quizContainer.classList.remove('hide');
  startBtn.disabled = true;
  currentQuestionIndex = 0;
  timer = 180;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  choicesEl.innerHTML = '';
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    const choice = currentQuestion.choices[i];
    const choiceEl = document.createElement('button');
    choiceEl.textContent = choice;
    choiceEl.addEventListener('click', function() {
      checkAnswer(choice, currentQuestion.answer);
    });
    choicesEl.appendChild(choiceEl);
  }
}

function checkAnswer(choice, answer) {
  if (timer <= 0) {
    endGame();
    return;
  }
  if (choice === answer) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      clearInterval(intervalId);
      score = timer;
      endGame();
    }
  } else {
    timer -= 10;
    if (timer < 0) {
      timer = 0;
      endGame();
    }
    updateTimer();
  }
}

function startTimer() {
  intervalId = setInterval(function() {
    timer--;
    if (timer < 0) {
      clearInterval(intervalId);
      endGame();
    } else {
      updateTimer();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = timer;
}

function endGame() {
  clearInterval(intervalId);
  timerEl.textContent = "Time: " + timer;

  if (timer <= 0) {
    score = 0;
  } else {
    score = timer;
  }

  if (currentQuestionIndex === questions.length) {
    questionScreen.classList.add('hide');
    saveScreen.classList.remove('hide');

    const formContainerEl = document.createElement('div');
    formContainerEl.classList.add('form-container');
    saveScreen.appendChild(formContainerEl);

    const nameLabelEl = document.createElement('label');
    nameLabelEl.setAttribute('for', 'name');
    nameLabelEl.textContent = "Enter your name: ";
    formContainerEl.appendChild(nameLabelEl);

    const nameInputEl = document.createElement('input');
    nameInputEl.setAttribute('type', 'text');
    nameInputEl.setAttribute('id', 'name');
    nameInputEl.setAttribute('name', 'name');
    formContainerEl.appendChild(nameInputEl);

    const saveButtonEl = document.createElement('button');
    saveButtonEl.setAttribute('type', 'submit');
    saveButtonEl.textContent = "Save";
    formContainerEl.appendChild(saveButtonEl);

    saveButtonEl.addEventListener('click', function() {
      const name = nameInputEl.value;

      if (!name) {
        alert("Please enter your name.");
        return;
      }

      const highScore = { name: name, score: score };

      highScores.push(highScore);
      highScores.sort((a, b) => b.score - a.score);
      localStorage.setItem('highScores', JSON.stringify(highScores));

      // Clear the form and show the final score
      formContainerEl.innerHTML = '';
      const finalScoreEl = document.createElement('p');
      finalScoreEl.innerHTML = "All done!<br><br><span style='font-size: 1.5em'>" + name + "</span><br><br>Your final score is: " + score + ".";
      saveScreen.appendChild(finalScoreEl);

      // Show the high scores
      const highScoresLabelEl = document.createElement('label');
      highScoresLabelEl.setAttribute('for', 'highscores');
      highScoresLabelEl.textContent = "High scores: ";
      formContainerEl.appendChild(highScoresLabelEl);

      highScoresListEl.setAttribute('id', 'highscores');
      formContainerEl.appendChild(highScoresListEl);

      for (let i = 0; i < highScores.length; i++) {
        const highScore = highScores[i];
        const highScoreOptionEl = document.createElement('li');
        highScoreOptionEl.textContent = highScore.name + " - " + highScore.score;
        highScoresListEl.appendChild(highScoreOptionEl);
      }

      highScoresDropdown.appendChild(highScoresListEl);
    });
  }
}