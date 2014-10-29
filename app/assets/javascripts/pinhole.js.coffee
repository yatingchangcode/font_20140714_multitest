
class @Pinhole

  constructor: (@user_id,@currentChannel = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @passBuffer = []

  triggerEvents: ->
    return

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'action', @receiveAction
    @dispatcher.bind 'reset', @receiveReset
    return

  receiveDown: (message) =>
    if(receiveDownHandler)
      receiveDownHandler message
    return

  receiveMove: (message) =>
    if(receiveMoveHandler)
      receiveMoveHandler message
    return

  receiveUp: (message) =>
    if(receiveUpHandler)
      receiveUpHandler message
    return

  receiveClear: (message) => 
    if(receiveClearHandler)
      receiveClearHandler message
    return

  receiveAction: (message) ->
    if message.action is "device_start"
      if(receiveDeviceStartHandler)
        receiveDeviceStartHandler message
    else if message.action is "device_stop"
      if(receiveDeviceStopHandler)
        receiveDeviceStopHandler message
    return

  receiveReset: (message) ->
    if(receiveResetHandler)
      receiveResetHandler message
    return
