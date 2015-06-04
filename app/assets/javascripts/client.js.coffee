@isDrawing = false

class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @dispatcher = io.connect("http://127.0.0.1:5001?_rtUserId=" + @user_id)

    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    $('#origin_'+@user_id).mousedown @downMypad
    $('#origin_'+@user_id).mousemove @moveMypad
    $('#origin_'+@user_id).mouseup @upMypad
    $('#clearBtn').click @clearMypad
    $('#submitBtn').click @submitMypad

  bindEvents: ->
    @dispatcher.on 'clear', @receiveClear
    @dispatcher.on 'action', @receiveAction
    @dispatcher.on 'reset', @receiveReset
    @dispatcher.on 'continue_write', @receiveContinue

  downMypad: (e) =>
    @isDrawing = true
    message = {
      user_id: @user_id,
      x: e.clientX - @originOffset.left,
      y: e.clientY - @originOffset.top,
      stamp: (new Date()).getTime()
    }
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })
    @dispatcher.emit 'down_location', message

  moveMypad: (e) =>
    if @isDrawing
      message = {
        user_id: @user_id,
        x: e.clientX - @originOffset.left,
        y: e.clientY - @originOffset.top,
        stamp: (new Date()).getTime()
      }
      CM('origin_'+message.user_id).line({ x: message.x, y: message.y })
      @dispatcher.emit 'move_location', message

  upMypad: (e) =>
    @isDrawing = false
    @dispatcher.emit 'up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.emit 'clear' , user_id: @user_id, stamp: (new Date()).getTime()
    CM('origin_'+ @user_id).clear();

  submitMypad: (e) =>
    @dispatcher.emit 'action' , user_id: @user_id, action: "device_stop", stamp: (new Date()).getTime()
    @dispatcher.emit 'submit' , user_id: @user_id

  receiveAction: (data) ->
    receiveActionHandler data
    return

  action: (e) =>
    uid = $(e.currentTarget).attr 'uid'
    action = $(e.currentTarget).attr 'action'
    @dispatcher.emit 'action' , user_id: uid, action: action

  receiveClear: () =>
    CM('origin_'+ @user_id).clear();

  receiveContinue: (message) =>
    if(receiveContinueWriteHandler)
      receiveContinueWriteHandler message

  receiveReset: () =>
    CM('origin_'+ @user_id).clear();
    url = "http://0.0.0.0:3000/games/get_game_data.json?id=" + @user_id;
    $.getJSON url, (data) ->
        window.seconds=data['second']
        return
    window.resetAlarm()

