@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined, @username = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket")
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    $('#origin_'+@user_id).mousedown @downMypad
    $('#origin_'+@user_id).mousemove @moveMypad
    $('#origin_'+@user_id).mouseup @upMypad
    $('#clearBtn').click @clearMypad
    @dispatcher.trigger 'get_write_count'

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'clear', @receiveClear

    @dispatcher.trigger 'get_user_count'
    @dispatcher.bind 'get_user_count', @getUserCount
    @dispatcher.bind 'get_write_count', @getWriteCount


  downMypad: (e) =>
    @dispatcher.trigger 'down_location', 
      user_id: @user_id,
      x: e.clientX - @originOffset.left,
      y: e.clientY - @originOffset.top

  moveMypad: (e) =>
    @dispatcher.trigger 'move_location',       
      user_id: @user_id,
      x: e.clientX - @originOffset.left,
      y: e.clientY - @originOffset.top

  upMypad: (e) =>
    @dispatcher.trigger 'up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.trigger 'clear' , user_id: @user_id

  receiveDown: (message) =>
    @isDrawing = true
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })


  receiveMove: (message) =>
    if @isDrawing 
      CM('origin_'+message.user_id).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    @isDrawing = false

  receiveClear: (message) => 
    CM('origin_'+message.user_id).clear();

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);


