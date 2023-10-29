const display = document.querySelector('div.display');
const digitBtn = document.querySelectorAll('button.digit');
const opBtn = document.querySelectorAll('button.operator');
const equalBtn = document.querySelector('button.equal');
const clearBtn = document.querySelector('button.clear');
const dotBtn = document.querySelector('button.dot');

let a = 0;
let b = "";
let op = "";
let answer = 0;
let inputTarget = "a"; //Determine which data is being input, either a or b.

let dotEnabled = true;

//Raw string input by user
let rawInput = "";
let processedInput = "";

//rawInput splitted into individual inputs
let inputArr = [];

display.textContent = answer;

const methods = {
    "+": function(a, b) {
        return a + b;
    },
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
};

//Mouse click handler
digitBtn.forEach(digit => digit.addEventListener('click', e => inputDigit(e.target.id)));
opBtn.forEach(operator => operator.addEventListener('click', e => inputOp(e.target.id)));
dotBtn.addEventListener('click', inputDot);
equalBtn.addEventListener('click', operate);
clearBtn.addEventListener('click', clearAll);

//Keydown handler
window.addEventListener('keydown', e => { 
    const key = e.key;
    const button = document.getElementById(key);


    //Regular Expressions
    const numberPattern = /\d+/;
    const opPattern = /[+*/-]/;

    //Digits
    if(numberPattern.test(key)) {
        inputDigit(key);
        button.classList.add('digit-effect');
    }

    //Dot
    if(key === ".") {
        inputDot(key);
        button.classList.add('digit-effect');
    }
    
    //Equals
    if(key === "=" || key === "Enter") {
        operate();
        button.classList.add('equal-effect');
    }

    //Operator
    if(opPattern.test(key)) {
        inputOp(key);
        button.classList.add('fnc-effect');
    }

    //Clear or Escape
    if(key === "Escape") {
        clearAll();
        button.classList.add('fnc-effect');
    };

    //Backspace or Delete
    if(key === "Backspace") {
        button.classList.add('fnc-effect');
    }

});


function inputDigit(input) {
    //Start fresh if previous number pair was calculated with equalBtn.
    if(a && answer && !b && !op) clearAll();
    if(+input === 0 && +a === 0) return;
    rawInput += input;
    inputArr = organizeInput(rawInput);

    a = inputArr[0];

    if(inputArr.length > 2 || a && op) { //if a, op exist already.
        b = inputArr[inputArr.length-1];
    }
    updateDisplay();
}

function inputDot() {
    if(!dotEnabled) return; //Does nothing if dot is NOT enabled.

    dotEnabled = false; //Switch off dotBtn.
    rawInput += ".";
    inputArr = organizeInput(rawInput);

    a = inputArr[0];

    if(inputArr.length > 2 || a && op) { //if a, op exist already.
        b = inputArr[inputArr.length-1];
    }
    updateDisplay();
}

function inputOp(input) {
    //If no number input before operator, first number becomes 0.
    if(!rawInput) rawInput += 0; 

    if(a === "Infinity") a = 0;

    //operate for answer if the current calculation is followed by another op input.
    if(a && b && op) {  
        operate();
        op = input;
        rawInput += ` ${op} `;
        inputArr = organizeInput(rawInput);
        updateDisplay();
        return;
    }

    op = input;
    rawInput += ` ${op} `;
    inputArr = organizeInput(rawInput);
    op = inputArr[inputArr.length-2];
    
    updateDisplay();
    
    dotEnabled = true; //Switch on dot.
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
    answer = methods[op](+a, +b);
    display.textContent = answer;

    a = answer;
    rawInput = String(a); //then rawInput = "a"
    inputArr.length = 0;
    organizeInput(rawInput);
    b = "";
    op = "";

    dotEnabled = true; //Switch on dot.

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
