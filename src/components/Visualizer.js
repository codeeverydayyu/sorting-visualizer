import React, { useEffect, useState } from 'react';
import './Visualizer.css';

const UNSORTED_COLOR = 'gainsboro';
const COMPARISON_COLOR = 'darkorange';
const LARGER_COLOR = 'purple';
const SMALLER_COLOR = 'red';
const SORTED_COLOR = 'green';
const DEFAULT_SPEED = 400;
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
      arr.push(Math.floor(Math.random() * 300) + 5);
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
    const testArr = structuredClone(array);
    testArr.sort((a, b) => a - b);
    // console.log('inside testSort:');
    // console.log('testArr length: ', testArr.length);
    // console.log('array length: ', array.length);
    // console.log('testArr: ', testArr);
    // console.log('array: ', array);
    let testResult = arrayEqual(testArr, array);
    console.log('Test result is:', testResult);
    // console.log('--------------------------------');
  };

  const chooseSort = () => {
    setDisableButton(true);
    switch (sortFunction) {
      case 'bubbleSort':
        bubbleSort();
        break;
      case 'insertionSort':
        insertionSort();
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

  const setColorById = (id, color) => {
    if (document.getElementById(id) !== null) {
      document.getElementById(id).style.backgroundColor = color;
    }
  };

  /* ---------- Bubbot Sort ---------- */
  const bubbleSort = async () => {
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
          setArray([...array]); //deep copy
          /* setArray([...array, array]);
          result:[array, [array]]. 
          why using this statement will add [array] to the end of the array, 
          while console.log in this funcion, every thing is fine, no other element is added.
          Note: Array.toString() will not print out nested symbol, must use only console.log(Array) to show nested structure.*/
          // console.log(`[${i}] [${j}]: `, array);

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
    // console.log('end: ', array);
  };

  /* ---------- Insertion Sort ---------- */
  // Implemented different from normal insertion sort algorithm to fulfill visualization.
  const insertionSort = async () => {
    let currentArray = structuredClone(array);

    // * turn first bar to sorted color and wait for a while
    setColorById(0, SORTED_COLOR);
    await sleep(speed);

    for (let i = 1; i < currentArray.length; i++) {
      let key = currentArray[i];
      let j = i - 1;

      // * turn key bar to red color and wait for a while
      setColorById(j + 1, 'red');
      await sleep(speed);

      while (j >= 0 && key < currentArray[j]) {
        currentArray[j + 1] = currentArray[j]; // shift the larger element to the right by 1

        // * not needed to set currentArray[j] in algorithm view, just for visualize purpose,
        // * show animation of shifting key bar to left and shifting sorted bar to right.
        currentArray[j] = key;
        setColorById(j, 'red');
        setArray([...currentArray]);
        setColorById(j + 1, SORTED_COLOR);
        await sleep(speed);

        j--; // don't forget to move j to the left by 1, to compare previous previous element
      }
      /* 1. if the key is > current [j], the key finds its position.
      shouldn't shift anymore, stop the while loop, 
      the key should be in [j+1] position || since j is updated by -- in previous round, the correct position for key is at j+1*/
      currentArray[j + 1] = key;
      setArray([...currentArray]);
      setColorById(j + 1, SORTED_COLOR);
      await sleep(speed);
      // * every ith round, the bars before i are sorted
      setColorById(i - 1, SORTED_COLOR);
    }
    setColorById(currentArray.length - 1, SORTED_COLOR);

    setDisableButton(false);
  };

  return (
    <div>
      <div className='button-container'>
        <div className='chooseAlgo-container'>
          <button
            value={'bubbleSort'}
            onClick={(e) => setSortFunction(e.target.value)}
            disabled={disapleButton}
          >
            Bubble sort
          </button>
          &nbsp;
          <button
            value={'insertionSort'}
            onClick={(e) => setSortFunction(e.target.value)}
            disabled={disapleButton}
          >
            Insertion sort
          </button>
        </div>
        <div className='chooseSpeed-container'>
          <button onClick={slowSpeed} disabled={disapleButton}>
            Slow speed
          </button>
          &nbsp;
          <button onClick={defaultSpeed} disabled={disapleButton}>
            Default speed
          </button>
        </div>
        <div className='otherButton-container'>
          <button onClick={randomArray} disabled={disapleButton}>
            Genarate random array
          </button>
          &nbsp;
          <button
            onClick={chooseSort}
            disabled={disapleButton}
            style={{ color: 'red' }}
          >
            Sort!
          </button>
          &nbsp;
          <button onClick={testSort}>Test</button>
        </div>
      </div>

      <div className='colorSystem-container'>
        <div key={'unsorted'} className='oneColor'>
          <i
            className='bi bi-square-fill'
            style={{ padding: '5px', color: UNSORTED_COLOR }}
          ></i>
          Unsorted part of Array
        </div>

        <div key={'soted'} className='oneColor'>
          <i
            className='bi bi-square-fill'
            style={{ padding: '5px', color: SORTED_COLOR }}
          ></i>
          Sorted part of Array
        </div>

        {sortFunction === 'bubbleSort' && (
          <div key={'comparison'} className='oneColor'>
            <i
              className='bi bi-square-fill'
              style={{ padding: '5px', color: COMPARISON_COLOR }}
            ></i>
            Comparison Elements
          </div>
        )}

        {sortFunction === 'bubbleSort' && speed > 500 && (
          <div key={'larger'} className='oneColor'>
            <i
              className='bi bi-square-fill'
              style={{ padding: '5px', color: LARGER_COLOR }}
            ></i>
            Larger Element
          </div>
        )}

        {sortFunction === 'insertionSort' && (
          <div key={'insertion'} className='oneColor'>
            <i
              className='bi bi-square-fill'
              style={{ padding: '5px', color: 'red' }}
            ></i>
            Key Value
          </div>
        )}
      </div>

      <div className='sortingBars-container'>
        {array &&
          array.map((element, index) => {
            return (
              <div
                animate={{}}
                className='bar'
                id={index}
                key={index}
                style={{
                  height: `${element}px`,
                }}
              >
                {element}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function arrayEqual(array1, array2) {
  // console.log('inside arrayEqual:');
  // console.log('array1 length: ', array1.length);
  // console.log('array2 length: ', array2.length);
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
    // console.log('i is: ', i);
    // console.log('array1[i] is: ', array1[i]);
    // console.log('array2[i] is: ', array2[i]);
  }
  return true;
}
