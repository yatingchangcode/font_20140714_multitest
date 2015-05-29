@isDrawing = false


class @ChatApp

  constructor: (@user_id,@tv_id = undefined,@currentChannel = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id + "&tv_id=" + @tv_id)

  triggerEvents: ->
    #$('#yes_button').click @clearMypad
    $('#yes_button').click @right
    $('#no_button').click @wrong
    $('#clear_button').click @clearAll

  userOut: (uid) ->
    @dispatcher.trigger 'userOut', user_id: uid

  clearAll: () ->
   @dispatcher.trigger 'clearAll' 

  cancelSubmit: (uid) ->
    @dispatcher.trigger 'cancelSubmit', user_id: uid

  clear: (uid) ->
    #如果要清空個別使用者時,送出user_id
    #清空全部的時候會送出空的object: {}
   @dispatcher.trigger 'clear', user_id: uid 

  action: (uid,action) =>
    @dispatcher.trigger 'action' , user_id: uid, action: action

  right: (uid) =>
    @dispatcher.trigger 'right' , user_id: uid

  setGameInfo: (game_id, stage_name, v) => 
    @dispatcher.trigger 'set_gameinfo_to_socket', game:game_id, stage: stage_name, visitors:v

  removeO: (uid) =>
    @dispatcher.trigger 'removeO' , user_id: uid

  continue_write: (uid, has) ->
    @dispatcher.trigger 'continue_write', user_id: uid, has_track: has

  is_connected: (uid) ->
    @dispatcher.trigger 'is_connected', user_id: @user_id, check_id: uid

  reset: (s) =>
    if(s)
      @dispatcher.trigger 'reset', second: s.second, stage: s.stage
    else
      @dispatcher.trigger 'reset', {}

  setCorrectCount: (uid, count) ->
    @dispatcher.trigger 'setCorrectCount', user_id: uid, count: count

  showCorrectUsers: (users) ->
    @dispatcher.trigger 'showCorrectUsers', users

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'submit', @receiveSubmit
    @dispatcher.bind 'cancelSubmit', @receiveCancelSubmit
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'right', @receiveO
    @dispatcher.bind 'removeO', @receiveRemoveO
    @dispatcher.bind 'setCorrectCount', @receiveCorrectCount
    @dispatcher.bind 'showCorrectUsers', @receiveCorrectUsers
    @dispatcher.bind 'action', @receiveAction
    @dispatcher.bind 'userOut', @receiveUserOut
    @dispatcher.bind 'reset',   @receiveReset
    @dispatcher.bind 'is_connected', @receiveIsConnected
    @dispatcher.bind 'client_connected', @receiveClientConnected

  receiveDown: (message) =>
    if(receiveDownHandler)
      receiveDownHandler message
    return

  receiveMove: (message) =>
    if(receiveMoveHandler)
      receiveMoveHandler message
    return

  receiveUp: (message) =>
    return

  receiveSubmit: (message) =>
    if(receiveSubmitHandler)
      receiveSubmitHandler message
    return

  receiveCancelSubmit: (message) =>
    if(receiveCancelSubmitHandler)
      receiveCancelSubmitHandler message
    return

  receiveClear: (message) =>
    if(receiveClearHandler)
      receiveClearHandler message
    return

  receiveO: (message) => 
    if(receiveOHandler)
      receiveOHandler message
    return

  receiveRemoveO: (message) =>
    if(receiveRemoveOHandler)
      receiveRemoveOHandler message
    return

  receiveCorrectCount: (message) ->
    if(receiveCorrectCountHandler)
      receiveCorrectCountHandler message
    return

  receiveCorrectUsers: (users) ->
    if(receiveCorrectUsersHandler)
      receiveCorrectUsersHandler users
    return
  
  receiveAction: (message) =>
    name = message.action
    if name is "start"
      if(receiveStartHandler)
        receiveStartHandler message
      return
    else if name is "stop"
      if(receiveStopHandler)
        receiveStopHandler message
      return

  receiveUserOut: (message) =>
    if(receiveUserOutHandler)
      receiveUserOutHandler message
    return

  receiveReset: (message) =>
    if(receiveResetHandler)
      receiveResetHandler message
    return

  receiveIsConnected: (message) =>
    if(receiveIsConnectedHandler)
      receiveIsConnectedHandler message
    return

  receiveClientConnected: (message) =>
    if(receiveChangeConnectionStatusHandler)
      receiveChangeConnectionStatusHandler message
    return
