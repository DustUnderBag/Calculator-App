const display = document.querySelector('div#display');
const buttons = document.querySelectorAll('button');
const digits = document.querySelectorAll('button.digit');
const operators = document.querySelectorAll('button.operator');
const equal = document.querySelector('button.equal');

let a = 0;
let b = "";
let op = "";
let answer = 0;

let rawInput = "";
let processedInput = "";
let inputArr = [];

display.textContent = answer;

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
        rawInput += e.target.id;

        inputArr = cleanUpInput(rawInput);
        a = +inputArr[0];

        if(inputArr.length > 2) {
            b = +inputArr[inputArr.length-1];
        }

        updateDisplay();
    })
);

operators.forEach(operator =>
    operator.addEventListener('click', e => {
        rawInput += ` ${e.target.id} `;

        inputArr = cleanUpInput(rawInput);
        op = inputArr[inputArr.length-2];
        
        updateDisplay();
    })
);

equal.addEventListener('click', () => {
    operate();
    display.textContent = answer;
    }
);



function cleanUpInput(input) {
    let arr = input.split(" ");
    console.log(arr);
    return arr;
}

function updateDisplay() {
    processedInput = `${a} ${op} ${b}`;
    display.textContent = processedInput;
}

function operate() {
   answer = methods[op](a,b);
}