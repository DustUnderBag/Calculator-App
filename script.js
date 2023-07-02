const display = document.querySelector('div#display');
const digits = document.querySelectorAll('button.digit');
const operators = document.querySelectorAll('button.operator');

console.log(digits);
console.log(operators);

let firstDigit = 5;
let secondDigit = 13;
let currentOperator = "+";

let displayContent = firstDigit + currentOperator + secondDigit;

display.textContent = displayContent;

digits.forEach(digit => 
    digit.addEventListener('click', e => {
    console.log(e.target.id);
    })
);

operators.forEach(operator => 
    operator.addEventListener('click', e => {
    console.log(e.target.id);
    })
);


function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    let answer = 
        (operator == "+")
        ? add(a,b)
        :(operator == "-")
        ? substract(a,b)
        :(operator == "*")
        ? multiply(a,b)
        : divide(a,b);

    return answer;
}

console.log(operate(firstDigit, secondDigit, currentOperator));