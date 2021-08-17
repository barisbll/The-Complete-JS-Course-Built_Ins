'use strict';

const message = document.querySelector('.message');
const scoreDisplay = document.querySelector('.score');
const highscoreDisplay = document.querySelector('.highscore');
const guess = document.querySelector('.guess');
const check = document.querySelector('.check');
const again = document.querySelector('.again');

let secretNum = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = Number(highscoreDisplay.textContent);

check.addEventListener('click', () => {
  let value = Number(guess.value);

  if (value !== 0) {
    if (value > secretNum) {
      message.textContent = 'Guess is too big slow down';
      score--;
      console.log(score);
      scoreDisplay.textContent = score;
    } else if (value < secretNum) {
      message.textContent = 'Guess is too small';
      score--;
      scoreDisplay.textContent = score;
    } else {
      message.textContent = 'You found it Yaaaayyy!';

      if (highscore < score) {
        highscore = score;
        highscoreDisplay.textContent = highscore;
      }
    }
  } else {
    message.textContent = 'Please enter a valid number!';
  }
});

again.addEventListener('click', () => {
  score = 20;
  scoreDisplay.textContent = score;
  secretNum = Math.trunc(Math.random() * 20) + 1;
  guess.value = '';
  message.textContent = 'Start guessing...';
});
