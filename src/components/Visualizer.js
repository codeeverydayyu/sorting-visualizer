import React, { useEffect, useState } from 'react';
import './Visualizer.css';

const UNSORTED_COLOR = 'gainsboro';
const COMPARISON_COLOR = 'darkorange';
const LARGER_COLOR = 'purple';
const KEY_COLOR = 'red';
const SORTED_COLOR = 'green';
const MIN_ARRAYSIZ = 8;
const MAX_ARRAYSIZE = 100;
const DEFAULT_ARRAYSIZE = 10;
const DEFAULT_ARRAYSIZE_STEP = 1;
const MIN_SPEED = 10; // fastest
const MAX_SPEED = 1010; // slowest
const DEFAULT_SPEED = 400;
const DEFAULT_SPEED_STEP = 50;

export default function Visualizer() {
  const [sizeSlider, setSizeSlider] = useState({
    min: MIN_ARRAYSIZ,
    max: MAX_ARRAYSIZE,
    step: DEFAULT_ARRAYSIZE_STEP,
    value: DEFAULT_ARRAYSIZE,
  });

  const [speedSlider, setSpeedSlider] = useState({
    min: MIN_SPEED,
    max: MAX_SPEED,
    step: DEFAULT_SPEED_STEP,
    value: DEFAULT_SPEED,
  });
  const [disableButton, setDisableButton] = useState(false);
  const [arraySize, setArraySize] = useState(sizeSlider.value);
  const [array, setArray] = useState(new Array(arraySize));
  const [speed, setSpeed] = useState(speedSlider.value);
  const [sortFunction, setSortFunction] = useState('bubbleSort');
  const [sorted, setSorted] = useState(false);
  const { innerWidth } = window;
  const numWidth = Math.floor(innerWidth / (array.length * 2));
  const fontSize = numWidth > 30 ? 14 : 0;
  const [previousArraySize, setPreviousArraySize] = useState(0);

  // generate a random array and set array.
  const randomArray = () => {
    setSorted(false);
    // check if the element is null to avoid null error
    let check = document.getElementById(0);
    if (!Object.is(check, null)) {
      // use previous array size to avoid null error
      for (let i = 0; i < previousArraySize; i++) {
        // avoid null error, since the array size is changing when moving array slider.
        if (Object.is(null, document.getElementById(i))) {
          break;
        }
        // set the bars' color to unsorted color every time that generates a new random array
        document.getElementById(i).style.backgroundColor = UNSORTED_COLOR;
      }
    }
    let randomRange = 300;
    arraySize < 50 ? (randomRange = 300) : (randomRange = 600);
    let arr = [];
    for (let i = 0; i < arraySize; i++) {
      arr.push(Math.floor(Math.random() * randomRange) + 5);
    }
    setArray(arr);
  };

  // set random array
  useEffect(() => {
    randomArray(arraySize);
  }, [arraySize]);

  // https://stackoverflow.com/questions/58816244/debugging-eslint-warning-function-declared-in-a-loop-contains-unsafe-reference
  const sleep = (speed) => {
    return new Promise((resolve) => setTimeout(resolve, speed));
  };

  // control array size
  const updateSize = (data) => {
    setSizeSlider({
      min: MIN_ARRAYSIZ,
      max: MAX_ARRAYSIZE,
      step: DEFAULT_ARRAYSIZE_STEP,
      value: data,
    });
    setArraySize(data);
  };

  // control the speed of visualization
  const updateSpeed = (data) => {
    setSpeedSlider({
      min: MIN_SPEED,
      max: MAX_SPEED,
      step: DEFAULT_SPEED_STEP,
      value: data,
    });
    setSpeed(MAX_SPEED + MIN_SPEED - data);
    // console.log('data:', data);
    // console.log(`${MAX_SPEED} + ${MIN_SPEED} - ${data}`);
    // console.log('speed: ', speed);
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

  const startSort = () => {
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

  const finishSort = () => {
    setPreviousArraySize(array.length);
    setSorted(true);
    setDisableButton(false);
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
    // console.log('end: ', array);
    // setDisableButton(false);
    finishSort();
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
      setColorById(j + 1, KEY_COLOR);
      await sleep(speed);

      while (j >= 0 && key < currentArray[j]) {
        currentArray[j + 1] = currentArray[j]; // shift the larger element to the right by 1

        // * not needed to set currentArray[j] in algorithm view, just for visualize purpose,
        // * show animation of shifting key bar to left and shifting sorted bar to right.
        currentArray[j] = key;
        setColorById(j, KEY_COLOR);
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
    // setDisableButton(false);
    finishSort();
  };

  return (
    <div>
      <div className='menu-bar-container'>
        <div className='brand-container'>
          <i className='bi bi-bar-chart-line-fill' style={{ padding: 10 }}></i>
          <div className='brand-text-container'>Sorting Visualizer</div>
        </div>
        <div className='button-container'>
          <button onClick={randomArray} disabled={disableButton}>
            Genarate random array
          </button>
          <div className='chooseSpeed-container'>
            <div className='slider-Container'>
              <div className='slider-text' disabled={disableButton}>
                Choose sorting speed
              </div>
              <input
                className='slider-image'
                type='range'
                min={speedSlider.min}
                max={speedSlider.max}
                step={speedSlider.step}
                onChange={(e) => updateSpeed(e.target.value)}
                value={speedSlider.value}
                disabled={disableButton}
              />
              &nbsp;
              <div className='slider-text' disabled={disableButton}>
                Choose array size
              </div>
              <input
                className='slider-image'
                type='range'
                min={sizeSlider.min}
                max={sizeSlider.max}
                onChange={(e) => updateSize(e.target.value)}
                value={sizeSlider.value}
                disabled={disableButton}
              />
            </div>
          </div>
          <div className='chooseAlgo-container'>
            <select
              className='chooseAlgo-container'
              value={sortFunction}
              onChange={(e) => setSortFunction(e.target.value)}
              disabled={disableButton}
            >
              <option value='bubbleSort'>Bubble sort</option>
              <option value='insertionSort'>Insertion sort</option>
            </select>
          </div>
          {!sorted && (
            <button
              className='sortButton'
              id='sort'
              onClick={startSort}
              disabled={disableButton}
            >
              Sort!
            </button>
          )}
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
              style={{ padding: '5px', color: KEY_COLOR }}
            ></i>
            Key Value
          </div>
        )}
      </div>

      <div className='sortingBars-container'>
        {Array.isArray(array)
          ? array.map((element, index) => {
              return (
                <div
                  animate={{}}
                  className='bar'
                  id={index}
                  key={index}
                  style={{
                    width: `${numWidth}px`,
                    height: `${element}px`,
                    fontSize: fontSize,
                  }}
                >
                  {element}
                </div>
              );
            })
          : null}
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

const setColorById = (id, color) => {
  if (document.getElementById(id) !== null) {
    document.getElementById(id).style.backgroundColor = color;
  }
};

const swap = (arr, x, y) => {
  var temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
};
