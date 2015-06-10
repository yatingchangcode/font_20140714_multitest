
if (typeof Settings == 'undefined'){
  console.error("socketevent-generator.js should be include first.");
}

window.Action = {};

// ======= Actions Information =======
Action.onDownLocation = function(o){
  // *** tv: all stages are no actions.
  // *** server: A1 A2 A3 B1 B2 no action
  // server: B3
  trackCache.addPoint(o.block.row, o.block.column, o.x, o.y);
};
Action.onMoveLocation = function(o){

  console.log("first:"+ o.stamp);
  console.log("second:"+ o.server_receive_time);
  console.log("third:"+ new Date().getTime());
  console.log("client to server"+ (o.server_receive_time - o.stamp));
  console.log("server to client"+ (new Date().getTime() - o.server_receive_time));

  // *** tv: all stages are no actions.
  // *** server: A1 A2 A3 B1 B2 no action
  // server: B3
  trackCache.addLinePoint(o.block.row, o.block.column, o.x, o.y);
};
Action.onStart = function(o){
  // *** server: A1 A3 B1 B2 B2_v1 no action
  // server: A2 B3
  gamers.setActive(o.user_id);

  // *** tv: A1 B2 B2_v1 no action
  // tv: A2
  gamers.setActive(o.user_id);

  // tv: A3 B1
  SocketController.receiveCancelSubmitHandler(o);

  // tv: B3
  gamers.setActive(value);

};
Action.onStop = function(o){
  // server: A1 A3 B1 B2 B2_v1
  // tv: A1 A3 B1 B2_v1
  if (window.hasCounter && window.alarm){
    clearInterval(window.alarm);
    window.alarm = null;  
  }

  // server: A2
  clearInterval(window.alarm[o.user_id]);
  window.alarm[o.user_id] = null;

  // server: B3
  trackCache.saveToCache();
  clearInterval(window.alarm);
  window.alarm = null; 

  // *** tv: A2 B2 B3 no actions
  
};
Action.onSubmit = function(o){
  // *** server: A1 B1 B3 no actions
  // server: A2
  SocketController.triggerAction({action:'stop',user_id:o.user_id});

  // server: A3
  gamers.all().forEach(function(id){
    SocketController.triggerAction({action:'stop',user_id:id});
  });

  // server: B2
  isNotSave = true;

};
Action.onCancelSubmit = function(o){
  // server & tv: all stages are no actions
};
Action.onClear = function(o){
  // *** server: A1 A2 A3 B1 B2_v1 no actions
  // server: B2
  if(window.fromServerCommand || o.user_id != '0'){
    window.fromServerCommand = false;
  }

  // server: B3
  if(window.fromServerCommand || o.user_id != '0'){
    trackCache.clear(o.block.row, o.block.column, window.fromServerCommand);
    window.fromServerCommand = false;
  }

};
Action.onClearAll = function(o){};
Action.onRight = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};
Action.onRemoveO = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};
Action.onSetCorrectCount = function(o){
  // *** server: all stages are no action
  // tv: A1 B1
  if (Settings.hasCorrectCounting){
    tempcount[o.user_id] = o.count;
  }

  // tv: A3 B2
  tempcount[o.user_id] = o.count;

};

Action.onShowCorrectUsers = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

Action.onUserOut = function(o){
  // *** server: B2 B3 no action
  // *** tv: B2 B3 no action
  // server: A1 A2 A3 B1 B2_v1
  // tv: A1 A2 A3 B1 B2_v1
  console.log(o.user_id);
  gamers.remove(o.user_id);
};

Action.onReset = function(o){
  // *** tv: all stages are no action
  // *** server: A1 A3 B1 B2_v1 no action
  // server: A2
  if (o.second != null) {
    for (key in window.alarm){
      clearInterval(window.alarm[key]);
      window.alarm[key] = null;
    }
  }
};

Action.onIsConnected = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

Action.onClientConnected = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

Action.onMoveBlock = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

Action.onSendText = function(o){
  // *** tv: all stages are no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // server: B3
  if(window.fromServerCommand){
    trackCache.addText(o.block.row, o.block.column, o.text);
    window.fromServerCommand = false;  
  }
};

Action.onEndRound = function(o){
  // *** tv: all stages are no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // server: B3
  SocketController.triggerAction({action:'stop',user_id:o.user_id});
};

Action.onRewrite = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

Action.onContinueWrite = function(o){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // tv: B3
  // server: B3
  gamers.setActive(c);

};

