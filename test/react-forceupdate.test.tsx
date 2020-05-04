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
    expect(getNodeText(screen.getByTestId('eventcount1'))).toBe(
      `0`
    )
    expect(getNodeText(screen.getByTestId('subscribedto1'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('eventtype1'))).toBe(
      ``
    )
    expect(getNodeText(screen.getByTestId('payload1'))).toBe(
      ``
    )

    expect(getNodeText(screen.getByTestId('eventcount2'))).toBe(
      `0`
    )
    expect(getNodeText(screen.getByTestId('subscribedto2'))).toBe(
      `*`
    )
    expect(getNodeText(screen.getByTestId('eventtype2'))).toBe(
      ``
    )
    expect(getNodeText(screen.getByTestId('payload2'))).toBe(
      ``
    )

    // Act
    // Invoke event
    const senderButton = screen.getByTestId('sender-button')
    fireEvent.click(senderButton)

    // Assert
    // Receiver has received the event with payload
    expect(getNodeText(screen.getByTestId('eventcount1'))).toBe(
      `1`
    )
    expect(getNodeText(screen.getByTestId('subscribedto1'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('eventtype1'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('payload1'))).toBe(
      `hello1`
    )

    // Act
    // Invoke event
    fireEvent.click(senderButton)
    // Assert
    // Receiver has received the event with payload
    expect(getNodeText(screen.getByTestId('eventcount1'))).toBe(
      `2`
    )
    expect(getNodeText(screen.getByTestId('subscribedto1'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('eventtype1'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('payload1'))).toBe(
      `hello2`
    )

    expect(getNodeText(screen.getByTestId('eventcount2'))).toBe(
      `2`
    )
    expect(getNodeText(screen.getByTestId('subscribedto2'))).toBe(
      `*`
    )
    expect(getNodeText(screen.getByTestId('eventtype2'))).toBe(
      `alpha`
    )
    expect(getNodeText(screen.getByTestId('payload2'))).toBe(
      `hello2`
    )


  })
})
