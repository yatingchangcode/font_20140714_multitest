@isDrawing = false

class @ChatApp

  constructor: (@left ,@top, @user_id,@block = undefiend, @currentChannel = undefined) ->
    @stage_name = "idioms"
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    $('#origin_'+@user_id).mousedown @downMypad
    $('#origin_'+@user_id).mousemove @moveMypad
    $('#origin_'+@user_id).mouseup @upMypad
    $('#clearBtn').click @clearMypad
    $('#submitBtn').click @submitMypad

  bindEvents: ->
    #@dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'action', @receiveAction

  downMypad: (e) =>
    @isDrawing = true
    message = {
      user_id: @user_id,
      x: e.clientX - @originOffset.left, 
      y: e.clientY - @originOffset.top,
      block: @block,
      stamp: (new Date()).getTime()
    }
    CM('origin_'+message.user_id).point({ x: message.x, y: message.y })
    @dispatcher.trigger @stage_name+'.down_location', message

  moveMypad: (e) =>
    if @isDrawing 
      message = {
        user_id: @user_id,
        x: e.clientX - @originOffset.left, 
        y: e.clientY - @originOffset.top,
        block: @block,
        stamp: (new Date()).getTime()
      }
      CM('origin_'+message.user_id).line({ x: message.x, y: message.y })
      @dispatcher.trigger @stage_name+'.move_location', message

  upMypad: (e) =>
    @isDrawing = false
    @dispatcher.trigger @stage_name+'.up_location' , user_id: @user_id

  clearMypad: (e) =>
    @dispatcher.trigger @stage_name+'.clear' , user_id: @user_id,block: @block
    CM('origin_'+ @user_id).clear();

  submitMypad: (e) =>
    @dispatcher.trigger @stage_name+'.action' , user_id: @user_id, action: "device_stop", stamp: (new Date()).getTime()
    @dispatcher.trigger @stage_name+'.submit' , user_id: @user_id,block: @block

  moveBlock: (block) =>
    @block = block
    @dispatcher.trigger @stage_name+'.move_block' , user_id: @user_id,block: @block

  endRound: =>
    @dispatcher.trigger @stage_name+'.end_round' , user_id: @user_id,blocks: [@block]

  receiveAction: (data) ->
    receiveActionHandler data
    return

  action: (e) =>
    uid = $(e.currentTarget).attr 'uid'
    action = $(e.currentTarget).attr 'action'
    @dispatcher.trigger 'action' , user_id: uid, action: action


