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

let operated = false;

//Raw string input by user
let rawInput = "0";
mathDisplay.textContent = "";
inputDisplay.textContent = rawInput;

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
    if(key === ".") return inputDot();

    //Operator
    if(opPattern.test(key)) return inputOp(key);

    //Clear or Escape
    if(key === "Escape") return clearAll();

    //Backspace or Delete
    if(key === "Backspace") return removeLast();
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
    if(operated) clearAll(); //Reset if digit input follows an operated answer.

    rawInput =="0" 
        ? rawInput = input //If rawInput = 0, new input replaces the "0".
        :rawInput += input; //else, just add new input to the rawInput.

    if(inputTarget == "a") {
        a = +rawInput;
    }else {
        b = +rawInput;
    }
    updateInputDisplay();
}

function inputDot() {
    if(operated) clearAll();

    if(rawInput.toString().includes(".")) return; //Skip if decimal is already entered.

    if(rawInput === "") { //If user enter decimal to an empty rawInput, it becomes "0.".
        rawInput += "0.";
    }else {
        rawInput += "."; //Else just add "." to the rawInput.
    }    

    if(inputTarget == "a") {
        a = +rawInput;
    }else {
        b = +rawInput;
    }

    updateInputDisplay();
}

function inputOp(input) {
    inputTarget = "b";

    if(operated) {  
        /*If an operator is entered right after an operation, 
        the calculator assigns the answer to a and waits for b. */
        a = answer;
        b = "";

        operated = false; //reverts to non-operated state.
    }

    if(a && b && op) { 
         /*If an operator is entered after a completed input of a,b,op, 
         the calculator will operate for answer first, 
         then assign answer to a, and assign input to op. Finally, it waits for b */
        operate();
        a = answer;

        operated = false; //reverts to non-operated state.
    }

    op = input;
    rawInput = "";
    updateMathDisplay();
    updateInputDisplay();
}


function operate() {
    operated = true;

    if(!a && !b && !op) return; //Skip if nothing is entered.

    if(a && !op && !b) {
        b = a;
        a = 0
        op = "+"; //default op to + if op is not input yet.
    }

    answer = (b === 0 && op === "/")
    ? "⚠️Can't Divided by zero!" //Error if divided by 0.
    :  methods[op](+a, +b); //else operate for answer.

    rawInput = answer;

    updateMathDisplay();
    updateInputDisplay();

    a = "";
    b = "";
    op = "";

    console.log("Answer: " + answer);
}

function removeLast() {
    if(rawInput == "0" || operated) return;
    rawInput = rawInput.slice(0, -1); //slice from pos 0 to the last 2nd character.
    if(rawInput == "") rawInput = 0;

    if(inputTarget === "a") {
        a = rawInput;
    } else {
        b = rawInput;
    }

    operated = false;
    updateInputDisplay();
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
