var socketListenEvents = [
  "down_location",
  "move_location",
  "up_location",
  "submit",
  // "cancelSubmit",
  "cancel_submit",
  "clear",  // {user_id:uid} or {user_id:uid, block:block}
  "right",
  // "removeO",
  "remove_o",
  // "setCorrectCount",
  "set_correct_count",
  // "showCorrectUsers",
  "show_correct_users",
  "action",   // -- start, stop, device_start, device_stop
  // "userOut",
  "user_out",
  "reset",
  "is_connected",
  "client_connected",
  
  "move_block",
  "send_text",
  "end_round",
  "rewrite",
  "continue_write",
  // "clearAll"
  "clear_all"
  
];


var socketTriggerEvents = [
  // mobile only these
  "device_ready",
  "action",   // -- start, stop, device_start, device_stop
  "submit",
  "clear",    // {user_id:uid} or {user_id:uid, block:block}
  "down_location",
  "move_location",
  "move_block",

  // server.js.coffee
  "user_out",
  "clear_all",
  "cancel_submit",
  "right",
  "set_gameinfo_to_socket",
  "remove_o",
  "continue_write",
  "is_connected",
  "reset",    // {} or {second:s, stage:stage}
  "set_correct_count",
  "show_correct_users",
  // server_idioms.js.coffee
  "send_text",
  "rewrite",

  // serverB2.js.coffee
  "clear_all"
];

(function(scope){
  var Controller = function(){};
  var io = {  // socket io object
    on:function(name, fn){
      alert("event:" + name + " fn:"+ fn.toString());
    },
    emit:function(name, data, fn){
      alert("event:" + name + " data:" + JSON.stringify(data) +" fn:"+ fn.toString());
    }
  };

  // var methodNameList = [];
  // distribute listener event
  for(var i = 0, len = socketListenEvents.length; i < len; i++){
    var originName = socketListenEvents[i];
    var splitNames = originName.split('_');
    var convertStr = "";
    for(var x in splitNames){
      var str = splitNames[x];
      convertStr += str[0].toUpperCase() + str.slice(1,str.length);
    }
    var methodName = "on" + convertStr;
    var evalString = "Controller."+ methodName + " = function(callback){";
    evalString += "  if(typeof callback == 'function'){";
    evalString += "    io.on('"+originName+"',callback);";
    evalString += "  }";
    evalString += "};";
    eval(evalString);
    // methodNameList.push(methodName);
  }

  // distribute trigger event
  for(var i = 0, len = socketTriggerEvents.length; i < len; i++){
    var originName = socketTriggerEvents[i];
    var splitNames = originName.split('_');
    var convertStr = "";
    for(var x in splitNames){
      var str = splitNames[x];
      convertStr += str[0].toUpperCase() + str.slice(1,str.length);
    }

    var methodName = "emit" + convertStr;
    var evalString = "Controller." + methodName + " = function(d,callback){";
    evalString += "  io.emit('"+originName+"',d,callback);";
    evalString += "};";
    eval(evalString);
    // methodNameList.push(methodName);
  }
  

  scope.SocketController = Controller;

})(window);


// ConsoleController ??

// example 
/*

SocketController.onSendText(function(){
  // do....
});

SocketController.emitClear({
  user_id: 1
});

*/


