'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const findUsernames = accounts => {
  accounts.map(acc => {
    return (acc.username = acc.owner
      .split(' ')
      .map(name => name[0])
      .join('')
      .toLowerCase());
  });
};

findUsernames(accounts);

let sorted = false;
const displayMovements = (acc, sorted = false) => {
  //Reset hardcoded movements
  containerMovements.innerHTML = '';

  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //Add movements into UI
  movs.map((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const ele = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', ele);
  });
};

//Calculate sum of deposits & withdrawals
const showSummary = acc => {
  const sumDeposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const sumWithdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Display UI sums
  labelSumIn.textContent = `${sumDeposits}€`;
  labelSumOut.textContent = `${Math.abs(sumWithdrawals)}€`;

  // Add balance to object and display UI interest
  const obj = acc;
  obj.balance = sumDeposits + sumWithdrawals;
  const interest = (obj.balance * obj.interestRate) / 100;

  labelSumInterest.textContent = `${interest} €`;

  //WHole money
  labelBalance.textContent = `${obj.balance + interest}€`;
};

const displayUI = (acc, sorted = false) => {
  displayMovements(acc, sorted);
  showSummary(acc);
};

let currAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currAccount = accounts.find(acc => inputLoginUsername.value === acc.username);

  if (
    typeof currAccount !== 'undefined' &&
    `${currAccount?.pin}` === inputLoginPin.value
  ) {
    labelWelcome.textContent = `Welcome, ${currAccount.owner}`;

    containerApp.style.opacity = '1';
    displayUI(currAccount);

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  if (
    accounts.map(acc => acc.username).includes(inputTransferTo.value) &&
    currAccount.username !== inputTransferTo.value &&
    inputTransferAmount.value > 0 &&
    currAccount.balance > inputTransferAmount.value
  ) {
    accounts
      .find(acc => acc.username === inputTransferTo.value)
      .movements.push(Number(inputTransferAmount.value));
    currAccount.movements.push(Number(-inputTransferAmount.value));

    inputTransferTo.value = '';
    inputTransferAmount.value = '';

    displayUI(currAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  if (inputLoanAmount.value < currAccount.balance * 0.1) {
    currAccount.movements.push(Number(inputLoanAmount.value));
    displayUI(currAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currAccount.username &&
    inputClosePin.value === `${currAccount.pin}`
  ) {
    accounts.splice(accounts.indexOf(currAccount), 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';

    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});

btnSort.addEventListener('click', e => {
  e.preventDefault();
  sorted = !sorted;
  displayUI(currAccount, sorted);
});
