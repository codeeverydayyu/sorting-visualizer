import React, { useEffect, useState } from 'react';
import './Visualizer.css';

const UNSORTED_COLOR = 'gainsboro';
const COMPARISON_COLOR = 'darkorange';
const SORTED_COLOR = 'green';

export default function Visualizer() {
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState([]);
  const [speed, setSpeed] = useState(300);

  // generate a random array
  const randomArray = () => {
    let arr = [];
    for (let i = 0; i < arraySize; i++) {
      arr.push(Math.floor(Math.random() * 200) + 5);
    }
    setArray(arr);
    // check if the element is null to avoid null error
    let check = document.getElementById(0);
    if (check !== null) {
      for (let i = 0; i < arraySize; i++) {
        // set the bars' color to unsorted color every time that generates a new random array
        document.getElementById(i).style.backgroundColor = UNSORTED_COLOR;
      }
    }
  };

  // set random array for the first render
  useEffect(() => {
    randomArray();
  }, []);

  const fast = () => {
    setSpeed(10);
  };
  const slow = () => {
    setSpeed(300);
  };

  // https://stackoverflow.com/questions/58816244/debugging-eslint-warning-function-declared-in-a-loop-contains-unsafe-reference
  const sleep = (speed) => {
    return new Promise((resolve) => setTimeout(resolve, speed));
  };

  const swap = (arr, x, y) => {
    var temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
  };

  // Bubble sort algorithm
  const bubbleSort = async () => {
    let bar1, bar2;
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // change the color of comparison element
        bar1 = document.getElementById(j).style;
        bar2 = document.getElementById(j + 1).style;
        bar1.backgroundColor = COMPARISON_COLOR;
        bar2.backgroundColor = COMPARISON_COLOR;

        // swap elements and update array's changes to the state
        if (array[j] > array[j + 1]) {
          swap(array, j, j + 1);
          setArray([...array, array]);
        }

        // wait for a few milliseconds and then change color back to unsorted
        await sleep(speed);
        bar1.backgroundColor = UNSORTED_COLOR;
        bar2.backgroundColor = UNSORTED_COLOR;
      }
      // the element is in its sorted position, change color
      bar2.backgroundColor = SORTED_COLOR;
    }
    // the element is in its sorted position, change color
    bar1.backgroundColor = SORTED_COLOR;
  };

  // test results
  const testSort = () => {
    let testResult = false;
    const testArr = structuredClone(array);
    console.log(testArr === array);
    console.log('before using built-in sort');
    console.log(testArr.toString());
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

  return (
    <div>
      Visualizer
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
      <div className='button-container'>
        <button onClick={randomArray}>Genarate random array</button>
        <button onClick={bubbleSort}>Bubble sort</button>
        <button onClick={testSort}>Test</button>
        <button onClick={fast}>Fast speed</button>
        <button onClick={slow}>Slow speed</button>
      </div>
    </div>
  );
}
