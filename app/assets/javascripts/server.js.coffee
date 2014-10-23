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
    @dispatcher.trigger 'reset', second: s

  setCorrectCount: (uid, count) ->
    @dispatcher.trigger 'setCorrectCount', user_id: uid, count: count

  showCorrectUsers: (users) ->
    @dispatcher.trigger 'showCorrectUsers', users

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'submit', @receiveSubmit
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'right', @receiveO
    @dispatcher.bind 'removeO', @receiveRemoveO
    @dispatcher.bind 'setCorrectCount', @receiveCorrectCount
    @dispatcher.bind 'showCorrectUsers', @receiveCorrectUsers
    @dispatcher.bind 'action', @receiveAction
    @dispatcher.bind 'userOut', @receiveUserOut
    @dispatcher.bind 'reset',   @receiveReset

  receiveDown: (message) =>
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })

  receiveMove: (message) =>
    CM('origin_'+message.user_id).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    return

  receiveSubmit: (message) =>
    receiveSubmitHandler message

  receiveClear: (message) => 
    receiveClearHandler message

  receiveO: (message) => 
    receiveOHandler message

  receiveRemoveO: (message) =>
    receiveRemoveOHandler message

  receiveCorrectCount: (message) ->
    receiveCorrectCountHandler message

  receiveCorrectUsers: (users) ->
    receiveCorrectUsersHandler users
  
  receiveAction: (message) =>
    name = message.action
    if name is "start"
      receiveStartHandler message
    else if name is "stop"
      receiveStopHandler message

  receiveUserOut: (message) =>
    receiveUserOutHandler message

  receiveReset: (message) =>
    receiveResetHandler message


