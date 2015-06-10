@isDrawing = false


class @ChatApp

  constructor: (@left ,@top, @user_id,@currentChannel = undefined) ->
    @stage_name = "b2"
    @dispatcher = io.connect("http://127.0.0.1:5001?_rtUserId=" + @user_id)
    @originOffset = {left: @left, top: @top}

  triggerEvents: ->
    #$('#clearBtn').click @clearMypad

  bindEvents: ->
    @dispatcher.on 'down_location', @receiveDown
    @dispatcher.on 'move_location', @receiveMove
    @dispatcher.on 'up_location', @receiveUp
    @dispatcher.on 'submit', @receiveSubmit
    @dispatcher.on 'move_block', @receiveMoveBlock
    @dispatcher.on 'send_text', @receiveSendText
    @dispatcher.on 'end_round', @receiveEndRound
    @dispatcher.on 'rewrite', @receiveRewrite
    @dispatcher.on 'clear', @receiveClear
    @dispatcher.on 'clearAll', @receiveClearAll
    @dispatcher.on 'action', @receiveAction
    @dispatcher.on 'is_connected', @receiveIsConnected
    @dispatcher.on 'right',       @receiveO
    @dispatcher.on 'remove_o', @receiveRemoveO
    @dispatcher.on 'showCorrectUsers', @receiveCorrectUsers
    @dispatcher.on 'setCorrectCount', @receiveCorrectCount

  continue_write: (uid) ->
    @dispatcher.emit 'continue_write', user_id: uid

  setGameInfo: (game_id, stage_name, v) =>
    @dispatcher.emit @stage_name + '.set_gameinfo_to_socket', game:game_id, stage: stage_name, visitors:v

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
    @dispatcher.emit @stage_name + '.remove_o' , user_id: uid, block: block

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

  receiveIsConnected: (message) =>
    receiveIsConnectedHandler message
    return

  action: (uid,action) =>
    @dispatcher.emit @stage_name+'.action' , user_id: uid, action: action

  right: (uid, block) =>
    @dispatcher.emit @stage_name+'.right' , user_id: uid, block: block

  setCorrectCount: (uid, block, count) ->
    @dispatcher.emit @stage_name+'.setCorrectCount', user_id: uid, block: block, count: count

  showCorrectUsers: (users) ->
    @dispatcher.emit 'showCorrectUsers', users

  clear: (uid, block) ->
    #如果要清空個別使用者時,送出user_id
    #清空全部的時候會送出空的object: {}
    @dispatcher.emit @stage_name+'.clear', user_id: uid , block: block

  clearAll: () ->
    @dispatcher.emit @stage_name+'.clearAll'

  is_connected: (uid) ->
    @dispatcher.emit 'is_connected', user_id: @user_id, check_id: uid

  reset: (o) =>
    if(o)
      @dispatcher.emit @stage_name+'.reset', second:o.second, stage:o.stage
    else
      @dispatcher.emit @stage_name+'.reset', {}

  sendText: (text,block) =>
    @dispatcher.emit @stage_name+'.send_text' ,  block: block, text: text

  rewrite: (ink, block) =>
    @dispatcher.emit @stage_name+'.rewrite' ,  block: block, ink: ink


