
if (typeof SocketController == 'undefined'){
  console.error("socketevent-generator.js should included first.");
}
if (typeof Commons == 'undefined'){
  console.error("commons.js should included first.");
}
if (typeof Action == 'undefined'){
  console.error("action-definition.js should included first.");
}
if (typeof View == 'undefined'){
  console.error("view-definition.js should included first.");
}

// ======= Event Listener / Hooker =======
SocketController.onDownLocation(function(o){
  Action.onDownLocation(o);
  View.setDownLocationStyle(o);
});

SocketController.onMoveLocation(function(o){
  Action.onMoveLocation(o);
  View.setMoveLocationStyle(o);
});

SocketController.onUpLocation(function(o){
  Action.onUpLocation(o);
  View.setUpLocationStyle(o);
});

SocketController.onAction(function(o){
  var name = o.name;
  if(name == "start"){
    Action.onStart(o);
    View.setStartStyle(o);
  }else if(name == "stop"){
    Action.onStop(o);
    View.setStopStyle(o);
  }
});

SocketController.onSubmit(function(o){
  Action.onSubmit(o);
  View.setSubmitStyle(o);
});

SocketController.onCancelSubmit(function(o){
  Action.onCancelSubmit(o);
  View.setCancelSubmitStyle(o);
});

SocketController.onClear(function(o){
  if (Commons.isEmpty(o)){
    Action.onClearAll(o);
    View.setClearAllStyle(o);
  }else{
    Action.onClear(o);
    View.setClearStyle(o);  
  }
});

SocketController.onRight(function(o){
  Action.onRight(o);
  View.setRightStyle(o);
});

SocketController.onRemoveO(function(o){
  Action.onRemoveO(o);
  View.setRemoveOStyle(o);
});

SocketController.onSetCorrectCount(function(o){
  Action.onSetCorrectCount(o);
  View.setCorrectCountStyle(o);
});

SocketController.onShowCorrectUsers(function(o){
  Action.onShowCorrectUsers(o);
  View.setShowCorrectUsersStyle(o);
});

SocketController.onUserOut(function(o){
  Action.onUserOut(o);
  View.setUserOutStyle(o);
});

SocketController.onReset(function(o){
  Action.onReset(o);
  View.setResetStyle(o);
});

SocketController.onIsConnected(function(o){
  Action.onIsConnected(o);
  View.setIsConnectedStyle(o);
});

SocketController.onClientConnected(function(o){
  Action.onClientConnected(o);
  View.setClientConnectedStyle(o);
});

SocketController.onMoveBlock(function(o){
  Action.onMoveBlock(o);
  View.setMoveBlockStyle(o);
});

SocketController.onSendText(function(o){
  Action.onSendText(o);
  View.setSendTextStyle(o);
});

SocketController.onEndRound(function(o){
  Action.onEndRound(o);
  View.setEndRoundStyle(o);
});

SocketController.onRewrite(function(o){
  Action.onRewrite(o);
  View.setRewriteStyle(o);
});

SocketController.onContinueWrite(function(o){
  Action.onContinueWrite(o);
  View.setContinueWriteStyle(o);
});


