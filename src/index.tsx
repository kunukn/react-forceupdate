import React from 'react'
import mittt, { Emitter } from 'mittt'

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556

export type UseForceUpdateProps = string
type Input = string | undefined

export type RunForceUpdateEventType = Input
export type RunForceUpdatePayload = any

export type UseForceUpdateState = {
  count: number
  subscribedEventType?: string
  eventType?: string
  payload?: any
}

let emitter: Emitter = mittt()

let getEmitKey = (eventType: Input): string => {
  if (!eventType) return 'event_default'

  return 'event_' + eventType
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
    ? 'event_' + subscribedEventType
    : 'event_default'
  let [state, setState] = React.useState({ count: 0 })

  let fn = (eventType: Input, payload: any) =>
    updateState(setState, subscribedEventType, eventType, payload)

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
    let count = (prevState.count || 0) + 1
    let result: UseForceUpdateState = {
      eventType,
      payload,
      subscribedEventType,
      count,
    }
    if (payload === undefined) delete result.payload

    return result
  })
}
