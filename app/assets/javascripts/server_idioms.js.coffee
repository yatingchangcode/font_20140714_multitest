@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @stage_name = "idioms"
    @dispatcher = new WebSocketRails(window.location.host + "/websocket?client_id=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    #$('#clearBtn').click @clearMypad

  bindEvents: ->
    @dispatcher.bind 'down_location', @receiveDown
    @dispatcher.bind 'move_location', @receiveMove
    @dispatcher.bind 'up_location', @receiveUp
    @dispatcher.bind 'submit', @receiveSubmit
    @dispatcher.bind 'move_block', @receiveMoveBlock
    @dispatcher.bind 'send_text', @receiveSendText
    @dispatcher.bind 'end_round', @receiveEndRound
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'action', @receiveAction

  receiveDown: (message) =>
    CM('origin_'+message.block.row+'_'+message.block.column).point({ x: message.x, y: message.y })

  receiveMove: (message) =>
    CM('origin_'+message.block.row+'_'+message.block.column).line({ x: message.x, y: message.y })

  receiveUp: (message) =>
    return

  receiveSubmit: (message) =>
    receiveSubmitHandler message

  receiveClear: (message) => 
    CM('origin_'+message.block.row+'_'+message.block.column).clear();

  receiveMoveBlock: (message) =>
    receiveMoveBlockHandler message

  receiveSendText: (message) => 
    receiveSendTextHandler message    

  receiveEndRound: (message) =>
    receiveEndRoundHandler message

  getUserCount: (data) ->
    $('#user_count').text(data.user_count);

  getWriteCount: (data) ->
    $('#write_count').text(data.write_count);

  action: (uid,action) =>
    @dispatcher.trigger @stage_name+'.action' , user_id: uid, action: action

  receiveAction: (message) =>
    name = message.action
    if name is "start"
      receiveStartHandler message
    else if name is "stop"
      receiveStopHandler message

  clear: (uid,block) ->
    #如果要清空個別使用者時,送出user_id
    #清空全部的時候會送出空的object: {}
    @dispatcher.trigger @stage_name+'.clear', user_id: uid , block: block
    
  reset: () =>
    @dispatcher.trigger @stage_name+'.reset', {}

  sendText: (text,block) =>
    @dispatcher.trigger @stage_name+'.send_text' ,  block: block, text: text



