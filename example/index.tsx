// @ts-nocheck

// import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useForceUpdate, runForceUpdate } from '../.';

let background = '';

const Box = ({ children }) => {
  useForceUpdate();

  let [state, setState] = React.useState(Date.now());

  return (
    <div className="box" style={{ background }}>
      <p>{state}</p>
      <button
        onClick={() => {
          setState(Date.now());
        }}
      >
        update
      </button>
      {children}
    </div>
  );
};

const App = () => {
  let onForceUpdate = () => {
    background = background === 'white' ? 'cyan' : 'white';
    runForceUpdate();
  };

  return (
    <div>
      <button onClick={onForceUpdate}>force update</button>
      <Box>box</Box>
      <Box>
        <p>box</p>
        <Box>box</Box>
      </Box>
      <Box>box</Box>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
