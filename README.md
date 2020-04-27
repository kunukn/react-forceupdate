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
  let onForceUpdate = () => {
    // apply non-reactive changes.
    nonReactive.something = 'something updated'

    // force update those who uses useForceUpdate hook.
    runForceUpdate()
  }

  return (
    <main>
      <button onClick={onForceUpdate}>Force update</button>
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

let AlphaOrBravo = () => {
  let data = useForceUpdate(['alpha', 'bravo']) // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

let CatchAll = () => {
  let data = useForceUpdate('*') // re-render on runForceUpdate event.

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

function App() {
  let onForceUpdateAlpha = () => {
    // force update those who uses useForceUpdate hook with given type.
    runForceUpdate({ type: 'alpha', payload: 'hi' })
  }

  let onForceUpdateBravo = () => {
    // force update those who uses useForceUpdate hook with given type.
    runForceUpdate('bravo')
  }

  return (
    <main>
      <button onClick={onForceUpdateAlpha}>Force update alpha</button>
      <button onClick={onForceUpdateBravo}>Force update bravo</button>

      <DeeplyNestedComponentContainingAlpha />
      <DeeplyNestedComponentContainingBravo />
      <DeeplyNestedComponentContainingAlphaBravoDefault />
      <DeeplyNestedComponentContainingCatchAll />
    </main>
  )
}
```

## Demo

https://codesandbox.io/s/react-forceupdate-pioue?file=/src/App.js
