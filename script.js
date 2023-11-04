const inputDisplay = document.querySelector('.display > .input');
const mathDisplay = document.querySelector('div.display > .math');
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
let operated = false;

//Raw string input by user
let rawInput = "";
mathDisplay.textContent = "";
inputDisplay.textContent = 0;

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
    let key = e.key;
    if(key === "Enter") key = "="; //Convert "Enter" to "=" so both can refer to equalBtn.
    const button = document.getElementById(key);

    if(!button) return; //Skip if entered key isn't correlated to existing buttons here.

    //Regular Expressions
    const numberPattern = /\d+/;
    const opPattern = /[+*/-]/;

    //Input effects //If number OR dot is entered
    numberPattern.test(key) || key === "."
        ? button.classList.add('digit-effect')
        : button.classList.add('fnc-effect');
    
    //Equal
    if(key === "=" || key === "Enter") return operate();

    //Digits
    if(numberPattern.test(key)) return inputDigit(key);
    
    //Dots
    if(key === "." && dotEnabled) return inputDot();

    //Operator
    if(opPattern.test(key)) return inputOp(key);

    //Clear or Escape
    if(key === "Escape") return clearAll();

    //Backspace or Delete
    if(key === "Backspace") return;
});

//Remove Input Effect
const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => 
    button.addEventListener('transitionend', removeEffect)
);

function removeEffect(e) {
    if(e.propertyName !== "background-color") return;
    //console.log(e);
    this.classList.remove('digit-effect');
    this.classList.remove('fnc-effect');
    this.classList.remove('equal-effect');
}

function inputDigit(input) {
    if(operated) clearAll();

    rawInput += input;
    if(inputTarget == "a") {
        a = rawInput;
    }else {
        b = rawInput;
    }

    updateInputDisplay();
}

function inputDot() {
    if(operated) clearAll();

    dotEnabled = false;

    if(rawInput === "") { //If user enter decimal to an empty rawInput, it becomes "0.".
        rawInput += "0.";
    }else {
        rawInput += ".";
    }    

    if(inputTarget == "a") {
        a = rawInput;
    }else {
        b = rawInput;
    }

    updateInputDisplay();
}

function inputOp(input) {
    inputTarget = "b";
    if(operated) {  
        a = answer;
        b = "";
        operated = false; //reverts to non-operated state.
        /*
        Case when operator is entered immediately after an answer was operated, 
        a will be automatically entered and will equal to the previous answer, 
        finally, the calculator starts from accepting inputs of operator and b.
        */
    }

    if(a && b && op) {
        operate();
        a = answer;
        op = "";
    }

    op = input;
    rawInput = "";
    updateMathDisplay();
    updateInputDisplay();

    dotEnabled = true;
}


function operate() {
    if(!a && !b && !op) return; //Skip if nothing is entered.

    if(a && !op && !b) {
        b = a;
        a = 0
        op = "+"; //default op to + if op is not input yet.
    }

    if(b === 0 && op === "/") answer = "Infinity, ⚠️Dividing by 0 not possible!"; //avoid divided by 0.
    answer = methods[op](+a, +b);
    rawInput = answer;

    updateMathDisplay();
    updateInputDisplay();

    a = "";
    b = "";
    op = "";

    dotEnabled = true; //Switch on dot.
    operated = true;

    console.log("Answer: " + answer);
}

function updateMathDisplay() {
    let newOp = op;
    if(op === "*") { //Show * and / in a more readable way.
        newOp = "×";
    }else if(op === "/"){
        newOp = "÷";
    }

    const math = `${a.toString()} ${newOp} ${b.toString()}`
    mathDisplay.textContent = math;
}

function updateInputDisplay() {
    inputDisplay.textContent = rawInput;
}

function clearAll() {
    a = 0;
    b = "";
    op = "";
    answer = 0;
    rawInput = "";
    mathDisplay.textContent = "";
    inputDisplay.textContent = 0;

    inputTarget = "a";
    operated = false;
    dotEnabled = true;


    console.log(
    `Cleared!
    - rawInput: ${rawInput},
    - a: ${a} 
    - b: ${b}
    - op: ${op}`
    );
}

function CalcData(a, b, op, answer) {
   this.a = a;
   this.b = b;
   this.op = op;
   this.answer = answer;
}
//console.log(new CalcData(15,20,"*"));
