var inputTextbox = document.getElementById('input');
var stackText = document.getElementById('stack');
var errorText = document.getElementById('error');
var numberButtons = document.querySelectorAll('.numbers button');
var operatorButtons = document.querySelectorAll('.operators button');
var primeFactoryzationText = document.querySelector('.prime_factorization');
var primeSumText = document.querySelector('.prime_sum');

var stack = [];
var newNumber = true;
var newResult = false;
const maxNumber = Number.MAX_SAFE_INTEGER;
const maxNumberForDecomp = Math.pow(2, 25);

document.body.addEventListener("keypress", (e) => {
    e.preventDefault();

    var enterButton = document.querySelector('.calculator button');

    if (enterButton.value === e.key) pushOnStack();

    numberButtons.forEach(button => {
        if (button.value === e.key) {

            let input = inputTextbox.value;

            if (newResult === true && input.length > 0) {
                stack.push(input);

                inputTextbox.value = '';
                stackText.innerHTML = '';

                stack.forEach(element => {
                    if (stackText.innerHTML === '') stackText.innerHTML += `Stack: ${element}`;
                    else stackText.innerHTML += `, ${element}`;
                });

                newResult = false;
            }

            if (newNumber === false) inputTextbox.value += e.key;

            if (newNumber === true) {
                inputTextbox.value = e.key;
                newNumber = false;
            }
        }
    });

    operatorButtons.forEach(operator => {
        if (operator.value === e.key) calculateONP(operator.value);
    });
});

numberButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        let inputValue = inputTextbox.value;

        if (newResult === true && inputValue.length > 0) {
            stack.push(inputValue);

            inputTextbox.value = '';
            stackText.innerHTML = '';

            stack.forEach(element => {
                if (stackText.innerHTML === '') stackText.innerHTML += `Stack: ${element}`;
                else stackText.innerHTML += `, ${element}`;
            });

            newResult = false;
        }

        if (newNumber === false) inputTextbox.value += e.target.value;

        if (newNumber === true) {
            inputTextbox.value = e.target.value;
            newNumber = false;
        }
    });
});

operatorButtons.forEach(operator => {
    operator.addEventListener("click", () => calculateONP(operator.value));
});

document.body.addEventListener("keyup", (e) => {
    e.preventDefault();

    var backspaceButton = document.querySelector('#backspace');

    if (backspaceButton.value === e.key) backspace();
});

function pushOnStack() {
    let inputValue = document.getElementById('input').value;
    if (inputValue.length === 0) return;

    stack.push(parseInt(inputValue));
    newNumber = true;
    newResult = false;
    errorText.innerHTML = '';

    if (stackText.innerHTML === '') stackText.innerHTML += `Stack: ${stack.at(-1)}`;
    else stackText.innerHTML += `, ${stack.at(-1)}`;
}

function calculateONP(operator) {
    let inputValue = document.getElementById('input').value;
    var x, y;

    if (inputValue.length === 0 && stack.length < 2 || inputValue.length > 0 && stack.length === 0) {
        errorText.innerHTML = 'I need mode numbers!';
        return;
    }

    if (inputValue.length === 0 && stack.length > 1) {
        y = stack.pop();
        x = stack.pop();
    }

    if (inputValue.length > 0 && stack.length > 0) {
        y = parseInt(inputValue);
        x = stack.pop();
    }

    if (y === 0 && operator === '/') {
        errorText.innerHTML = 'Never divide by zero!!!';
        stackText.innerHTML = '';

        stack.forEach(element => {
            if (stackText.innerHTML === '') stackText.innerHTML += `Stack: ${element}`;
            else stackText.innerHTML += `, ${element}`;
        });
        return;
    }

    if (operator === '^') inputValue = eval(x ** y);
    else if (operator === "SWAP") inputValue = swap(x, y);
    else if (operator === "NWD") inputValue = NWD(x, y);
    else inputValue = Math.round(eval(x + operator + y));

    if (inputValue >= maxNumber) {
        inputTextbox.value = '';
        errorText.innerHTML = 'The result is too big :(';
        primeSumText.innerHTML = '';
        primeFactoryzationText.innerHTML = '';
        newResult = false;
        newNumber = true;
    }
    else if (inputValue < 0) {
        inputTextbox.value = '';
        errorText.innerHTML = 'The result must be positive!';
        primeSumText.innerHTML = '';
        primeFactoryzationText.innerHTML = '';
        newResult = false;
        newNumber = true;
    }
    else {
        errorText.innerHTML = '';
        inputTextbox.value = inputValue;
        newResult = true;
    }

    stackText.innerHTML = '';
    stack.forEach(element => {
        if (stackText.innerHTML === '') stackText.innerHTML += `Stack: ${element}`;
        else stackText.innerHTML += `, ${element}`;
    });

    if (operator !== "SWAP" && inputValue <= maxNumber) {
        primeFractorization(Math.round(inputValue));
        primeEvenSumFractorization(Math.round(inputValue));
    }
}

function isPrime(number) {
    if (number <= 1) return false;

    for (let i = 2; i < number; i++) {
        if (number % i == 0) return false;
    }

    return true;
}

function primeFractorization(number) {
    if (!isNaN(number) && number > 1) {
        let decompNumbers = [];
        let e = Math.floor(Math.sqrt(number));
        let result = `Fractorization: \\( ${number} = `;

        for (let i = 2; i <= e; i++) {
            while ((number % i) == 0) {
                decompNumbers.push(i);

                number = Math.floor(number / i);
                e = Math.floor(Math.sqrt(number));
            }
        }

        if (number > 1) decompNumbers.push(number);

        let uniqueDecompNumbers = [... new Set(decompNumbers)];

        for (let i = 0; i < uniqueDecompNumbers.length; i++) {
            let numberOfOccurance = decompNumbers.filter((v) => (v === uniqueDecompNumbers[i])).length;

            if (numberOfOccurance > 1) result += `${uniqueDecompNumbers[i]} ^{${numberOfOccurance}} \\cdot `;
            else result += `${uniqueDecompNumbers[i]} \\cdot `;
        }
        result = result.slice(0, -6);
        result += '\\)';

        primeFactoryzationText.innerHTML = result;
        MathJax.typeset();
    }
}

function primeEvenSumFractorization(number) {
    primeSumText.innerHTML = '';

    if (!isNaN(number) && number >= 4 && number % 2 === 0 && number <= maxNumberForDecomp) {
        let result = ``;

        for (let i = 2; i < number; i++) {
            if (isPrime(i) && isPrime(number - i)) {
                result = `Sum fractorization: \\( ${number} = ${i} + ${number - i} \\)`;
                break;
            }
        }
        primeSumText.innerHTML = result;
        MathJax.typeset();
    }
}

function swap(a, b) {
    stack.push(b);
    return a;
}

function NWD(a, b) {
    if (b === 0) return a;

    return NWD(b, a % b);
}

function clearAll() {
    if (inputTextbox.value.length > 0) inputTextbox.value = '';
    stackText.innerHTML = '';
    errorText.innerHTML = '';
    primeFactoryzationText.innerHTML = '';
    primeSumText.innerHTML = '';
    stack = [];
    newNumber = true;
    newResult = false;
}

function backspace() {
    if (inputTextbox.value.length > 0) {
        inputTextbox.value = inputTextbox.value.slice(0, -1);
        newNumber = false;
        newResult = false;
    }
}