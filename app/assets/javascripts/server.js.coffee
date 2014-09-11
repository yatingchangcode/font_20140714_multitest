@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined, @username = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    #$('#clearBtn').click @clearMypad

  bindEvents: (number) ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'submit', @receiveSubmit
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount

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

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);

  action: (uid,action) =>
    @dispatcher.trigger 'action' , user_id: uid, action: action


