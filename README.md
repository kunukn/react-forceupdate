# react-forceupdate

[![npm version](https://img.shields.io/npm/v/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![npm downloads](https://img.shields.io/npm/dm/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![gzip](https://img.shields.io/bundlephobia/minzip/react-forceupdate.svg)](https://bundlephobia.com/result?p=react-forceupdate)
[![license](https://img.shields.io/github/license/kunukn/react-forceupdate)](https://github.com/kunukn/react-forceupdate/blob/master/LICENSE)

## About

React hooks for force updating components.
Force update from anywhere to those using a useForceUpdate hook.

## Dependency

mitt: tiny library ~270 byte gzipped.
https://bundlephobia.com/result?p=mitt

## Install

```bash
npm install mitt
npm install react-forceupdate

# or
# yarn add mitt
# yarn add react-forceupdate
```

## API

### useForceUpdate

```jsx
import { useForceUpdate } from 'react-forceupdate'

function ReceiverComponent() {
  // re-render this component on run event
  useForceUpdate()

  // re-render this component on run alpha event
  useForceUpdate('alpha')

  // re-render this component on alpha or bravo run event
  useForceUpdate(['alpha', 'bravo'])

  // re-render this component on charlie run event and receive payload
  let { payload } = useForceUpdate('charlie')

  return <div>component {payload.message}</div>
}
```

### useForceUpdate

```jsx
import { runForceUpdate } from 'react-forceupdate'

function SenderComponent() {
  let onUpdate = () => {
    runForceUpdate()
  }
  let onAlphaUpdate = () => {
    runForceUpdate('alpha')
  }
  let onAlphaBravoUpdate = () => {
    runForceUpdate(['alpha', 'bravo'])
  }
  let onCharlieUpdate = () => {
    runForceUpdate('charlie', { message: hi })
  }

  return (
    <div>
      <button onClick={onUpdate}>re-render receiver components</button>

      <button onClick={onAlphaUpdate}>
        re-render alpha receiver components
      </button>

      <button onClick={onAlphaBravoUpdate}>
        re-render alpha and bravo receiver components
      </button>

      <button onClick={onCharlieUpdate}>
        re-render charlie components with provided payload
      </button>
    </div>
  )
}
```

## Usage example

### Basic

```jsx
import { runForceUpdate, useForceUpdate } from 'react-forceupdate'

let nonReactive = {
  something: '',
}

let Alpha = () => {
  useForceUpdate() // re-render on runForceUpdate event.

  return <div> {nonReactive.something} </div>
}

let Bravo = () => {
  useForceUpdate() // re-render on runForceUpdate event.

  return <div> {nonReactive.something} </div>
}

function App() {
  let onUpdate = () => {
    // apply non-reactive changes.
    nonReactive.something = 'something updated'

    // force update those who uses useForceUpdate hook.
    runForceUpdate()
  }

  return (
    <main>
      <button onClick={onUpdate}>Force update</button>
      <DeeplyNestedComponentContainingAlpha />
      <DeeplyNestedComponentContainingBravo />
    </main>
  )
}
```

### With type or payload

```jsx
import { runForceUpdate, useForceUpdate } from 'react-forceupdate'

let Alpha = () => {
  let data = useForceUpdate('alpha') // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

let Bravo = () => {
  let data = useForceUpdate('bravo') // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

let AlphaBravo = () => {
  let data = useForceUpdate(['alpha', 'bravo']) // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

let CatchAll = () => {
  let data = useForceUpdate('*') // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

function App() {
  let onUpdateAlpha = () => {
    // force update those who uses useForceUpdate hook with given type.
    runForceUpdate('alpha', { message: 'hi' })
  }

  let onUpdateBravo = () => {
    // force update those who uses useForceUpdate hook with given type.
    runForceUpdate('bravo')
  }

  return (
    <main>
      <button onClick={onUpdateAlpha}>Force update alpha</button>
      <button onClick={onUpdateBravo}>Force update bravo</button>

      <DeeplyNestedComponentContainingAlpha />
      <DeeplyNestedComponentContainingBravo />
      <DeeplyNestedComponentContainingCatchAll />
    </main>
  )
}
```

## Demo

https://codesandbox.io/s/react-forceupdate-pioue?file=/src/App.js
