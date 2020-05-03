# react-forceupdate

[![npm version](https://img.shields.io/npm/v/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![npm downloads](https://img.shields.io/npm/dm/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![gzip](https://img.shields.io/bundlephobia/minzip/react-forceupdate.svg)](https://bundlephobia.com/result?p=react-forceupdate)
[![license](https://img.shields.io/github/license/kunukn/react-forceupdate)](https://github.com/kunukn/react-forceupdate/blob/master/LICENSE)

## About

React hooks for force updating components.
Force update from anywhere to those using a useForceUpdate hook.

## Install

```bash
npm install react-forceupdate

# or
# yarn add react-forceupdate
```

## API

### useForceUpdate

```jsx
import { useForceUpdate } from 'react-forceupdate'

function ReceiverComponent() {
  // re-render this component on run event
  useForceUpdate() // same as useForceUpdate('default')

  // re-render this component on run alpha event
  useForceUpdate('alpha')

  // re-render this component on either bravo or charlie run event
  useForceUpdate(['bravo', 'charlie'])

  // re-render this component on delta run event with receive payload
  let { payload } = useForceUpdate('delta')

  return <div>component {payload.message}</div>
}
```

### runForceUpdate

```jsx
import { runForceUpdate } from 'react-forceupdate'

function SenderComponent() {
  let onUpdate = () => {
    runForceUpdate() // same as runForceUpdate('default')
  }
  let onAlphaUpdate = () => {
    runForceUpdate('alpha')
  }
  let onABravoCharlieUpdate = () => {
    runForceUpdate(['bravo', 'charlie'])
  }
  let onDeltaUpdate = () => {
    runForceUpdate('delta', { message: 'hi' })
  }
  let onEchoFoxtrotUpdate = () => {
    runForceUpdate(['echo', 'foxtrot'], { message: 'hello' })
  }

  return (
    <div>
      <button onClick={onUpdate}>re-render receiver components</button>

      <button onClick={onAlphaUpdate}>
        re-render alpha receiver components
      </button>

      <button onClick={onABravoCharlieUpdate}>
        re-render bravo and charlie receiver components
      </button>

      <button onClick={onDeltaUpdate}>
        re-render delta receiver components with provided payload
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

let Component1 = () => {
  useForceUpdate() // re-render on runForceUpdate event.

  return <div> {nonReactive.something} </div>
}

let Component2 = () => {
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
      <DeeplyNestedComponentContainingComponent1 />
      <DeeplyNestedComponentContainingComponent2 />
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
    </main>
  )
}
```

## Demo

https://codesandbox.io/s/react-forceupdate-pioue?file=/src/App.js
