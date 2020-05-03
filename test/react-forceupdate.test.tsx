// @________ts-nocheck
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
    const receiverPayload = screen.getByTestId('receiver-payload')
    expect(getNodeText(receiverPayload)).toBe(`{"count":0}`)

    // Act
    // Invoke event
    const senderButton = screen.getByTestId('sender-button')
    fireEvent.click(senderButton)

    // Assert
    // Receiver has received the event with payload
    expect(getNodeText(receiverPayload)).toBe(
      `{\"eventType\":\"event_alpha\",\"payload\":\"hello\",\"subscribedEventType\":\"alpha\",\"count\":1}`)
  })
})
