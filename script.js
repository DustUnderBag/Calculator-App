const display = document.querySelector('div#display');
const buttons = document.querySelectorAll('button');
const digits = document.querySelectorAll('button.digit');
const operators = document.querySelectorAll('button.operator');
const equal = document.querySelector('button.equal');
const clear = document.querySelector('button.clear');

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

        inputArr = organizeInput(rawInput);
        a = +inputArr[0];

        if(inputArr.length > 2) {
            b = inputArr[inputArr.length-1];
        }

        updateDisplay();
    })
);

clear.addEventListener('click', clearAll);

operators.forEach(operator =>
    operator.addEventListener('click', e => {
        if(!rawInput) rawInput += 0; //If no number input before operator, first number becomes 0.
        if(a === "Infinity") a = 0;

        rawInput += ` ${e.target.id} `;

        inputArr = organizeInput(rawInput);
        op = inputArr[inputArr.length-2];
        
        updateDisplay();
    })
);

equal.addEventListener('click', operate);

function organizeInput(input) {
    let arr = input.split(" ");
    console.log(arr);
    return arr;
}

function updateDisplay() {
    processedInput = `${a} ${op} ${b}`;
    display.textContent = processedInput;
}

function operate() {
    if(!op) op = "+"; //default op to + if op is not input yet.

    if(b === 0 && op === "/") answer = "Infinity, ⚠️Dividing by 0 not possible!"; //avoid divided by 0.

    answer = methods[op](a, +b);
    display.textContent = answer;

    a = answer;
    rawInput = String(a);    
    inputArr.length = 0;
    organizeInput(rawInput);
    b = "";
    op = "";

    console.log("Answer: " + answer);
}

function clearAll() {
    a = 0;
    b = "";
    op = "";
    rawInput = "";
    inputArr.length = 0;
    updateDisplay();

    console.log(`Cleared, rawInput: ${rawInput}, inputArr: ${rawInput} 
                 a: ${a}, b: ${b}, op: ${op}.`);
}




function CalcPair(a, b, op) {
   this.a = a;
   this.b = b;
   this.op = op;
   this.answer = methods[this.op](a, +b);
}
//console.log(new CalcPair(15,20,"*"));