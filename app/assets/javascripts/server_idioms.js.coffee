@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    #$('#clearBtn').click @clearMypad

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'move_block', @receiveMoveBlock
    @dispatcher.bind 'end_round', @receiveEndRound
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount

  receiveDown: (message) =>
    CM('origin_'+message.block).point({ x: message.x, y: message.y })

  receiveMove: (message) =>
    CM('origin_'+message.block).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    return

  receiveClear: (message) => 
    CM('origin_'+message.block).clear();

  receiveMoveBlock: (message) =>
    receiveMoveBlockHandler message

  receiveEndRound: (message) =>
    receiveEndRoundHandler message

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);

  action: (uid,action) =>
    @dispatcher.trigger 'action' , user_id: uid, action: action


