@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined, @username = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    $('#origin_'+@user_id).mousedown @downMypad
    $('#origin_'+@user_id).mousemove @moveMypad
    $('#origin_'+@user_id).mouseup @upMypad
    $('#clearBtn').click @clearMypad

    @dispatcher.bind 'action', @receiveAlert

  bindEvents: (number) ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'clear', @receiveClear

    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount

    i = 0
    while i <= 20
      $('#start_'+i).click @start
      $('#stop_'+i).click @stop
      i++

  downMypad: (e) =>
    @isDrawing = true
    @dispatcher.trigger 'down_location', 
      user_id: @user_id,
      x: e.clientX - @originOffset.left,
      y: e.clientY - @originOffset.top

  moveMypad: (e) =>
    if @isDrawing 
      @dispatcher.trigger 'move_location',       
        user_id: @user_id,
        x: e.clientX - @originOffset.left,
        y: e.clientY - @originOffset.top

  upMypad: (e) =>
    @isDrawing = false
    @dispatcher.trigger 'up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.trigger 'clear' , user_id: @user_id

  receiveDown: (message) =>
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })

  receiveMove: (message) =>
    CM('origin_'+message.user_id).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    return

  receiveClear: (message) => 
    CM('origin_'+message.user_id).clear();

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);

  receiveAlert: (data) ->
    #alert(data.message);

  start: (e) =>
    @dispatcher.trigger 'action' , user_id: 14, action: "start"

  stop: (e) =>
    @dispatcher.trigger 'action' , user_id: 14, action: "stop"


