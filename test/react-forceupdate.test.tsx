// __@ts-nocheck
/* eslint-disable */
import React from 'react'
import * as ReactDOM from 'react-dom'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, getNodeText } from '@testing-library/react'
// import { renderHook, act } from '@testing-library/react-hooks'
import { SenderReceiver } from '../stories/react-forceupdate.stories'

describe('ForceUpdate', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<SenderReceiver />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('can forceupdate a component with payload', () => {
    render(<SenderReceiver />)

    // arrange
    // first the payload has not been received yet.
    let id = "default"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `0`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      ``
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      ``
    )

    id = "*"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `0`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `*`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      ``
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      ``
    )

    // Act
    // Invoke event
    const senderButton = screen.getByTestId('sender-button')
    fireEvent.click(senderButton)

    // Assert
    // Receiver has received the event with payload
    id = "default"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `1`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      `hello1`
    )

    // Act
    // Invoke event
    fireEvent.click(senderButton)
    // Assert
    // Receiver has received the event with payload
    id = "default"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `2`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      `hello2`
    )

    id = "*"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `2`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `*`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      `default`
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      `hello2`
    )

    id = "alpha"
    expect(getNodeText(screen.getByTestId(id + 'eventcount'))).toBe(
      `0`
    )
    expect(getNodeText(screen.getByTestId(id + 'subscribedto'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId(id + 'eventtype'))).toBe(
      ``
    )
    expect(getNodeText(screen.getByTestId(id + 'payload'))).toBe(
      ``
    )
  })
})
