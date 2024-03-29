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
  value: !!window.counting || ~["A3","C3"].indexOf(Settings.stageName) || (Settings.stageName == "B2"), 
  writable: false
});
Object.defineProperty(Settings, 'hasTimeCounter', {
  value: ~["A1","C1"].indexOf(Settings.stageName) || (~["C5","mix","group"].indexOf(Settings.stageName) && window.timeRemaining),
  writable: false
});
Object.defineProperty(Settings, 'commonWriting', {
  value: ~["C5","mix"].indexOf(Settings.stageName) && window.common,
  writable: false
});
Object.defineProperty(Settings, 'lockOthers', {
  value: ~["C5","mix","group"].indexOf(Settings.stageName) && window.locking,
  writable: false
});
Object.defineProperty(Settings, 'genKey', {
  value: Settings.stageName + "+" + (window.pageType || "console"),
  writable: false
});
Object.defineProperty(Settings, 'clientUserId', {
  value: window.clientUserId || '0',
  writable: false
});
Object.defineProperty(Settings, 'consoleUserId', {
  value: '0',
  writable: false
});
Object.defineProperty(Settings, 'socketIp', {
  value: window.socketIp || window.location.hostname,
  writable: false
});
Object.defineProperty(Settings, 'socketPort', {
  value: window.socketPort || 5001,
  writable: false
});
Object.defineProperty(Settings, 'socketQuery', {
  value: { _rtUserId: Settings.clientUserId || Settings.consoleUserId },
  writable: false
});
Object.defineProperty(Settings, 'socketProtocol', {
  value: window.socketProtocol || 'http',
  writable: false
});
Object.defineProperty(Settings, 'totalBlocks', {
  value: window.totalBlocks || 3,
  writable: false
});

// ======== Listening Events ========
var socketListenEvents = [
  "down_location",
  "move_location",
  "up_location",
  "submit",
  "cancelSubmit",
  //"cancel_submit",
  "clear",  // {user_id:uid} or {user_id:uid, block:block} or {}
  "right",
  "removeO",
  //"remove_o",
  "setCorrectCount",
  //"set_correct_count",
  "showCorrectUsers",
  //"show_correct_users",
  "action",   // -- start, stop, device_start, device_stop
  "userOut",
  //"user_out",
  "reset",
  "is_connected",
  "client_connected",
  
  "move_block",
  "send_text",

  // B3
  // "change_color",

  "end_round",
  "rewrite",
  "continue_write",
  // "clearAll"
  // "clear_all"
  "zoom",
  "unZoom"
  
];

// ======== Triggered Events ========
var socketTriggerEvents = [
  // mobile only these
  "device_ready",
  "action",   // -- start, stop, device_start, device_stop
  "submit",
  "clear",    // {user_id:uid} or {user_id:uid, block:block}
  "down_location",
  "move_location",
  "up_location",
  "move_block",

  // server.js.coffee
  // "user_out",
  "userOut",
  //"clear_all",
  "clearAll",
  //"cancel_submit",
  "cancelSubmit",
  "right",
  "set_gameinfo_to_socket",
  //"remove_o",
  "removeO",
  "continue_write",
  "is_connected",
  "reset",    // {} or {second:s, stage:stage}
  //"set_correct_count",
  "setCorrectCount",
  //"show_correct_users",
  "showCorrectUsers",
  // server_idioms.js.coffee
  "send_text",

  // B3
  "change_color",

  "rewrite",
  "zoom",
  "unZoom"
];

(function(scope){
  var Controller = function(){};
  var parseQuery = function(list){
    var retStr = [];
    for(var i in list){
      retStr.push(i.toString() + "=" + list[i].toString());
    }
    return retStr.length ? ("?" + retStr.join('&')) : "";
  };
  var dispatcher = io.connect(Settings.socketProtocol + "://" + 
    Settings.socketIp + ":" + Settings.socketPort + parseQuery(Settings.socketQuery));

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
    evalString += "    dispatcher.on('"+originName+"',callback);";
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
    var evalString = "Controller." + methodName + " = function(d,callback,prefix){";
    evalString += "  if(typeof callback === 'string') {prefix = callback; callback = undefined;}";
    evalString += "  prefix = prefix || '';";
    evalString += "  dispatcher.emit(prefix + '"+originName+"',d,callback);";
    evalString += "};";
    eval(evalString);
    // methodNameList.push(methodName);
  }

  scope.SocketController = Controller;

})(window);
