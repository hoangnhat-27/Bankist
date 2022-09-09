'use strict';
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2022-08-28T09:15:04.904Z',
        '2022-09-01T10:17:24.185Z',
        '2022-09-03T14:11:59.604Z',
        '2022-09-06T17:01:17.194Z',
        '2022-09-07T15:36:17.929Z',
        '2022-09-08T10:51:36.790Z',
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
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2022-04-10T14:43:26.374Z',
        '2022-08-07T18:49:59.371Z',
        '2022-08-10T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];
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

const formatMovementsDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(date, new Date());
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat(locale).format(date);
}

const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
}

const startLogOutTimer = function () {
    const tick = () => {
        //In each call, print the remaining time to UI
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
        //When 0 second, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Login in to get started';
            containerApp.style.opacity = 0;
        }
        //Decrese 1s
        time--;
    }
    //Set time to 10 minutes
    let time = 600;
    //Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}

const sortMovements = function (movs, dates) {
    const arrCombined = [], sortedMovs = [], sortedDates = [];

    movs.forEach((_, i) => arrCombined.push([movs[i], dates[i]]));
    arrCombined.sort((a, b) => a[0] - b[0]);
    arrCombined.forEach(el => {
        sortedMovs.push(el[0]);
        sortedDates.push(el[1]);
    });

    return [sortedMovs, sortedDates];
};

const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';
    let [movs, dates] = sort ? sortMovements(acc.movements, acc.movementsDates) : [acc.movements, acc.movementsDates];
    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(dates[i]);
        const displaydate = formatMovementsDate(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displaydate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}

const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

const calcDisplaySummary = function (account) {
    const income = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCur(income, account.locale, account.currency);;

    const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCur(Math.abs(out), account.locale, account.currency);

    const interest = account.movements.filter(mov => mov > 0).map(deposit => deposit * account.interestRate / 100).filter(interest => interest >= 1).reduce((acc, interest) => acc + interest, 0);
    labelSumInterest.textContent = formatCur(interest, account.locale, account.currency);;
}

const updateUI = function (acc) {
    displayMovements(acc);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc);
}

const createUsenames = function (allaccounts) {
    allaccounts.forEach(function (account) {
        account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
}
createUsenames(accounts);

//Even handler
let currentAccount, timer;

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if (currentAccount?.pin === +inputLoginPin?.value) {
        //Display UI and message;
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        //display current date and time
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        }
        const locale = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

        //Timer
        if (timer) clearInterval(timer);
        timer = startLogOutTimer();
        updateUI(currentAccount);

        //Clear input fields
        inputLoginPin.value = inputLoginUsername.value = '';
        inputLoginPin.blur();
    }
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username != currentAccount.username) {
        receiverAcc.movements.push(amount);
        currentAccount.movements.push(-amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    }
    inputTransferAmount.value = inputTransferTo.value = '';

    //reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        setTimeout(function () {
            currentAccount.movements.push(amount);
            currentAccount.movementsDates.push(new Date().toISOString());
            updateUI(currentAccount);
            inputLoanAmount.value = '';
        }, 2500);
    }

    //reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
});

let sorted = false;
btnSort.addEventListener('click', (e) => {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (inputCloseUsername?.value === currentAccount?.username && +inputClosePin?.value === currentAccount?.pin) {
        accounts.splice(accounts.findIndex(acc => acc.username === currentAccount?.username), 1);
        containerApp.style.opacity = 0;
        inputClosePin.value = inputCloseUsername.value = '';
    }
});