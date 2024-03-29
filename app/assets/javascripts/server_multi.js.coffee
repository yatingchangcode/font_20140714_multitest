@isDrawing = false


class @ChatApp

  constructor: (@user_id,@tv_id = undefined,@currentChannel = undefined) ->
    @dispatcher = io.connect("http://"+window.location.hostname+":5001?_rtUserId=" + @user_id)

  triggerEvents: ->
    #$('#yes_button').click @clearMypad
    $('#yes_button').click @right
    $('#no_button').click @wrong
    $('#clear_button').click @clearAll

  userOut: (uid) ->
    @dispatcher.emit 'userOut', user_id: uid

  clearAll: () ->
   @dispatcher.emit 'clearAll' 

  cancelSubmit: (uid) ->
    @dispatcher.emit 'cancelSubmit', user_id: uid

  clear: (uid) ->
    #如果要清空個別使用者時,送出user_id
    #清空全部的時候會送出空的object: {}
   @dispatcher.emit 'clear', user_id: uid 

  action: (uid,action) =>
    @dispatcher.emit 'action' , user_id: uid, action: action

  right: (uid) =>
    @dispatcher.emit 'right' , user_id: uid

  setGameInfo: (game_id, stage_name, v) => 
    @dispatcher.emit 'set_gameinfo_to_socket', game:game_id, stage: stage_name, visitors:v

  removeO: (uid) =>
    @dispatcher.emit 'removeO' , user_id: uid

  continue_write: (uid, has) ->
    @dispatcher.emit 'continue_write', user_id: uid, has_track: has

  is_connected: (uid) ->
    @dispatcher.emit 'is_connected', user_id: @user_id, check_id: uid

  reset: (s) =>
    if(s)
      @dispatcher.emit 'reset', second: s.second, stage: s.stage
    else
      @dispatcher.emit 'reset', {}

  setCorrectCount: (uid, count) ->
    @dispatcher.emit 'setCorrectCount', user_id: uid, count: count

  showCorrectUsers: (users) ->
    @dispatcher.emit 'showCorrectUsers', users

  bindEvents: ->
    @dispatcher.on 'down_location', @receiveDown
    @dispatcher.on 'move_location', @receiveMove
    @dispatcher.on 'up_location', @receiveUp
    @dispatcher.on 'submit', @receiveSubmit
    @dispatcher.on 'cancelSubmit', @receiveCancelSubmit
    @dispatcher.on 'clear', @receiveClear
    @dispatcher.on 'right', @receiveO
    @dispatcher.on 'removeO', @receiveRemoveO
    @dispatcher.on 'setCorrectCount', @receiveCorrectCount
    @dispatcher.on 'showCorrectUsers', @receiveCorrectUsers
    @dispatcher.on 'action', @receiveAction
    @dispatcher.on 'userOut', @receiveUserOut
    @dispatcher.on 'reset',   @receiveReset
    @dispatcher.on 'is_connected', @receiveIsConnected
    @dispatcher.on 'client_connected', @receiveClientConnected

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
