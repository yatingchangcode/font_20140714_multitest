@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @stage_name = "B2"
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
    @dispatcher.bind 'rewrite', @receiveRewrite
    @dispatcher.bind 'clear', @receiveClear
    @dispatcher.bind 'clearAll', @receiveClearAll
    @dispatcher.bind 'action', @receiveAction
    @dispatcher.bind 'is_connected', @receiveIsConnected
    @dispatcher.bind 'save_record', @receiveSaveRecord
    @dispatcher.bind 'right',       @receiveO
    @dispatcher.bind 'remove_o', @receiveRemoveO
    @dispatcher.bind 'showCorrectUsers', @receiveCorrectUsers
    @dispatcher.bind 'setCorrectCount', @receiveCorrectCount

  continue_write: (uid) ->
    @dispatcher.trigger 'continue_write', user_id: uid

  receiveDown: (message) =>
    if(receiveDownHandler && tvwall.receiveDownHandler)
      receiveDownHandler message
      tvwall.receiveDownHandler message
    return

  receiveMove: (message) =>
    if(receiveMoveHandler && tvwall.receiveMoveHandler)
      receiveMoveHandler message
      tvwall.receiveMoveHandler message
    return

  receiveUp: (message) =>
    return

  receiveO: (message) => 
    if(receiveOHandler)
      receiveOHandler message
    if(tvwall.window && tvwall.receiveOHandler)
      tvwall.receiveOHandler message
    return

  removeO: (uid, block) =>
    @dispatcher.trigger @stage_name + '.remove_o' , user_id: uid, block: block

  receiveRemoveO: (message) =>
    if(receiveRemoveOHandler)
      receiveRemoveOHandler message
    if(tvwall.window && tvwall.receiveRemoveOHandler)
      tvwall.receiveRemoveOHandler message
    return

  receiveCorrectCount: (message) ->
    if(receiveCorrectCountHandler)
      receiveCorrectCountHandler message
    if(tvwall.window && tvwall.receiveCorrectCountHandler)
      tvwall.receiveCorrectCountHandler message
    return

  receiveCorrectUsers: (users) ->
    if(receiveCorrectUsersHandler)
      receiveCorrectUsersHandler users
    if(tvwall.window && tvwall.receiveCorrectUsersHandler)
      tvwall.receiveCorrectUsersHandler users
    return
  

  receiveSubmit: (message) =>
    if(receiveSubmitHandler && tvwall.receiveSubmitHandler)
      receiveSubmitHandler message
      tvwall.receiveSubmitHandler message
    return

  receiveClear: (message) => 
    if(receiveClearHandler && tvwall.receiveClearHandler)
      receiveClearHandler message
      tvwall.receiveClearHandler message
    return

  receiveClearAll: (message) => 
    if(receiveClearAllHandler && tvwall.receiveClearAllHandler)
      receiveClearAllHandler message
      tvwall.receiveClearAllHandler message
    return

  receiveMoveBlock: (message) =>
    if(receiveMoveBlockHandler && tvwall.receiveMoveBlockHandler)
      receiveMoveBlockHandler message
      tvwall.receiveMoveBlockHandler message
    return

  receiveSendText: (message) => 
    if(receiveSendTextHandler && tvwall.receiveSendTextHandler)
      receiveSendTextHandler message
      tvwall.receiveSendTextHandler message 
    return

  receiveEndRound: (message) =>
    if(receiveEndRoundHandler && tvwall.receiveEndRoundHandler)
      receiveEndRoundHandler message
      tvwall.receiveEndRoundHandler message
    return

  receiveAction: (message) =>
    name = message.action
    if name is "start"
      if(receiveStartHandler && tvwall.receiveStartHandler)
        receiveStartHandler message
        tvwall.receiveStartHandler message
      return
    else if name is "stop"
      if(receiveStopHandler && tvwall.receiveStopHandler)
        receiveStopHandler message
        tvwall.receiveStopHandler message
      return

  receiveRewrite: (message) =>
    if(receiveRewriteHandler && tvwall.receiveRewriteHandler)
      receiveRewriteHandler message
      tvwall.receiveRewriteHandler message
    return

  receiveSaveRecord: (message) =>
    if(receiveSaveRecordHandler)
      receiveSaveRecordHandler message
    return

  receiveIsConnected: (message) =>
    receiveIsConnectedHandler message
    return

  action: (uid,action) =>
    @dispatcher.trigger @stage_name+'.action' , user_id: uid, action: action

  right: (uid, block) =>
    @dispatcher.trigger @stage_name+'.right' , user_id: uid, block: block

  setCorrectCount: (uid, block, count) ->
    @dispatcher.trigger @stage_name+'.setCorrectCount', user_id: uid, block: block, count: count

  showCorrectUsers: (users) ->
    @dispatcher.trigger 'showCorrectUsers', users

  clear: (uid, block) ->
    #如果要清空個別使用者時,送出user_id
    #清空全部的時候會送出空的object: {}
    @dispatcher.trigger @stage_name+'.clear', user_id: uid , block: block

  clearAll: () ->
    @dispatcher.trigger @stage_name+'.clearAll' 
    
  is_connected: (uid) ->
    @dispatcher.trigger 'is_connected', user_id: @user_id, check_id: uid

  reset: (o) =>
    if(o)
      @dispatcher.trigger @stage_name+'.reset', second:o.second, stage:o.stage
    else
      @dispatcher.trigger @stage_name+'.reset', {}

  sendText: (text,block) =>
    @dispatcher.trigger @stage_name+'.send_text' ,  block: block, text: text

  rewrite: (ink, block) =>
    @dispatcher.trigger @stage_name+'.rewrite' ,  block: block, ink: ink

  saveRecord: (isSave) ->
    @dispatcher.trigger 'save_record', { is_saved: isSave }


