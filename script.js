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

alert(operate(3, 12, "/"));