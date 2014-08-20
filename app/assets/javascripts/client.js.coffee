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

  bindEvents: (number) ->
    #@dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'action', @receiveAlert

  downMypad: (e) =>
    @isDrawing = true
    message = {
      user_id: @user_id,
      x: e.clientX - @originOffset.left, 
      y: e.clientY - @originOffset.top
    }
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })
    @dispatcher.trigger 'down_location', message

  moveMypad: (e) =>
    if @isDrawing 
      message = {
        user_id: @user_id,
        x: e.clientX - @originOffset.left, 
        y: e.clientY - @originOffset.top
      }
      CM('origin_'+message.user_id).line({ x: message.x, y: message.y })
      @dispatcher.trigger 'move_location', message

  upMypad: (e) =>
    @isDrawing = false
    @dispatcher.trigger 'up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.trigger 'clear' , user_id: @user_id
    CM('origin_'+message.user_id).clear();

  receiveAlert: (data) ->
    alert(data);

  action: (e) =>
    uid = $(e.currentTarget).attr 'uid'
    action = $(e.currentTarget).attr 'action'
    @dispatcher.trigger 'action' , user_id: uid, action: action


