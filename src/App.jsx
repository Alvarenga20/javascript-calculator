import { useState } from 'react';
import './App.css';

function App() {
  const [unchangedDisplay, setUnchangedDisplay] = useState('');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState([]);

  const numbersMap = {
    zero: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    decimal: '.',
  };

  const operatMap = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };

  // Handle number button click
  const handleNumbersClick = (num) => {
    const value = numbersMap[num];
    setDisplay((prevDisplay) => {
      if (prevDisplay === '0' && value !== '.') return value;
      if (value === '.' && prevDisplay.includes('.')) return prevDisplay;
      return prevDisplay + value;
    });
    setUnchangedDisplay((prev) => prev + value);
  };

  // Handle operator button click
  const handleOperationClick = (op) => {
    const currentOperation = operatMap[op];
    if (display !== '' || currentOperation === '-') {
      setExpression((prev) => {
        const lastEntry = prev[prev.length - 1];
        if (typeof lastEntry === 'string') {
          if (currentOperation === '-' && (lastEntry === '*' || lastEntry === '/')) {
            setDisplay('-');
            return prev;
          }
          return [...prev.slice(0, -1), currentOperation];
        } else {
          return [...prev, Number(display), currentOperation];
        }
      });
      setUnchangedDisplay((prevDisplay) => prevDisplay.replace(/[\+\-\*\/]$/, '') + ` ${currentOperation} `);
      setDisplay('');
    }
  };

  // Handle equals button click to evaluate the expression
  const handleEqualsClick = () => {
    if (display !== '') {
      const fullExpression = [...expression, Number(display)];
      const result = evaluateExpression(fullExpression);
      setDisplay(String(result));
      setUnchangedDisplay(String(result));
      setExpression([]);
    }
  };

  // Function to evaluate expression using Shunting Yard algorithm for PEMDAS precedence
  const evaluateExpression = (expr) => {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const ops = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b,
    };

    // Step 1: Convert to RPN (postfix notation) using the Shunting Yard algorithm
    let outputQueue = [];
    let operatorStack = [];
    expr.forEach((token) => {
      if (typeof token === 'number') {
        outputQueue.push(token);
      } else if (token in precedence) {
        while (
          operatorStack.length > 0 &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      }
    });

    // Pop remaining operators onto output queue
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop());
    }

    // Step 2: Evaluate the RPN expression
    let stack = [];
    outputQueue.forEach((token) => {
      if (typeof token === 'number') {
        stack.push(token);
      } else if (token in ops) {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(ops[token](a, b));
      }
    });

    // The result is the last item in the stack
    return stack[0];
  };

  // Handle clear button click to reset everything
  const handleClearClick = () => {
    setUnchangedDisplay('');
    setDisplay('0');
    setExpression([]);
  };

  return (
    <div id="background">
      <div className="displays">
        <div id="unchangedDisplay">{unchangedDisplay}</div>
        <div id="display">{display}</div>
      </div>
      <div id="calculator-grid">
        <div id="numbers-container">
          <button id="clear" onClick={handleClearClick}>AC</button>
          <div id="numbers-el">
            {['nine', 'eight', 'seven', 'four', 'five', 'six', 'three', 'two', 'one', 'zero', 'decimal'].map((key) =>
              <button key={key} id={key} className='numbers' onClick={() => handleNumbersClick(key)}>{numbersMap[key]}</button>
            )}
          </div>
        </div>
        <div id="action-el">
          {['add', 'subtract', 'multiply', 'divide'].map((key) =>
            <button key={key} id={key} onClick={() => handleOperationClick(key)}>{operatMap[key]}</button>
          )}
          <button id="equals" onClick={handleEqualsClick}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;