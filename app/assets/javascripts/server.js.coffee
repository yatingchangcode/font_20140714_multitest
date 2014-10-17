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

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'submit', @receiveSubmit
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount
    @dispatcher.bind 'right', @receiveRight
    @dispatcher.bind 'wrong', @receiveWrong

  receiveDown: (message) =>
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })

  receiveMove: (message) =>
    CM('origin_'+message.user_id).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    return

  receiveClear: (message) => 
    CM('origin_'+message.user_id).clear();

  receiveSubmit: (message) =>
    receiveSubmitHandler message

  clearAll: () ->
   @dispatcher.trigger 'clearAll' 

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);

  action: (uid,action) =>
    @dispatcher.trigger 'action' , user_id: uid, action: action

  right: (uid) =>
    @dispatcher.trigger 'right' , user_id: uid

  reset: () =>
    @dispatcher.trigger 'reset'

  wrong: (uid) =>
    @dispatcher.trigger 'wrong' , user_id: uid

  receiveRight: (message) => 
    yesImg = $("#yes_" + message.user_id)
    yesImg.show()
    setTimeout ((item) ->
      f = ->
        item.hide()
        return

      f
    )(yesImg), 3000

  receiveWrong: (message) => 
    yesImg = $("#no_" + message.user_id)
    yesImg.show()
    setTimeout ((item) ->
      f = ->
        item.hide()
        return

      f
    )(yesImg), 3000


