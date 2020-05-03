import React from 'react'
import mittt, { Emitter } from 'mittt'

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556

type UseForceUpdatePropsItem = string | undefined
export type UseForceUpdateProps =
  | UseForceUpdatePropsItem
  | Array<UseForceUpdatePropsItem>

type Input = string | undefined

export type RunForceUpdateType = Input | Array<Input>
export type RunForceUpdatePayload = any

export type UseForceUpdateState = {
  count: number
  eventType?: string
  key?: any
  payload?: any
}

let emitter: Emitter = mittt()

let getOnKeys = (eventType: UseForceUpdateProps): Array<string> => {
  let result = []

  function add(typeItem: Input) {
    if (!typeItem) result.push('event_default')
    else result.push('event_' + typeItem)
  }

  if (Array.isArray(eventType)) {
    eventType.forEach(typeItem => add(typeItem))
  } else add(eventType)

  return result
}

let getEmitKey = (eventType: Input): string => {
  if (!eventType) return 'event_default'

  return 'event_' + eventType
}

export function runForceUpdate(
  eventType?: RunForceUpdateType,
  payload?: RunForceUpdatePayload
) {
  if (typeof eventType === 'undefined' || typeof eventType === 'string') {
    emitter.emit(getEmitKey(eventType), payload)
  } else if (Array.isArray(eventType)) {
    eventType.forEach(type => emitter.emit(getEmitKey(type), payload))
  } else {
    // error
  }
}

export function useForceUpdate(eventType?: Input): UseForceUpdateState {
  let keys = React.useMemo(() => {
    return getOnKeys(eventType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [state, setState] = React.useState({ count: 0 })

  let updateFunctions = React.useMemo(() => {
    let functions = {}

    keys.forEach(key => {
      functions[key] = (eventType: any, payload?: any) => {
        updateState(setState, key, eventType, payload)
      }
    })

    return functions
  }, [keys])

  React.useEffect(() => {
    keys.forEach(key => {
      emitter.on(key, updateFunctions[key])
    })

    return () => {
      keys.forEach(key => {
        emitter.off(key, updateFunctions[key])
      })
    }
  })

  return state
}

function updateState(
  setState: React.Dispatch<React.SetStateAction<UseForceUpdateState>>,
  key: Input,
  eventType: any,
  payload?: any
) {
  // This triggers re-render
  setState(prevState => {
    let count = (prevState.count || 0) + 1
    let result: UseForceUpdateState = { eventType, payload, count, key }
    if (payload === undefined) delete result.payload

    return result
  })
}
