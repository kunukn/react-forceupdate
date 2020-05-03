import React from 'react'
import mitt from 'mitt'

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
  type?: string
  payload?: any
  key?: any
}

let emitter: mitt.Emitter = mitt()

let getOnKeys = (type: UseForceUpdateProps): Array<string> => {
  let result = []

  function add(typeItem: Input) {
    if (!typeItem) result.push('event_default')
    else result.push('event_' + typeItem)
  }

  if (Array.isArray(type)) {
    type.forEach(typeItem => {
      add(typeItem)
    })
  } else {
    add(type)
  }

  return result
}

let getEmitKey = (type: Input): string => {
  if (!type) return 'event_default'

  return 'event_' + type
}

let initialState: UseForceUpdateState = { count: 0 }

export function runForceUpdate(
  types?: RunForceUpdateType,
  payload?: RunForceUpdatePayload
) {
  if (typeof types === 'undefined' || typeof types === 'string') {
    emitter.emit(getEmitKey(types), payload)
  } else if (Array.isArray(types)) {
    types.forEach(type => {
      emitter.emit(getEmitKey(type), payload)
    })
  } else {
    // error
  }
}

export function useForceUpdate(type?: Input): UseForceUpdateState {
  const [state, setState] = React.useState(initialState)

  let keys = React.useMemo(() => {
    return getOnKeys(type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let updateFunctions = React.useMemo(() => {
    let functions = {}

    keys.forEach(key => {
      functions[key] = (mittType: any, mittEvt?: any) => {
        updateState(setState, key, mittType, mittEvt)
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
  mittType: any,
  mittEvt?: any
) {
  // Order of args in mitt depending on whether type is '*' or not.
  // Either it is (mittType, mittEvt) or (mittEvt).
  // https://github.com/developit/mitt/blob/master/src/index.js

  let type = mittEvt ? mittType : undefined
  let payload = mittEvt ? mittEvt : mittType

  // This triggers re-render
  setState(prevState => {
    let count = (prevState.count || 0) + 1
    let result: UseForceUpdateState = { type, payload, count, key }
    if (type === undefined) delete result.type
    if (payload === undefined) delete result.payload

    return result
  })
}
