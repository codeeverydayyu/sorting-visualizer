import React, { useEffect, useState } from 'react';
import './Visualizer.css';

export default function Visualizer() {
  const [array, setArray] = useState([]);

  // generate a random array
  const randomArray = () => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 100) + 5);
    }
    setArray(arr);
    console.log('reset random array:');
    console.log(array.toString());
  };

  // update default array from random arrayfor the first time
  useEffect(() => {
    randomArray();
  }, []);
  // WHY use useEffect won't cause too many re-renders error?

  const swap = (arr, xp, yp) => {
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
  };

  // sorting algorithm
  const bubbleSort = () => {
    console.log('bubble sort');
    console.log('unsorted array:');
    console.log(array.toString());
    var i, j;
    for (i = 0; i < array.length - 1; i++) {
      for (j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          swap(array, j, j + 1);
        }
      }
    }
    console.log('sorted array:');
    console.log(array.toString());
  };

  // test results
  const testSort = () => {
    console.log('test result:');
    let testResult = false;
    const testArr = [...array];
    testArr.sort();
    if (testArr.length !== array.length) {
      return;
    } else {
      for (let i = 0; i < testArr.length; i++) {
        if (testArr[i] !== array[i]) {
          return;
        }
        testResult = true;
      }
    }
    console.log(testResult.toString());
  };

  return (
    <div>
      Visualizer
      <div className='sortingBars-container'>
        {array.map((element, index) => {
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
        <button onClick={randomArray}>Reset Array</button>
        <button onClick={bubbleSort}>Bubble Sort</button>
        <button onClick={testSort}>Test</button>
      </div>
    </div>
  );
}
