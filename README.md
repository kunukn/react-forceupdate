# react-forceupdate

[![npm version](https://img.shields.io/npm/v/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![npm downloads](https://img.shields.io/npm/dm/react-forceupdate.svg?style=flat-square)](https://www.npmjs.com/package/react-forceupdate)
[![gzip](https://img.shields.io/bundlephobia/minzip/react-forceupdate.svg)](https://bundlephobia.com/result?p=react-forceupdate)
[![license](https://img.shields.io/github/license/kunukn/react-forceupdate)](https://github.com/kunukn/react-forceupdate/blob/master/LICENSE)

## About

React hooks for force updating components.
Force update from anywhere to those using a useForceUpdate hook with optional payload.

## Install

```bash
npm install mittt react-forceupdate

# or
# yarn add mittt react-forceupdate
```

## Usage example

### Basic

```jsx
import { runForceUpdate, useForceUpdate } from 'react-forceupdate'

let nonReactive = {
  something: 'waiting...',
}

let Component1 = () => {
  useForceUpdate()
  return <div> {nonReactive.something} </div>
}

let Component2 = () => {
  useForceUpdate()
  return <div> {nonReactive.something} </div>
}

function App() {
  let onUpdate = () => {
    // apply non-reactive changes.
    nonReactive.something = 'something updated'

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

### With eventType or payload

```jsx
import { runForceUpdate, useForceUpdate } from 'react-forceupdate'

let Alpha = () => {
  let { eventType, subscribedTo, payload } = useForceUpdate('alpha')
  return <div>Alpha: {payload && payload.message}</div>
}

let Bravo = () => {
  let { eventType, subscribedTo, payload } = useForceUpdate('bravo')
  return <div>Bravo: {payload && payload.message}</div>
}

let Star = () => {
  let { eventType, subscribedTo, payload } = useForceUpdate('*') // runs on any event type
  return <div>Star: {payload && payload.message}</div>
}

function App() {
  let onUpdateAlpha = () => {
    const payload = { message: 'hi' }
    runForceUpdate('alpha', payload)
  }

  let onUpdateBravo = () => {
    runForceUpdate('bravo')
  }

  return (
    <main>
      <button onClick={onUpdateAlpha}>Force update alpha</button>
      <button onClick={onUpdateBravo}>Force update bravo</button>

      <DeeplyNestedComponentContainingAlpha />
      <DeeplyNestedComponentContainingBravo />
      <DeeplyNestedComponentContainingStar />
    </main>
  )
}
```

## Demo

- https://codesandbox.io/s/react-forceupdate-library-vb2x2
- https://codesandbox.io/s/react-forceupdate-pioue

## API

### useForceUpdate

```jsx
import { useForceUpdate } from 'react-forceupdate'

function ReceiverComponent() {
  // re-render this component on 'default' event
  useForceUpdate() // same as useForceUpdate('default')

  // re-render this component on this event
  useForceUpdate('alpha')

  // re-render this component on this event with received payload
  let { payload } = useForceUpdate('bravo')

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
  let onBravoUpdate = () => {
    runForceUpdate('bravo', { message: 'hi' })
  }

  return (
    <div>
      <button onClick={onUpdate}>re-render receiver components</button>

      <button onClick={onAlphaUpdate}>
        re-render alpha receiver components
      </button>

      <button onClick={onBravoUpdate}>
        re-render bravo receiver components with provided payload
      </button>
    </div>
  )
}
```
