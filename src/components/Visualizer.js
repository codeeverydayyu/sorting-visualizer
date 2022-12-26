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
  };

  // update default array from random arrayfor the first time
  useEffect(() => {
    randomArray();
  }, []);
  // WHY use useEffect won't cause too many re-renders error?

  // show random array on page in bars
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
    </div>
  );
}
