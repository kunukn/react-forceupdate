import React from 'react'
import mitt from 'mitt'

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556

type UseForceUpdatePropsItem = string | undefined
export type UseForceUpdateProps =
  | UseForceUpdatePropsItem
  | Array<UseForceUpdatePropsItem>

type Input = string | undefined | '*'
type RunForceUpdatePropsItem = {
  type?: Input
  payload?: any
}
export type RunForceUpdateProps = Input | RunForceUpdatePropsItem

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
    if (typeof typeItem === 'undefined') result.push('update_default')
    else if (typeItem === '*') result.push('*')
    else result.push('update_' + typeItem)
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
  if (typeof type === 'undefined') return 'update_default'

  return 'update_' + type
}

let initialState: UseForceUpdateState = { count: 0 }

export function runForceUpdate(props?: RunForceUpdateProps) {
  if (typeof props === 'undefined' || typeof props === 'string') {
    emitter.emit(getEmitKey(props as Input))
  } else {
    let typedProps: RunForceUpdatePropsItem = props
    let payload = typedProps?.payload

    typeof payload === 'undefined'
      ? emitter.emit(getEmitKey(typedProps.type))
      : emitter.emit(getEmitKey(typedProps.type), payload)
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

  if (key === '*' && !type) {
    // Special thing with mitt and '*' usage. Workaround that.
    type = payload
    payload = undefined
  }

  // This triggers re-render
  setState(prevState => {
    let count = (prevState.count || 0) + 1
    let result: UseForceUpdateState = { type, payload, count, key }
    if (type === undefined) delete result.type
    if (payload === undefined) delete result.payload

    return result
  })
}
