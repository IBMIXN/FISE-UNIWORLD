import React from "react";

const useReducerState = (defaultState) => {
  const reducer = (state, newState) => ({ ...state, ...newState });
  return React.useReducer(reducer, defaultState);
};

export { useReducerState };
