
if (typeof SocketController == 'undefined'){
  console.error("socket-controller.js should be include first.");
}

SocketController.onDownLocation(function(o){
  Action.onDrawPoint(o);
  View.doDrawPoint(o);
});

SocketController.onMoveLocation(function(o){
  Action.onDrawLine(o);
  View.doDrawLine(o);
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

Action = {};

Action.onDrawPoint = function(o){
  // *** tv: all stages are no actions.
  // *** server: A1 A2 A3 B1 B2 no action
  // server: B3
  trackCache.addPoint(o.block.row, o.block.column, o.x, o.y);
};
Action.onDrawLine = function(o){

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
  // *** server: A1 A3 B1 B2 no action
  // server: A2 B3
  gamers.setActive(o.user_id);
  startCounter(o.user_id);

  // *** tv: B2 no action
  // tv: A1
  sketchSecondIns.doStart();

  // tv: A2
  gamers.setActive(o.user_id);
  sketchSecondIns[o.user_id].doStart();

  // tv: A3 B1
  receiveCancelSubmitHandler({user_id:c});

  // tv: B3
  gamers.setActive(value);
  sketchSecondIns.resetBar();
  sketchSecondIns.doStart();
};
Action.onStop = function(o){
  // *** tv: B2 B3 no actions
  // server: A1 A3 B1 B2
  // tv: A1 A3 B1
  if (window.hasCounter){
    clearInterval(window.alarm);
    window.alarm = null;  
  }

  // server: A2
  clearInterval(window.alarm[o.user_id]);
  window.alarm[o.user_id] = null;

  // server: B3
  blockCancelSubmitSetStyle();
  updateTrackButtons();

  // tv: A1
  sketchSecondIns.doStop();

  // tv: A2
  sketchSecondIns[o.user_id].doStop();
  
};
Action.onSubmit = function(o){
  // A3
  gamers.all().forEach(function(e){
    window.chatApp.action(e, 'stop');
  });
};


View = {};

View.doDrawPoint = function(o){
  // server: A1 A2 A3 B1
  // tv: A1 A2 A3 B1
  CM('origin_'+o.user_id).point({ x: o.x, y: o.y });  

  // server: B2
  // tv: B2
  CM('origin_'+o.user_id + '_' + o.block.row + '_' + o.block.column).point({ x: o.x, y: o.y });

  // server: B3
  // tv: B3
  CM('origin_' + o.block.row + '_' + o.block.column).point({ x: o.x, y: o.y });
};

View.doDrawLine = function(o){
  // server: A1 A2 A3 B1
  // tv: A1 A2 A3 B1
  CM('origin_'+o.user_id).line({ x: o.x, y: o.y });

  // server: B2
  CM('origin_' + o.user_id + '_' + o.block.row + '_' + o.block.column).line({ x: o.x, y: o.y });

  // server: B3
  // tv: B3
  CM('origin_' + o.block.row + '_' + o.block.column).line({ x: o.x, y: o.y });
};

View.setStartStyle = function(o){
  // tv: A1 A2 A3 B1 B2 B3
  // server: B3
  $('#user_photo_' + o.user_id).addClass("green");

  // server: A1 A2 A3 B1
  $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
  $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");

  // server: B2
  $('#visitor_'+c).css("border-color", "#4d4ddb");
  $('[name^=word_'+c+']').css("background-color", "#999");
  $('#visitor_'+c).css("background-color", "#ebf0fa");
};

View.setStopStyle = function(o){
  // server: A1 A2 A3 B1
  $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");

  // server: B3
  $('#user_photo_' + o.user_id).removeClass("green");

  // server: B2
  $('[name=word_' + o.user_id + ']').css("background-color", "#999");
  $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");

  // tv: A1 A2 A3 B1 B2 B3
  $('#user_photo_' + o.user_id).removeClass("green");
};

View.setSubmitStyle = function(o){
  $('#visitor_'+o.user_id).css("background-color", "#ff0");

  // A1 tv
  $('#grid_'+o.user_id).addClass("bor_g");
  $('#glow_'+o.user_id).show();
};




// example 
/*

SocketController.onSendText(function(){
  // do....
});

SocketController.triggerClear({
  user_id: 1
});

*/


