@isDrawing = false

class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    $('#origin_'+@user_id).mousedown @downMypad
    $('#origin_'+@user_id).mousemove @moveMypad
    $('#origin_'+@user_id).mouseup @upMypad
    $('#clearBtn').click @clearMypad
    $('#submitBtn').click @submitMypad

  bindEvents: ->
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'action', @receiveAction

  downMypad: (e) =>
    @isDrawing = true
    message = {
      user_id: @user_id,
      x: e.clientX - @originOffset.left, 
      y: e.clientY - @originOffset.top,
      stamp: (new Date()).getTime()
    }
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })
    @dispatcher.trigger 'down_location', message

  moveMypad: (e) =>
    if @isDrawing 
      message = {
        user_id: @user_id,
        x: e.clientX - @originOffset.left, 
        y: e.clientY - @originOffset.top,
        stamp: (new Date()).getTime()
      }
      CM('origin_'+message.user_id).line({ x: message.x, y: message.y })
      @dispatcher.trigger 'move_location', message

  upMypad: (e) =>
    @isDrawing = false
    @dispatcher.trigger 'up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.trigger 'clear' , user_id: @user_id
    CM('origin_'+ @user_id).clear();

  submitMypad: (e) =>
    @dispatcher.trigger 'action' , user_id: @user_id, action: "device_stop", stamp: (new Date()).getTime()
    @dispatcher.trigger 'submit' , user_id: @user_id

  receiveAction: (data) ->
    receiveActionHandler data
    return

  action: (e) =>
    uid = $(e.currentTarget).attr 'uid'
    action = $(e.currentTarget).attr 'action'
    @dispatcher.trigger 'action' , user_id: uid, action: action

  receiveClear: () =>
    #alert("clearAll")
    #@dispatcher.trigger 'clear' , user_id: @user_id
    CM('origin_'+ @user_id).clear();

