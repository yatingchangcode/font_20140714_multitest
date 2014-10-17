
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
    return

  receiveDown: (message) =>
    row = message.block.row
    col = message.block.column
    CR(row + '_' + col).point({ stamp: message.stamp, x: message.x, y: message.y }, writeToLog)
    return

  receiveMove: (message) =>
    row = message.block.row
    col = message.block.column
    CR(row + '_' + col).line({ stamp: message.stamp, x: message.x, y: message.y }, writeToLog)
    return

  receiveUp: (message) =>
    return

  receiveClear: (message) => 
    row = message.block.row
    col = message.block.column
    CR(row + '_' + col).clear(message.stamp)
    return

  receiveDisconnect: (message) =>
    return

  receiveAction: (message) ->
    currentUser = message.user_id
    if message.action is "device_start"
      CR(message.block.row+"_"+message.block.column).start message.stamp, startCallBack
    else if message.action is "device_stop"
      CR(message.block.row+"_"+message.block.column).stop message.stamp, stopCallBack(currentUser)
    return
