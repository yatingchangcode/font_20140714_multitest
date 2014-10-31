@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

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

  removeO: (uid) =>
    @dispatcher.trigger 'removeO' , user_id: uid

  continue_write: (uid) ->
    @dispatcher.trigger 'continue_write', user_id: uid

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

  receiveDown: (message) =>
    if(receiveDownHandler && tvwall.receiveDownHandler)
      receiveDownHandler message
      tvwall.receiveDownHandler message
    return

  receiveMove: (message) =>
    if(receiveMoveHandler && tvwall.receiveMoveHandler)
      receiveMoveHandler message
      tvwall.receiveMoveHandler message
    return

  receiveUp: (message) =>
    return

  receiveSubmit: (message) =>
    receiveSubmitHandler message
    if(receiveSubmitHandler && tvwall.receiveSubmitHandler)
      receiveSubmitHandler message
      tvwall.receiveSubmitHandler message
    return

  receiveCancelSubmit: (message) =>
    if(receiveCancelSubmitHandler && tvwall.receiveCancelSubmitHandler)
      receiveCancelSubmitHandler message
      tvwall.receiveCancelSubmitHandler message
    return

  receiveClear: (message) =>
    if(receiveClearHandler && tvwall.receiveClearHandler)
      receiveClearHandler message
      tvwall.receiveClearHandler message
    return

  receiveO: (message) => 
    if(receiveOHandler && tvwall.receiveOHandler)
      receiveOHandler message
      tvwall.receiveOHandler message
    return

  receiveRemoveO: (message) =>
    if(receiveRemoveOHandler && tvwall.receiveRemoveOHandler)
      receiveRemoveOHandler message
      tvwall.receiveRemoveOHandler message
    return

  receiveCorrectCount: (message) ->
    if(receiveCorrectCountHandler && tvwall.receiveCorrectCountHandler)
      receiveCorrectCountHandler message
      tvwall.receiveCorrectCountHandler message
    return

  receiveCorrectUsers: (users) ->
    if(receiveCorrectUsersHandler && tvwall.receiveCorrectUsersHandler)
      receiveCorrectUsersHandler users
      tvwall.receiveCorrectUsersHandler users
    return
  
  receiveAction: (message) =>
    name = message.action
    if name is "start"
      if(receiveStartHandler && tvwall.receiveStartHandler)
        receiveStartHandler message
        tvwall.receiveStartHandler message
      return
    else if name is "stop"
      if(receiveStopHandler && tvwall.receiveStopHandler)
        receiveStopHandler message
        tvwall.receiveStopHandler message
      return

  receiveUserOut: (message) =>
    if(receiveUserOutHandler && tvwall.receiveUserOutHandler)
      receiveUserOutHandler message
      tvwall.receiveUserOutHandler message
    return

  receiveReset: (message) =>
    if(receiveResetHandler && tvwall.receiveResetHandler)
      receiveResetHandler message
      tvwall.receiveResetHandler message
    return



