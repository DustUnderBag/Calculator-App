const inputDisplay = document.querySelector('.display > .input');
const mathDisplay = document.querySelector('div.display > .math');
const digitBtn = document.querySelectorAll('button.digit');
const opBtn = document.querySelectorAll('button.operator');
const equalBtn = document.querySelector('button.equal');
const clearBtn = document.querySelector('button.clear');
const deleteBtn = document.querySelector('button.backspace');
const dotBtn = document.querySelector('button.dot');
const historyDisplay = document.querySelector('div.history > ul.list');
const clearHistoryBtn = document.querySelector('button.clear-history');

let a = 0;
let b = "";
let op = "";
let answer = 0;
let inputTarget = "a"; //Determine which data is being input, either a or b.
const history = []; //Array of calculation history.

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
digitBtn.forEach(digit => digit.addEventListener('click', () => inputDigit(digit.id)));
opBtn.forEach(operator => operator.addEventListener('click', () => inputOp(operator.id)));
dotBtn.addEventListener('click', inputDot);
equalBtn.addEventListener('click', operate);
clearBtn.addEventListener('click', clearAll);
deleteBtn.addEventListener('click',removeLast);
clearHistoryBtn.addEventListener('click', clearHistory);

//Keydown handler
window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
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

    //Remove Effect when transitioned.
    button.addEventListener('transitionend', removeEffect);
    
    //Equal
    if(key === "=" || key === "Enter") return operate();

    //Digits
    if(numberPattern.test(key)) return inputDigit(key);
    
    //Dots
    if(key === ".") return inputDot();

    //Operator
    if(opPattern.test(key)) return inputOp(key);

    //Clear or Escape
    if(key === "Escape") return  clearAll();

    //Backspace or Delete
    if(key === "Backspace") return removeLast();
}

function removeEffect(e) {
    if(e.propertyName !== "background-color") return;
    this.classList.remove('digit-effect');
    this.classList.remove('fnc-effect');
    this.classList.remove('equal-effect');
}

function inputDigit(input) {
    if(operated) clearAll(); //Reset if digit input follows an operated answer.
    if(rawInput.length >= 17) return; //Avoid rawInput being too long.
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
    rawInput = "0";

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

    if(a && op && !b) { //If b isn't entered.
        b = 0;
    }

    answer = (b === 0 && op === "/")
    ? "⚠️No divided by 0!" //Error if divided by 0.
    :  roundNumber(methods[op](+a, +b)); //else operate for answer.

    rawInput = answer;

    updateMathDisplay();
    updateInputDisplay();

    logHistory();

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

function roundNumber(number) {
    return (typeof number === "number")
    ? Math.round(number * 1000) / 1000 
    : number;
}

function updateMathDisplay() {
    const math = `${a.toString()} ${convertOp(op)} ${b.toString()}`
    mathDisplay.textContent = math;
}

function updateInputDisplay() {
    inputDisplay.textContent = rawInput;
}

function convertOp(op) {
    switch(op) {
        case "*":
            return "×";
            break;
        case "/":
            return "÷";
            break;
        default:
            return op;
    }
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

function logHistory() {
    history.unshift(new Item(a, b, op, answer)); //Insert new calculation to the start of array.
    if(history.length > 3) history.pop();

    //Remove all child 
    removeAllChild(historyDisplay);
    
    for(let i=0; i < history.length; i++) {
        let item = document.createElement('li');

        item.setAttribute('id', 'item' + i);
        history[i].id = item.id; //Current data obj's id = current list item's id.
        item.classList.add('item');
        item.textContent = `${history[i].a} ${convertOp(history[i].op)} ${history[i].b} = ${history[i].answer}`;
        historyDisplay.appendChild(item);

        item.addEventListener('click', restoreHistory);
    }
    
    historyDisplay.firstChild.style.borderColor = "orange";
}

function restoreHistory() {
    //Return last digit char from id of selected list's item(item0, item1, item2...)
    let index = this.id.slice(-1); 

    operated = false;
    a = history[index].a;
    b = history[index].b;
    op = history[index].op;
    answer = history[index].answer;
    operated = true;
    inputTarget = "a"

    rawInput = answer;
    updateMathDisplay();
    updateInputDisplay();
}

function clearHistory(){
    history.length = 0;
    removeAllChild(historyDisplay);
}

function removeAllChild(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function Item(a, b, op, answer) {
   this.a = a;
   this.b = b;
   this.op = op;
   this.answer = answer;
}

