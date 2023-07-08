const display = document.querySelector('div#display');
const buttons = document.querySelectorAll('button');
const digits = document.querySelectorAll('button.digit');
const operators = document.querySelectorAll('button.operator');
const equal = document.querySelector('button.equal');

let a = 0;
let b = 0;
let op = "";

let rawInput = "";

display.textContent = a;

const methods = {
    "+": function(a, b) {
        return a +  b;
    },
    "-"(a, b) {
        return a -b;
    },
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
};

digits.forEach(digit => 
    digit.addEventListener('click', e => {
        a = e.target.id;
        rawInput += a;
        updateDisplay();
    })
);

operators.forEach(operator =>
    operator.addEventListener('click', e => {
        op = e.target.id;
        rawInput += op;
        updateDisplay();
    })
);


function updateDisplay() {
    display.textContent = rawInput;
}