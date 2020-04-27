import React from 'react'
import * as ReactDOM from 'react-dom'
import { Default as App } from '../stories/ForceUpdate.stories'

describe('ForceUpdate', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})
