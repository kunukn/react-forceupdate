// ______@ts-nocheck

import React from 'react'
import { useForceUpdate, runForceUpdate } from '../src'
import './styles.css'

export default {
  title: 'Welcome',
}

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.

export const Default = () => {
  let nonReactive = {
    background: '',
    color: '',
  }

  let BoxChild = ({ children }: any) => {
    let [value, setValue] = React.useState(Date.now())

    return (
      <div className="box" style={{ color: nonReactive.color }}>
        <div>box-child</div> <div>{value}</div>
        <button
          onClick={() => {
            setValue(Date.now())
          }}
        >
          update
        </button>
        {children}
      </div>
    )
  }

  let Box = ({ children }: any) => {
    useForceUpdate() // re-render on runForceUpdate event
    let [value, setValue] = React.useState(Date.now())

    return (
      <div className="box" style={{ background: nonReactive.background }}>
        <div>box</div>{' '}
        <div>
          Value should not change on global rerender: <p>{value}</p>
        </div>
        <button
          onClick={() => {
            setValue(Date.now())
          }}
        >
          update
        </button>
        {children}
        <BoxChild />
      </div>
    )
  }

  function App() {
    let onForceUpdate = () => {
      // non-reactive changes.
      nonReactive.background =
        nonReactive.background === 'cyan' ? 'white' : 'cyan'
      nonReactive.color = nonReactive.color === 'red' ? 'darkblue' : 'red'

      // Apply reactivity for the changes.
      runForceUpdate() // outcomment and changes don't update
    }

    return (
      <div className="App">
        <button className="btn-main" onClick={onForceUpdate}>
          Re-rerender all
        </button>
        <div>
          <Box>
            <Box />
          </Box>
          <Box />
          <Box />
          <Box>
            <Box />
          </Box>
        </div>
        <button className="btn-main" onClick={onForceUpdate}>
          Re-rerender all
        </button>
      </div>
    )
  }

  return <App />
}

export const Type = () => {
  let Box = ({ type, types }: any) => {
    let forceUpdateInfo = useForceUpdate(types || type) // re-render on runForceUpdate event

    let [value, setValue] = React.useState(Date.now())
    let rerender = React.useRef(-1)
    rerender.current++

    return (
      <div className="box">
        <div>box {type}</div>
        {types && <pre>{JSON.stringify(types, null, 2)}</pre>}
        <pre>{JSON.stringify(forceUpdateInfo, null, 2)}</pre>
        <div>
          Value should not change on re-render: <p>{value}</p>
        </div>
        <button
          onClick={() => {
            setValue(Date.now())
          }}
        >
          update
        </button>
        <div>re-render count: {rerender.current}</div>
      </div>
    )
  }

  function App() {
    return (
      <div className="App">
        <button
          className="btn-main"
          onClick={() => {
            runForceUpdate('alpha', { date: Date.now() })
          }}
        >
          Alpha Re-rerender all
        </button>
        <button
          className="btn-main"
          onClick={() => {
            runForceUpdate('bravo')
          }}
        >
          Bravo Re-rerender all
        </button>
        <button className="btn-main" onClick={() => runForceUpdate()}>
          Re-rerender all default
        </button>
        <div>
          <Box type="alpha" />
          <Box type="bravo" />
          <Box type="alpha" />
          <Box type="bravo" />
          <Box />
          <Box types={['alpha', 'default']} />
        </div>
      </div>
    )
  }

  return <App />
}

export const SenderReceiver = () => {
  const Receiver = () => {
    let state = useForceUpdate('alpha')
    let renderTime = React.useRef({}).current
    renderTime = Date.now()
    return (
      <div>
        <pre data-testid="receiver-payload">
          {JSON.stringify(state)}
        </pre>
        <div>{renderTime}</div>
      </div>
    )
  }

  const Sender = () => {
    return (
      <button
        data-testid="sender-button"
        onClick={() => {
          runForceUpdate('alpha', 'hello')
        }}
      >
        Send
      </button>
    )
  }

  const App = () => {
    return (
      <div>
        <Receiver />
        <Sender />
      </div>
    )
  }

  return <App />
}
