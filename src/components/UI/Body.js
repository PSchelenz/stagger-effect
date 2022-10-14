import React, { useRef, useEffect, useReducer } from "react";
import Screen from "./Screen";

import classes from "./Body.module.css";

const screensReducer = (state, action) => {
  if (action.type === "CHANGE_AMOUNT") {
    const desiredScreensInX = action.screensInX;
    const desiredScreensInY = action.screensInY;

    const desiredTimeouts = Array(desiredScreensInY)
      .fill()
      .map(() => Array(desiredScreensInX).fill(0));

    return {
      screensInX: desiredScreensInX,
      screensInY: desiredScreensInY,
      screensTimeout: desiredTimeouts,
      isGlobalVisible: state.isGlobalVisible
    };
  }

  if (action.type === "CHANGE_TIMEOUTS") {
    const desiredScreensInX = state.screensInX;
    const desiredScreensInY = state.screensInY;

    const desiredTimeouts = Array(desiredScreensInY)
      .fill()
      .map(() => Array(desiredScreensInX).fill(0));

    const startingRow = action.row;
    const startingCol = action.col;

    const maxRowRadius = Math.max(startingRow, Math.abs(desiredScreensInY - startingRow));
    const maxColRadius = Math.max(startingCol, Math.abs(desiredScreensInX - startingCol));

    const maxRadius = Math.ceil(Math.sqrt(Math.pow(maxRowRadius, 2) + Math.pow(maxColRadius, 2))) + 2;

    for(let r = 0; r < maxRadius; r++) {
      for(let i = 0; i < desiredScreensInY; i++) {
        for(let j = 0; j < desiredScreensInX; j++) {
          if (Math.pow(i - startingRow, 2) + Math.pow(j - startingCol, 2) <= Math.pow(r, 2) && desiredTimeouts[i][j] === 0) {
            desiredTimeouts[i][j] = 40 * r + 1
          }
        }
      }
    }

    return {
      screensInX: desiredScreensInX,
      screensInY: desiredScreensInY,
      screensTimeout: desiredTimeouts,
      isGlobalVisible: !state.isGlobalVisible
    };
  }

  return {
    screensInX: 0,
    screensInY: 0,
    screensTimeout: [],
    isGlobalVisible: state.isGlobalVisible
  };
};

const Body = (props) => {
  const bodyRef = useRef();

  const [screensState, dispatchScreens] = useReducer(screensReducer, {
    screensInX: 0,
    screensInY: 0,
    screensTimeout: [],
    isGlobalVisible: true,
  });

  const calculateScreensAmount = () => {
    const bodyWidth = bodyRef.current.clientWidth;
    const bodyHeight = bodyRef.current.clientHeight;
    const desiredWH = 65;

    let desiredScreensInX = Math.round(bodyWidth / desiredWH);
    let desiredScreensInY = Math.round(bodyHeight / desiredWH);

    dispatchScreens({
      type: "CHANGE_AMOUNT",
      screensInX: desiredScreensInX,
      screensInY: desiredScreensInY,
    });
  };

  useEffect(() => {
    calculateScreensAmount();
    window.addEventListener("resize", calculateScreensAmount);
  }, []);

  const handleScreenClick = (row, col) => {
    dispatchScreens({ type: "CHANGE_TIMEOUTS", row: row, col: col });
  };

  return (
    <div
      className={classes.body}
      ref={bodyRef}
      style={{
        "--x-screens": screensState.screensInX,
        "--y-screens": screensState.screensInY,
      }}
    >
      {Array(screensState.screensInX * screensState.screensInY)
        .fill()
        .map((_, idx) => {
          const row = Math.floor(idx / screensState.screensInX);
          const col = idx % screensState.screensInX;
          return (
            <Screen
              key={idx}
              timeout={screensState.screensTimeout[row][col]}
              isGlobalVisible={screensState.isGlobalVisible}
              onClick={handleScreenClick.bind(null, row, col)}
            />
          );
        })}
    </div>
  );
};

export default Body;
