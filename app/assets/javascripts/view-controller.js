
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

SocketController.onCancelSubmit(function(o){
  Action.onCancelSubmit(o);
  View.setCancelSubmitStyle(o);
});

SocketController.onClear(function(o){
  if (isEmpty(o)){
    Action.onClearAll(o);
    View.setClearAllStyle(o);
  }else{
    Action.onClear(o);
    View.setClearStyle(o);  
  }
});

//receiveOHandler
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

// ======= Settings Information ======
Settings = {};
Settings.stageName = "A1";  // valid names: A1 A2 A3 B1 B2 B2_v1 B3
Settings.clientType = "console" // valid type: console/user/tv
Settings.hasCorrectCounting = true;
Settings.hasTimeCounter = true;

// ======= Actions Information =======
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

// ======= View Style Changing (depends DOM object) =======
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
  // tv: A3 B1 B2 B2_v1
  // server: B2_v1
  $('#user_photo_' + o.user_id).addClass("green");

  // server: A1 A3 B1
  $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
  $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");

  // server: B2
  $('#visitor_'+c).css("border-color", "#4d4ddb");
  $('[name^=word_'+c+']').css("background-color", "#999");
  $('#visitor_'+c).css("background-color", "#ebf0fa");

  // server: A2
  $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
  $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");
  startCounter(o.user_id);

  // server: B3
  $('#user_photo_' + o.user_id).addClass("green");
  startCounter(o.user_id);

  // tv: B3
  $('#user_photo_' + o.user_id).addClass("green");  
  sketchSecondIns.resetBar();
  sketchSecondIns.doStart();

  // tv: A1
  $('#user_photo_' + o.user_id).addClass("green");
  sketchSecondIns.doStart();

  // tv: A2
  $('#user_photo_' + o.user_id).addClass("green");
  sketchSecondIns[o.user_id].doStart();

};

View.setStopStyle = function(o){
  // server: A1 A2 A3 B1 B2_v1
  $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");

  // server: B3
  $('#user_photo_' + o.user_id).removeClass("green");
  for(var x = 1; x <= 8; x++){
    for(var y = 1; y <= 12; y++){
      var c = document.getElementById('glow_' + x + '_' + y);
      $(c).hide();
    }
  }
  updateTrackButtons();

  // server: B2
  $('[name=word_' + o.user_id + ']').css("background-color", "#999");
  $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");

  // tv: A3 B1 B2 B2_v1
  $('#user_photo_' + o.user_id).removeClass("green");

  // tv: A1
  $('#user_photo_' + o.user_id).removeClass("green");
  sketchSecondIns.doStop();

  // tv: A2
  $('#user_photo_' + o.user_id).removeClass("green");
  sketchSecondIns[o.user_id].doStop();

  // tv: B3
  $('#user_photo_' + o.user_id).removeClass("green");
  sketchSecondIns.doStop();
  for(var x = 1; x <= 8; x++){
    for(var y = 1; y <= 12; y++){
      var c = document.getElementById('glow_' + x + '_' + y);
      $(c).hide();
    }
  }

};

View.setSubmitStyle = function(o){
  // server: A1 A2 A3 B1 B2_v1
  $('#visitor_' + o.user_id).css("background-color", "#ff0");

  // server: B2
  $('[name=word_' + o.cid + ']').css("background-color", "#060");

  // tv: B3
  // server: B3
  $('#glow_' + o.block.row + '_' + o.block.column).show();

  // tv: A1 A2 A3 B1 B2_v1
  $('#grid_' + o.user_id).addClass("bor_g");
  $('#glow_' + o.user_id).show();

  // tv: B2
  $('#grid_' + o.cid).css("box-shadow", '0px 0px 15px 10px rgba(55, 197, 78, 1) inset');
  $("#grid_" + o.cid).css("opacity", "0");
  $('#grid_' + o.cid).css("opacity", "1");
};

View.setCancelSubmitStyle = function(o){
  // *** server: B2 B3 no action
  // server: A1 A2 A3 B1 B2_v1
  $('#origin_' + o.user_id).removeClass("canvas_box_block");

  // *** tv: B2 B3 no action
  // tv: A1 A2 A3 B1 B2_v1
  $('#grid_' + o.user_id).removeClass("bor_g");
  $('#glow_' + o.user_id).hide();

};

View.setClearStyle = function(o){
  // server: A1 A2 A3 B1 B2_v1
  // tv: A1 A2 A3 B1 B2_v1
  CM('origin_' + o.user_id).clear();

  // tv: B2
  // server: B2
  CM('origin_' + o.cid).clear();
  // CM('origin_' + o.user_id + '_' + o.block.row + '_' + o.block.column).clear();

  // tv: B3
  // server: B3
  CM('origin_' + o.block.row + '_' + o.block.column).clear();

};

View.setClearAllStyle = function(o){
  // *** server: A2 B3 no action
  // server: A3 B1 B2_v1
  $('[id^=yes_img_]').hide();
  gamers.all().forEach(function(id){
    CM('origin_' + id).clear();
    $('#visitor_' + id).css("background-color", "#ebf0fa");
    $("#correct_button_" + id).removeClass("btn-success");
    SocketController.receiveActionHandler({name:'stop', user_id:id});
  });

  // server: A1
  $('[id^=yes_img_]').hide();
  $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(window.timeRemaining+"s");
  gamers.all().forEach(function(id){
    CM('origin_' + id).clear();
    $('#visitor_' + id).css("background-color", "#ebf0fa");
    $("#correct_button_" + id).removeClass("btn-success");
    SocketController.receiveActionHandler({name:'stop', user_id:id});
  });

  // server: B2
  $('[id^=yes_img_]').hide();
  gamers.all().forEach(function(id){
    $('[name^=word_' + id +']').css("background-color", "#999");
    for (var i = 1; i <= 3; i++){
      for (var j = 1; j <= 3; j++){
        CM('origin_' + id + "_" + i + "_" + j).clear();
        $("[name^=correct_button_" + id + "_" + i + "_" + j + "]").removeClass("btn-success");
      }
    }
    SocketController.receiveActionHandler({name:'stop', user_id:id});
  });

  // tv: A1
  $('[id^=yes_img_]').hide();
  gamers.all().forEach(function(id){
    CM('origin_' + id).clear();
    SocketController.receiveCancelSubmitHandler({user_id:id});
    SocketController.receiveActionHandler({name:'stop', user_id:id});
  });
  sketchSecondIns.resetBar();
};

View.setRightStyle = function(o){
  // *** server: B3 no action
  // server: A1 A2 A3 B1 B2_v1
  // tv: A1 A2 A3 B1 B2_v1
  $("#yes_img_" + o.user_id).show();

  // server: B2
  // tv: B2
  $("#yes_img_" + o.user_id + "_" + o.block.row + "_" + o.block.column).show();

  // *** tv: A1 B3 no action
};

View.setRemoveOStyle = function(o){
  // server: A1 A2 A3 B1 B2_v1
  // tv: A1 A2 A3 B1 B2_v1
  $('#yes_img_' + o.user_id).hide();

  // server: B2
  // tv: B2
  $("#yes_img_" + o.cid).hide();

  // *** server: B3 no action
  // *** tv: B3 no action

};

View.setCorrectCountStyle = function(o){
  // server: A1 A3 B1
  $("#correct_button_" + o.user_id).addClass("btn-success");
  if (Settings.hasCorrectCounting){
    $("#no_correct_" + o.user_id).text(o.count + "題");  
  }

  // server: B2_v1
  if (Settings.hasCorrectCounting){
    $("#no_correct_" + o.user_id).text(o.count + "題");  
  }

  // server: B2
  if ($("[name^=correct_button_" + o.cid + "]").hasClass("btn-success")) {
    $("[name^=correct_button_" + o.cid + "]").removeClass("btn-success");
  }
  else $("[name^=correct_button_" + o.cid + "]").addClass("btn-success");
  $("#no_correct_" + o.user_id).text(o.count + "題");

  // *** server: A2 B3 no action
  // *** tv: A2 B3 no action

  // tv: A3
  $("#no_correct_" + o.user_id).css('opacity', 1);
  $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', 'black');

  // tv: B1
  if (Settings.hasCorrectCounting){
    $("#no_correct_" + o.user_id).show();
    $("#no_correct_" + o.user_id).css('opacity', 1);
    $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', 'black');  
  }

  // tv: B2
  $("#no_correct_" + o.user_id).css('opacity', 1);
        
};

View.setShowCorrectUsersStyle = function(o){
  // *** server: A2 A3 B1 B2_v1 B2 B3 no actions.
  // *** tv: A2 A3 B1 B2_v1 B3 no actions.
  // server: A1
  if(o.length){
    o.sort(function(a,b) {
      return parseInt(a) - parseInt(b);
    });
    for (var i in o) { 
      setTimeout( (function(id){
        return function() {
          View.setRightStyle({user_id:id});
        }
      })(o[i]), 800 * i);
    }
  }

  // tv: A1
  var updateCount = function(id){
    var c = tempcount[user] || 0;
    var jqEl = $("#no_correct_" + id);
    jqEl.text(c);
    if(c){
      jqEl.css('opacity', 1).css('color', 'black');
    }else{
      jqEl.css('opacity', 0);
    }
  };
  if(o.length){
    o.sort(function(a,b) {
      return parseInt(a) - parseInt(b);
    });
    for (var i in o) { 
      setTimeout( (function(id){
        return function() {
          View.setRightStyle({user_id:id});
          if(Settings.hasCorrectCounting){
            updateCount(id);
          }
        }
      })(o[i]), 800 * i);
    }
  }else{
    if(Settings.hasCorrectCounting){
      gamers.all().forEach(function(id){
        updateCount(id);
      });
    }
  }


  // tv: B2
  var toIdx = function(i, j) {
    return (i-1) * 3 + j;
  };
  var total = 0;
  for (var i in o) { 
    if (o[i]) {
      o[i].sort(function(a, b) { return toIdx(a.row, a.column) - toIdx(b.row, b.column); });
      //o[i].sort(function(a, b) { return parseInt(a.row) - parseInt(b.row); });
      for(var j = 0; j < o[i].length; j++) {
        total += 1;
        setTimeout( (function(a, uid){
          //var uid = i;
          var ij = a;
          return function() {
            // $("#yes_img_"+uid+"_"+ij.row+"_"+ij.column).show();
            if (ij)
              View.setRightStyle({user_id:uid, block:{row:ij.row,column:ij.column} });
            // if (ij) showOstyle(uid,ij);
          };
        })(o[i][j], i), 600 * total);
      }
      total += 1;
      setTimeout( (function(uid){
        return function() {
          $("#no_correct_" + uid).text(tempcount[uid]).css("color", "black");
        }
      })(i), 600 * total);
    }
  }

};

View.setUserOutStyle = function(o){
  var user_id = o.user_id;

  // *** server: B2 B3 no action
  // server: A1 A3 B1 B2_v1
  CM.unreg('origin_' + user_id);
  $("#correct_button_" + user_id).attr("disabled", true);
  $("#out_button_" + user_id).attr("disabled", true);
  $("#start_button_" + user_id).attr("disabled", true);
  $("#stop_button_" + user_id).attr("disabled", true);
  $('#visitor_' + user_id).attr('style','opacity:0.2;border:3px solid #f8f8f8');

  // server: A2
  CM.unreg('origin_' + user_id);
  $("#correct_button_" + user_id).attr("disabled", true);
  $("#out_button_" + user_id).attr("disabled", true);
  $("#start_button_" + user_id).attr("disabled", true);
  $("#stop_button_" + user_id).attr("disabled", true);
  $("#continue_" + user_id).attr("disabled", true);
  $("#remove_O_button_" + user_id).attr("disabled", true);
  $("#remove_writing_button_" + user_id).attr("disabled", true);
  $('#visitor_' + user_id).attr('style','opacity:0.2;border:4px solid #f8f8f8');

  // *** tv: B2 B3 no action
  // tv: A1 A3 B1 B2_v1
  $('#out_' + user_id).show();
  $('#black_' + user_id).show();

  // tv: A2
  $('#out_' + user_id).show();
  $('#black_' + user_id).show();
  sketchSecondIns[user_id].clearBar();
};

View.setResetStyle = function(o){
  // *** server: A3 B1 B2_v1 B2 B3 no action
  // server: A1
  if (o.second != null) {
    // resetSetStyle(o.second);
    $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(window.timeRemaining+"s");
    // console.log(window.timeRemaining);
    $('#second').text(window.timeRemaining);  
  }

  // server: A2
  if (o.second != null) {
    for (key in window.alarm){
      $('#second_' + key).text(o.second + "秒");
    }
  }

  // *** tv: A3 B1 B2_v1 B2 B3 no action
  // tv: A1
  sketchSecondIns.resetBar();
  sketchSecondIns.setSecond(parseInt(o.second));

  // tv: A2
  if (o.second != null) {
    gamers.all().forEach(function(id){
      $('#second_' + id).text(o.second + "秒");
      sketchSecondIns[id].resetBar();
      sketchSecondIns[id].setSecond(parseInt(o.second));
    });
  }
};

View.setIsConnectedStyle = function(o){
  // *** tv: all stages no action
  // *** server: B3 no action
  // server: A1 A2 A3 B1 B2_v1 B2
  var x = o.check_id;
  if (o.connected){
    $('#status_' + x).attr('class','label label-success').text("OnLine");
  }else{
    $('#status_' + x).attr('class','label label-danger').text("OffLine");
  }
};

View.setClientConnectedStyle = function(o){
  // *** tv: all stages no action
  // *** server: B3 no action
  // server: A1 A2 A3 B1 B2_v1 B2
  for(var x in o) {
    View.setIsConnectedStyle({check_id:x, connected:o[x] });
  }
};

View.setMoveBlockStyle = function(o){
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // *** tv: A1 A2 A3 B1 B2_v1 no action
  // tv: B3
  // server: B3
  $('#glow_' + o.block.row + '_' + o.block.column).hide();

  // tv: B2
  $('#glow_' + o.cid).hide();
  $('#grid_' + o.cid).css("box-shadow", '');
  $("#grid_" + o.cid).css("opacity", "0");
  $('#grid_' + o.cid).css("opacity", "1");
};  

View.setSendTextStyle = function(o){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // tv: B3
  // server: B3
  var testCan = document.getElementById('origin_'+ o.block.row +'_' + o.block.column);
  var w = $(testCan).width();
  var context = testCan.getContext("2d");
  context.fillStyle = "#ececec";
  //context.font = "bold " + (w * 13 / 15) + "px 標楷體";
  context.font = (w * 13 / 15) + "px Sans-serif";
  context.fillText(o.text, w / 15, w * 12 / 15);
};

View.setEndRoundStyle = function(o){
  // *** server: all stages are no action
  // *** tv: all stages are no action
};

View.setRewriteStyle = function(o){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // tv: B3
  // server: B3
  var id = 'origin_' + o.block.row + '_' + o.block.column;
  var inkArray = o.ink;
  for(var i = 0, len = inkArray.length; i < len; i++){
    var ink = inkArray[i];
    var xList = ink[0];
    var yList = ink[1];
    var plen = Math.min(xList.length, yList.length);
    for(var p = 0; p < plen; p++){
      if(p == 0){
        CM(id).point({ x: xList[p], y: yList[p] });
      }else{
        CM(id).line({ x: xList[p], y: yList[p] });
      }
    }
  }
};

View.setContinueWriteStyle = function(o){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // server: B3
  $('#user_photo_' + o.user_id).addClass("green");
  startCounter(o.user_id);

  // tv: B3
  $('#user_photo_' + o.user_id).addClass("green");
  sketchSecondIns.doStart();
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


