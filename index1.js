let display = document.querySelector('input[name="display"]');
let buttons = document.querySelectorAll('input[type="text"]:not([name="display"])');
let calculation = '';
let lastResult = '';
let newNumber = true;

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.value;
        
        switch(value) {
            case 'c':
                clear();
                break;

            case 'DEL':
                handleDelete();
                break;

            case '√':
                handleSquareRoot();
                break;

            case '%':
                handlePercentage();
                break;

            case '=':
                calculate();
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(value);
                break;

            case '.':
                handleDecimal();
                break;

            default:
                handleNumber(value);
        }
        
        updateDisplay();
    });
});

function clear() {
    calculation = '';
    lastResult = '';
    newNumber = true;
}

function handleDelete() {
    calculation = calculation.slice(0, -1);
    if (calculation === '') {
        clear();
    }
}

function handleSquareRoot() {
    try {
        const current = eval(calculation || '0');
        if (current < 0) {
            throw new Error('Invalid input');
        }
        calculation = Math.sqrt(current).toString();
        newNumber = true;
    } catch(error) {
        showError();
    }
}

function handlePercentage() {
    try {
        // If there's a pending operation, calculate percentage of the previous number
        let parts = calculation.match(/([+\-*/])?(\d*\.?\d*)$/);
        if (parts && parts[2]) {
            let num = parseFloat(parts[2]);
            let operator = parts[1] || '';
            let baseNumber = operator ? 
                eval(calculation.slice(0, calculation.length - parts[0].length)) : 
                100;
            
            let result = (baseNumber * (num / 100));
            calculation = operator ? 
                calculation.slice(0, calculation.length - parts[2].length) + result :
                result.toString();
        }
        newNumber = true;
    } catch(error) {
        showError();
    }
}

function handleOperator(value) {
    if (calculation !== '') {
        // Prevent multiple operators in a row
        if (isOperator(calculation.slice(-1))) {
            calculation = calculation.slice(0, -1);
        }
        calculation += value;
        newNumber = false;
    } else if (value === '-') {
        // Allow negative numbers
        calculation = value;
    }
}

function handleDecimal() {
    // Check if the current number already has a decimal point
    let parts = calculation.split(/[+\-*/]/);
    let currentNumber = parts[parts.length - 1];
    
    if (!currentNumber.includes('.')) {
        calculation += calculation === '' || isOperator(calculation.slice(-1)) ? '0.' : '.';
    }
}

function handleNumber(value) {
    if (newNumber && !isOperator(calculation.slice(-1))) {
        calculation = value;
    } else {
        calculation += value;
    }
    newNumber = false;
}

function calculate() {
    try {
        if (calculation) {
            lastResult = eval(calculation).toString();
            calculation = lastResult;
            newNumber = true;
        }
    } catch(error) {
        showError();
    }
}

function showError() {
    display.value = 'Error';
    calculation = '';
    newNumber = true;
    setTimeout(() => {
        display.value = calculation;
    }, 1000);
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function updateDisplay() {
    display.value = calculation;
}

// Prevent keyboard input on the display
display.addEventListener('keydown', (e) => {
    e.preventDefault();
});

