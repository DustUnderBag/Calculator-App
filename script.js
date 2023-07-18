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
        if(a && answer && !b && !op) {
            clearAll();
        }
        rawInput += e.target.id;

        inputArr = organizeInput(rawInput);
        a = +inputArr[0];

        if(inputArr.length > 2 || a && op) { //if a, op exist already.
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

        if(a && b && op) { //operate for answer if the current calculation is followed by another op input.
            operate();
            op = e.target.id;
            rawInput += " " + op + " ";
            inputArr = organizeInput(rawInput);
            updateDisplay();
            return;
        }
        inputOp(e);

    })
);

equal.addEventListener('click', operate);

function inputOp(e) {
    op = e.target.id;
    rawInput += ` ${op} `;
    inputArr = organizeInput(rawInput);
    op = inputArr[inputArr.length-2];
    
    updateDisplay();
}

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
    answer = "";
    rawInput = "";
    inputArr.length = 0;
    updateDisplay();

    console.log(`Cleared, rawInput: ${rawInput}, inputArr: ${rawInput} 
                 a: ${a}, b: ${b}, op: ${op}.`);
}




function CalcData(a, b, op, answer) {
   this.a = a;
   this.b = b;
   this.op = op;
   this.answer = answer;
}
//console.log(new CalcData(15,20,"*"));