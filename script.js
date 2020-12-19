'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-12-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-12-18T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-12-17T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function(date, locale) {

  const daysPassed = function(date1, date2) {
    const translateDay = (1000 * 60 * 60 * 24);
    return Math.round(Math.abs(date2 - date1) / translateDay);
  };

  const calcDaysPassed = daysPassed(new Date(), date);
  console.log(calcDaysPassed);
  
  if (calcDaysPassed === 0) return `Today`;
  if (calcDaysPassed === 1) return `Yesterday`;
  if (calcDaysPassed <= 7) return `${calcDaysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${month}/${day}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); //WILL CALL THE SECOND ARRAY USING THE INDEX
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

//FAKE ALWAYS LOGGED IN 
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //CREATE CURRENT DATE AND TIME

    const now = new Date();
    const options = {
      hour: `numeric`,
      minute: `numeric`,
      day: `numeric`,
      month: `numeric`, //LONG OR NUMERIC or 2-DIGIT
      year: `numeric`, //LONG OR NUMERIC OR 2-DIGIT
      // weekday: `long`
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);


    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer dates
    //TO ISO STRING WILL FORMAT IT LIKE THE OTHERS
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//

/////////////////////////////////////////////////
// CONVERTING AND CHECKING NUMBERS

/*
CONVERSION
PARSING
PARSE FLOAT
ISNAN
ISFINITE
*/ 

/*
//CONVERSION
console.log(Number(`23`));
console.log(+`23`); //TYPE COERCION WILL TURN IT INTO A NUMBER

//PARSING
//BASE 10 = 0 - 9
//BINARY BASE 2 = 0 & 1
console.log(Number.parseInt(`30px`, 10)); //30 STRING NEEDS TO START WITH A NUMBER
console.log(Number.parseInt(`e23`, 10)); //NAN

//PARSE FLOAT
console.log(Number.parseFloat(`2.5rem`)); //2.5
console.log(Number.parseInt(`2.5rem`)); //2

//ISNAN
console.log(Number.isNaN(20)); //F
console.log(Number.isNaN(`20`)); //F
console.log(Number.isNaN(+`20x`)); //T
console.log(Number.isNaN(23 / 0)); //F

//IS FINITE
//THE BEST WAY TO CHECK IF A VALUE IS A NUMBER
console.log(Number.isFinite(20)); //T
console.log(Number.isFinite(`20`)); //F
console.log(Number.isFinite(+`20X`)); //F
console.log(Number.isFinite(20 / 0)); //F
*/

/////////////////////////////////////////////////
// MATH AND ROUNDING

/* 
SQUARE AND CUBIC ROOT
MIN MAX RANDOM VALUES
ROUNDING INTEGERS
MATH CONSTANTS
*/

/*
console.log(Math.sqrt(25)); //5
console.log(25 ** (1 / 2)); //5
console.log(8 ** (1 / 3)); //2 CUBIC ROOT

console.log(Math.max(5, 18, 23, 11, 2)); //MAX VALUE IS RETURNED
console.log(Math.max(5, 18, `23`, 11, 2)); //23
console.log(Math.max(5, 18, `23px`, 11, 2)); //NAN

console.log(Math.min(5, 18, 23, 11, 2)); //MIN VALUE IS RETURNED

console.log(Math.PI); //MATH CONSTANT 
console.log(Math.PI * Number.parseFloat(`10px`) ** 2); //HOW TO CALCULATE THE AREA OF A CIRCLE WITH
                                                        //THIS RADIUS

console.log(Math.random()); //RANDOM NUMBER BETWEEN 0 AND 1
console.log(Math.trunc(Math.random() * 6) + 1);//RANDOM NUMBER BETWEEN 1 AND 6

//RANDOMIZE A NUMBER BETWEEN A MINIMUM AND MAXIMUM NUMBER
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;
const randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
};

console.log(randomInteger(1, 3));
console.log(randomInt(1, 3));              

//ROUNDING INTEGERS
//FLOOR AND TRUNC WORK THE SAME ONLY WITH + NUMBER

console.log(Math.trunc(23.8)); //23 - WILL REMOVE DECIMAL
console.log(Math.round(23.8)); //24 - ROUND TO THE NEAREST INTEGER
console.log(Math.ceil(23.8)); //24 - ROUND UP
console.log(Math.floor(23.8)); // 23 - ROUND DOWN

console.log(Math.trunc(-23.8)); // -23
console.log(Math.floor(-23.8)); // -24

//ROUNDING DECIMALS
// WILL RETURN STRING
console.log((2.7).toFixed(0)); //3
console.log((2.7).toFixed(3)); //2.700
console.log((2.345).toFixed(2)); //2.35
console.log(+(2.345).toFixed(3)); //CONVERT TO A NUMBER
*/

/////////////////////////////////////////////////
// REMAINDER OPERATOR

/*
REMAINDER THINGS
EVERY NTH TIME
*/

/*
console.log(5 % 2); // 1
console.log(5 / 2); // 5 = 2 * 2 + 1
console.log(8 % 3); //2 
console.log(6 % 2); //0
console.log(7 % 2); //1

const isEven = n => n % 2 === 0;
console.log(isEven(8)); //TRUE
console.log(isEven(23)); //FALSE
console.log(isEven(1)); //FALSE

//EVERY NTH TIME 
// labelBalance.addEventListener(`click`, function(){
//   [...document.querySelectorAll(`.movements__row`)].forEach(function(row, i){
//     if (i % 2 === 0) row.style.backgroundColor = `orangeRed`;
//     if(i % 3 === 0) row.style.backgroundColor = `blue`;
//   })
// })
*/

/////////////////////////////////////////////////
// BIG INT

/*
console.log(2 ** 53 - 1); //BIGGEST INTEGER THAT CAN BE ACCURATELY INTERPRETED
console.log(Number.MAX_SAFE_INTEGER); //ANY NUMBER BIGGER THAN THIS CAN FUCK UP

console.log(8917345698734658792346589726345);
console.log(8917345698734658792346589726345n); //MAKES IT INTO A BIG INT, WILL DISPLAY ACCURATELY
console.log(BigInt(89173456987346)); //SHOULD BE USED FOR SMALLER NUMBERS

//OPERATIONS
//DONT MIX BIG INTS AND OTHER TYPES
//Math.operations WILL NOT WORK
console.log(100000n + 100000n); //OPERATORS WORK THE SAME WITH BIG INT
console.log(8917345698734658792346589726345n * 8917345698734658792346589726345n);
const num = 23;
console.log(8917345698734658792346589726345n + BigInt(num));

console.log(20n > 15); //WILL STILL WORK
console.log(20n === 20); //FALSE
console.log(typeof 20n); //bigint
console.log(20n == 20);
console.log(8917345698734658792346589726345n + ` is huge`); //WILL WORK

//DIVISIONS
console.log(10n / 3n); //3n CUTS OFF THE DECIMALS
*/

/////////////////////////////////////////////////
//CREATING DATES AND TIMERS

/*
// //CREATING A DATE
// const now = new Date(); //RELIABLE 
// console.log(now); //WILL SHOW THE CURRENT DATE AND TIME 

// console.log(new Date(`Dec 17 2020 00:30:43`));
// console.log(new Date(`December 24, 2020`));

// console.log(new Date(account1.movementsDates[0])); 

// console.log(new Date(2037, 10, 19, 15, 23, 5)); //MONTH IS ZERO BASED SO 10 IS ACTUALLU NOV
// console.log(new Date(2037, 10, 31, 15, 23, 5)); //WILL AUTOCORRECT TO DECEMBER 1ST

// console.log(new Date(0)) //INITIAL UNIX TIME JANUARY 1ST 1970
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); 

//WORKING WITH DATES
const future = new Date(2037, 10, 19, 15, 23);
console.log(future); 
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // 10
console.log(future.getDate()); // 19
console.log(future.getDay()); // 4
console.log(future.getHours()); //15
console.log(future.getMinutes()); //23
console.log(future.getSeconds()); //0
console.log(future.toISOString()); //CONVERT TO STRING
console.log(future.getTime()); //CREATE A TIME STAMP
console.log(new Date(2142285780000)) //REVERSE THE TIME STAMP INTO AN ACTUAL DATE
console.log(Date.now()); //GIVES YOU THE TIME STAMP OF NOW

future.setFullYear(2040); //HOW TO CHANGE THE SET DATE
console.log(future); 
*/

/////////////////////////////////////////////////
//OPERATIONS WITH DATES 
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const daysPassed = function(date1, date2) {
  const translateDay = (1000 * 60 * 60 * 24);
  return Math.abs(date2 - date1) / translateDay;
};

const days1 = daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
console.log(days1);
*/

/////////////////////////////////////////////////
//INTERNATIONALIZING DATES

//EXPERIMENTING WITH THE API
// const now = new Date();
// const options = {
//   hour: `numeric`,
//   minute: `numeric`,
//   day: `numeric`,
//   month: `long`, //LONG OR NUMERIC or 2-DIGIT
//   year: `numeric`, //LONG OR NUMERIC OR 2-DIGIT
//   weekday: `long`
// };

// const locale = navigator.language;
// console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(`en-US`, options).format(now);
