
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
    @dispatcher.bind 'connection_closed', @receiveDisconnect
    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount
    return

  receiveDown: (message) =>
    CR(message.user_id).point({ stamp: message.stamp, x: message.x, y: message.y }, writeToLog)
    return

  receiveMove: (message) =>
    CR(message.user_id).line({ stamp: message.stamp, x: message.x, y: message.y }, writeToLog)
    return

  receiveUp: (message) =>
    return

  receiveClear: (message) => 
    CR(message.user_id).clear(message.stamp)
    return

  receiveDisconnect: (message) =>
    return

  getUserCount: (data) ->
    return

  getWriteCount: (data) ->
    return

  receiveAction: (message) ->
    currentUser = message.user_id
    if message.action is "device_start"
      CR(currentUser).start message.stamp, startCallBack
    else if message.action is "device_stop"
      CR(currentUser).stop message.stamp, stopCallBack(currentUser)
    return