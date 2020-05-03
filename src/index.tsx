import React from 'react'
import mittt, { Emitter, EventHandlerMap } from 'mittt'

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

let emitterHandlerMap: EventHandlerMap = Object.create(null)
let emitter: Emitter = mittt(emitterHandlerMap)
let prefix = 'event_'

let getKey = (eventType: Input): string => {
  if (!eventType) return prefix + 'default'

  return prefix + eventType
}

export function runForceUpdate(
  eventType?: RunForceUpdateEventType,
  payload?: RunForceUpdatePayload
) {
  emitter.emit(getKey(eventType), payload)
}

export function useForceUpdate(
  subscribedEventType?: Input
): UseForceUpdateState {
  let key = getKey(subscribedEventType)
  let [state, setState] = React.useState({ eventCount: 0, subscribedEventType })

  /*
  let fn = React.useMemo(
    () => (eventType: Input, payload: any) =>
      updateState(setState, subscribedEventType, eventType, payload),
    []
  )
  */
  // React.useMemo not needed.
  let fn = (eventType: Input, payload: any) =>
    updateState(setState, subscribedEventType, eventType, payload)

  React.useEffect(() => {
    emitter.on(key, fn)
    // console.debug('on', emitterHandlerMap)
    return () => {
      emitter.off(key, fn)
      // console.debug('off', emitterHandlerMap)
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
