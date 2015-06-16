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
  "continue_write"
  // "clearAll"
  // "clear_all"
  
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
  "rewrite"
];

(function(scope){
  var Controller = function(){};
  var io = {  // socket io object
    on:function(name, fn){
      console.log("event:" + name + " fn:"+ (fn || "").toString());
    },
    emit:function(name, data, fn){
      console.log("event:" + name + " data:" + JSON.stringify(data) +" fn:"+ (fn || "").toString());
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
    evalString += "    Controller.receive" + convertStr + "Handler = callback;";
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

    var methodName = "trigger" + convertStr;
    var evalString = "Controller." + methodName + " = function(d,callback){";
    evalString += "  io.emit('"+originName+"',d,callback);";
    evalString += "};";
    eval(evalString);
    // methodNameList.push(methodName);
  }

  scope.SocketController = Controller;

})(window);

// ======= Settings Information ======
window.Settings = {};
Object.defineProperty(Settings, 'stageName', {
  value: window.stageName || "A1",  // valid names: A1 A2 A3 B1 B2 B2_v1 B3
  writable: false
});
// Object.defineProperty(Settings, 'clientType', {
//   value: window.pageType || "console", // valid type: console/user/tv
//   writable: false
// });
Object.defineProperty(Settings, 'hasCorrectCounting', {
  value: !!window.counting || (window.stageName == "A3") || (window.stageName == "B2"), 
  writable: false
});
Object.defineProperty(Settings, 'hasTimeCounter', {
  value: Settings.stageName == 'A1',
  writable: false
});
Object.defineProperty(Settings, 'genKey', {
  value: Settings.stageName + "+" + (window.pageType || "console"),
  writable: false
});
