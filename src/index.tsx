import React from 'react'
import mittt, { Emitter } from 'mittt'

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556

export type UseForceUpdateProps = string
type Input = string

export type RunForceUpdateEventType = Input
export type RunForceUpdatePayload = any

export type UseForceUpdateState = {
  eventCount: number
  subscribedEventType: string
  eventType?: string
  payload?: any
}

let emitter: Emitter = mittt()
let prefix = 'event_'

let getEmitKey = (eventType: Input): string => {
  if (!eventType) return prefix + 'default'

  return prefix + eventType
}

export function runForceUpdate(
  eventType?: RunForceUpdateEventType,
  payload?: RunForceUpdatePayload
) {
  emitter.emit(getEmitKey(eventType), payload)
}

export function useForceUpdate(
  subscribedEventType?: Input
): UseForceUpdateState {
  let key = subscribedEventType
    ? prefix + subscribedEventType
    : prefix + 'default'
  let [state, setState] = React.useState({ eventCount: 0, subscribedEventType })

  let fn = React.useMemo(() => {
    return (eventType: Input, payload: any) =>
      updateState(setState, subscribedEventType, eventType, payload)
  }, [])

  React.useEffect(() => {
    emitter.on(key, fn)

    return () => {
      emitter.off(key, fn)
    }
  })

  return state
}

function updateState(
  setState: React.Dispatch<React.SetStateAction<UseForceUpdateState>>,
  subscribedEventType: Input,
  eventType: string,
  payload?: any
) {
  // This triggers re-render
  setState(prevState => {
    let eventCount = (prevState.eventCount || 0) + 1
    let result: UseForceUpdateState = {
      eventType,
      payload,
      subscribedEventType,
      eventCount,
    }
    if (payload === undefined) delete result.payload

    return result
  })
}
