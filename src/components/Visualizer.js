import React, { useEffect, useState } from 'react';
import './Visualizer.css';

const UNSORTED_COLOR = 'gainsboro';
const COMPARISON_COLOR = 'darkorange';
const LARGER_COLOR = 'purple';
const SORTED_COLOR = 'green';
const DEFAULT_SPEED = 30;
const SLOW_SPEED = 1000;
const INITIAL_ARRAYSIZE = 10;

export default function Visualizer() {
  const [arraySize, setArraySize] = useState(INITIAL_ARRAYSIZE);
  const [array, setArray] = useState([]);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [sortFunction, setSortFunction] = useState('');
  const [disapleButton, setDisableButton] = useState(false);

  // generate a random array
  const randomArray = () => {
    // check if the element is null to avoid null error
    let check = document.getElementById(0);
    if (check !== null) {
      for (let i = 0; i < arraySize; i++) {
        // set the bars' color to unsorted color every time that generates a new random array
        document.getElementById(i).style.backgroundColor = UNSORTED_COLOR;
      }
    }
    let arr = [];
    for (let i = 0; i < arraySize; i++) {
      arr.push(Math.floor(Math.random() * 800) + 5);
    }
    setArray(arr);
  };

  // set random array for the first render
  useEffect(() => {
    randomArray();
  }, []);

  // control the speed of visualization
  const slowSpeed = () => {
    setSpeed(SLOW_SPEED);
  };
  const defaultSpeed = () => {
    setSpeed(DEFAULT_SPEED);
  };
  // https://stackoverflow.com/questions/58816244/debugging-eslint-warning-function-declared-in-a-loop-contains-unsafe-reference
  const sleep = (speed) => {
    return new Promise((resolve) => setTimeout(resolve, speed));
  };

  // test results
  const testSort = () => {
    let testResult = false;
    const testArr = structuredClone(array);
    testArr.sort((a, b) => a - b);
    if (testArr.length === array.length) {
      for (let i = 0; i < testArr.length; i++) {
        if (testArr[i] !== array[i]) {
          break;
        }
        testResult = true;
      }
    }
    console.log('test result: ', testResult.toString());
  };

  const setBubbleSort = () => {
    setSortFunction('bubbleSort');
  };

  const chooseSort = () => {
    switch (sortFunction) {
      case 'bubbleSort':
        bubbleSort();
        break;
      default:
        break;
    }
  };

  const swap = (arr, x, y) => {
    var temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
  };

  // Bubble sort algorithm
  const bubbleSort = async () => {
    setDisableButton(true);
    let bar1, bar2;
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // highlight the comparing bars' color to comparison color for a few milliseconds
        bar1 = document.getElementById(j).style;
        bar2 = document.getElementById(j + 1).style;
        bar1.backgroundColor = COMPARISON_COLOR;
        bar2.backgroundColor = COMPARISON_COLOR;
        await sleep(speed);

        // if in slow speed, highlight the comparison result: larger bar's color to purple for a few milliseconds
        if (speed > 500) {
          500 && array[j] > array[j + 1]
            ? (bar1.backgroundColor = LARGER_COLOR)
            : (bar2.backgroundColor = LARGER_COLOR);
          await sleep(speed);
        }

        // swap elements and update array's changes to the state, the height of both bars will change accordingly
        if (array[j] > array[j + 1]) {
          swap(array, j, j + 1);
          setArray([...array, array]);
          // FIXME: after swap, the render div will increase one more div than the number of array length, push the whole bars one bar to the right

          // after the swap, bar2 must be larger,
          // if in slow speed, highlight bar2 to larger color and bar1 to comparison color for a few milliseconds.
          if (speed > 500) {
            bar1.backgroundColor = COMPARISON_COLOR;
            bar2.backgroundColor = LARGER_COLOR;
            await sleep(speed);
          }
        }

        // change color back to unsorted color
        bar1.backgroundColor = UNSORTED_COLOR;
        bar2.backgroundColor = UNSORTED_COLOR;
      }
      // the element is in its sorted position, change color to sorted
      bar2.backgroundColor = SORTED_COLOR;
      await sleep(speed);
    }
    // the element is in its sorted position, change color to sorted
    if (typeof bar1 !== 'undefined') {
      bar1.backgroundColor = SORTED_COLOR;
    }
    // console.log('after bubble sort, the length of array is: ', array.length);
    setDisableButton(false);
  };

  return (
    <div>
      <div className='button-container'>
        <button onClick={randomArray} disabled={disapleButton}>
          Genarate random array
        </button>
        <button onClick={setBubbleSort} disabled={disapleButton}>
          Bubble sort
        </button>
        <button onClick={testSort}>Test</button>
        <button onClick={slowSpeed} disabled={disapleButton}>
          Slow speed
        </button>
        <button onClick={defaultSpeed} disabled={disapleButton}>
          Default speed
        </button>
        <button onClick={chooseSort} disabled={disapleButton}>
          Sort
        </button>
      </div>

      <div className='colorSystem-container'>
        <div
          key={'unsorted'}
          className='square'
          style={{ background: UNSORTED_COLOR }}
        >
          Unsorted Elements
        </div>
        <div
          key={'comparison'}
          className='square'
          style={{ background: COMPARISON_COLOR }}
        >
          Comparison Elements
        </div>
        <div
          key={'soted'}
          className='square'
          style={{ background: SORTED_COLOR }}
        >
          Sorted Elements
        </div>
      </div>
      <div className='sortingBars-container'>
        {array &&
          array.map((element, index) => {
            return (
              <div
                className='bar'
                id={index}
                key={index}
                style={{
                  height: `${element}px`,
                }}
              ></div>
            );
          })}
      </div>
    </div>
  );
}
