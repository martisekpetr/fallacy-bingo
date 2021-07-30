import React, { useState, useMemo, useCallback, useEffect } from 'react'
import './App.css'
import data from './cards.json'


const INITIAL_SELECTION = [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, true, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
]


function App() {
  const [selection, setSelection] = useState(INITIAL_SELECTION)
  const [cards, setCards] = useState([[], [], [], [], []])

  const isBingo = useMemo(() => {
    const row = [true, true, true, true, true]
    const col = [true, true, true, true, true]
    const diag = [true, true]
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        row[i] = row[i] && selection[i][j]
        col[j] = col[j] && selection[i][j]
        if (i === j) {
          diag[0] = diag[0] && selection[i][j]
        }
        if (i + j === 4) {
          diag[1] = diag[1] && selection[i][j]
        }
      }
    }
    return (
      row[0] || row[1] || row[2] || row[3] || row[4] || 
      col[0] || col[1] || col[2] || col[3] || col[4] || 
      diag[0] || diag[1]
    )
  }, [selection])


  const handleCellClick = useCallback((i,j) => {
    setSelection(selection.map((row,i2) => (
      row.map((cell,j2) => ((i === i2) && (j === j2)) ? !cell : cell)
    )))
  }, [selection, setSelection])

  const reset = useCallback(() => {
    setSelection(INITIAL_SELECTION)
    const nums = new Set();
    while(nums.size !== 25) {
      nums.add(Math.floor(Math.random() * data.length));
    }
    const indexes = Array.from(nums)
    const newCards = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        newCards[i][j] = data[indexes[i*5 + j]]
      }
    }
    setCards(newCards)
  })

  useEffect(() => reset(), [])

  return (
    <div className="App">
      <div className="container">
        {
          cards.map((row, i) => (
            row.map((item, j)  => (
              (i === 2) && (j === 2)
                ? (
                  <div key={i*10 + j} className="cell free">FREE</div>
                )
                : (
                  <div
                    key={i*10 + j}
                    className={`cell clickable ${selection[i][j] ? 'selected': ''}`}
                    onClick={() => { handleCellClick(i,j)}}
                  >
                    {item?.title}
                    {/* {item?.summary} */}
                  </div>
                )
            ))
          ))
        }
      </div>
      { isBingo && (
        <div className="victory-overlay">
          <div className="victory-box">
            BINGO!
            <br />
            <br />
            <button type="button" onClick={reset}>Reset the board</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
