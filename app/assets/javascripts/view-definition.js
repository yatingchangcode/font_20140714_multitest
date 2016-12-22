
if (typeof Settings == 'undefined'){
  console.error("socketevent-generator.js should be include first.");
}
if (typeof Commons == 'undefined'){
  console.error("commons.js should be include first.");
}

window.View = {};

Commons.timeRemaining = parseInt($('#secondInput').val()) || window.timeRemaining || 0;

// ======== Refact the view actions ========
View.startCounter = (function(key){
  return {
    "A1+console":function(){
      if(Commons.alarm) return;
      var s = parseFloat($('#second').text()).toFixed(1);
      if (s === (0.0).toFixed(1)) View.setResetStyle();
      Commons.alarm = setInterval((function(secondJQ, progressJQ){
        return function(){
          var s = parseFloat(secondJQ.text()).toFixed(1);
          if (s > 0){
            var percent = 100 * (s-0.1) / Commons.timeRemaining;
            progressJQ.css("width", percent+"%").attr('aria-valuenow', percent)
            .text((s-0.1).toFixed(1)+"s");
            secondJQ.text((s - 0.1).toFixed(1));
          } else {
            clearInterval(Commons.alarm);
            Commons.alarm = null;
            Commons.gamers.all().forEach(function(id){
              SocketController.triggerAction({action:'stop',user_id:id});
              SocketController.receiveSubmitHandler({user_id:id});
            });
          }
        };
      })($('#second'), $('#progress_bar')), 100);
    },
    "A2+console":function(thisvalue){
      if(Commons.alarm && Commons.alarm[thisvalue]) return;
      Commons.alarm[thisvalue] = setInterval((function(id, secondJQ){
        return function(){
          var s = parseFloat(secondJQ.text()).toFixed(1);
          if (s > 0){
            secondJQ.text((s-0.1).toFixed(1) + "秒");
          } else {
            clearInterval(Commons.alarm[id]);
            Commons.alarm[id] = null;
            SocketController.triggerAction({action:'stop',user_id:id});
            SocketController.receiveSubmitHandler({user_id:id});
          }
        };
      })(thisvalue, $('#second_' + thisvalue)), 100);
    },
    "B3+console":function(thisvalue){
      if(Commons.alarm) return;
      var s = parseFloat($('#progress_bar').text()).toFixed(1);
      //if (s === (0.0).toFixed(1)) resetProgressBarAndTime();
      Commons.alarm = setInterval((function(progressJQ){
        return function(){
          var s = parseFloat(progressJQ.text()).toFixed(1);
          if (s > 0){
            var percent = 100 * (s-0.1) / Commons.timeRemaining;
            progressJQ.css("width", percent+"%").attr('aria-valuenow', percent).text((s-0.1).toFixed(1)+"s");
          } else {
            clearInterval(Commons.alarm);
            Commons.alarm = null;
            Commons.gamers.all().forEach(function(id){
              SocketController.triggerAction({action:'stop',user_id:id});
              //receiveSubmitHandler({user_id:e});
            });
            if(tvwall && tvwall.clearTimebar) tvwall.clearTimebar();
          }
        };
      })($('#progress_bar')),100);
    },
    "mix+console":function(thisvalue){
      var timesupFn, intV, passId, secObj;
      if(!Settings.hasTimeCounter) return;
      if(Settings.commonWriting && Commons.alarm) return;
      if(!Settings.commonWriting && Commons.alarm && Commons.alarm[thisvalue]) return;
      secObj = Settings.commonWriting ? $('#second') : $('#second_' + thisvalue);
      passId = Settings.commonWriting ? "" : thisvalue;
      timesupFn = function(id){
        if(id) 
          return function(){
            clearInterval(Commons.alarm[id]);
            Commons.alarm[id] = null;
            SocketController.triggerAction({action:'stop',user_id:id},"mix.");
            SocketController.receiveSubmitHandler({user_id:id});
          };
        else 
          return function(){
            clearInterval(Commons.alarm);
            Commons.alarm = null;
            Commons.gamers.all().forEach(function(id){
              SocketController.triggerAction({action:'stop',user_id:id},"mix.");
              SocketController.receiveSubmitHandler({user_id:id});
            });
          };
      };

      intV = setInterval((function(secondJQ, progressJQ, tfn){
        return function(){
          var s = parseFloat(secondJQ.text()).toFixed(1);
          if (s > 0){
            var percent = 100 * (s - 0.1) / Commons.timeRemaining;
            var sec = (s - 0.1).toFixed(1);
            progressJQ.css("width", percent+"%").attr('aria-valuenow', percent).text(sec+"s");
            secondJQ.text(sec);
            //perSecJQ.text(sec + "秒");
          } else {
            tfn();
          }
        };
      })(secObj, $('#progress_bar'), timesupFn(passId)), 100);
      if(Settings.commonWriting) Commons.alarm = intV;
      else Commons.alarm[thisvalue] = intV;
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.updateTrackButtons = (function(key){
  return {
    "B3+console":function(forceAssign){
      var force = typeof forceAssign == "boolean";
      var undoState = force? forceAssign : !(Commons.trackCache.hasUndo() && !Commons.alarm);
      var redoState = force? forceAssign : !(Commons.trackCache.hasRedo() && !Commons.alarm);
      $("#undoButton").attr("disabled", undoState);
      $("#redoButton").attr("disabled", redoState);
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.addCorrectCount = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2+console","B2_v1+console", "mix+console"]);
  return {
    // server: A1 A3 B1 B2 B2_v1
    "A1+console":function(id, val){
      var change = val || 1;
      var initVal = change > 0 ? 1 : 0;
      if (!Commons.no_correct) Commons.no_correct = {};
      if (!Commons.no_correct[id]) {
        Commons.no_correct[id] = initVal;
      } else {
        Commons.no_correct[id] += change;
      }
      return Commons.no_correct[id];
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.collectGamers = function(list){
  for(var i in list) Commons.gamers.push(list[i]);
};

View.registerCanvas = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console"]);
  key = Commons.getCommonGenKey(key, ["A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv"]);
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    "A1+console":function(list, prefix){
      prefix = prefix || 'origin_';
      for(var i in list) CM.reg(prefix + list[i]);
    },
    "A1+tv":function(list, prefix){
      prefix = prefix || 'origin_';
      for(var i in list) CM.reg(prefix + list[i]);
      CM.reg('_zoomTmp');
    },
    "B2+console":function(list, prefix){
      prefix = prefix || 'origin_';
      var rowMax = 3;
      var colMax = 3;
      for(var idx in list) {
        for(var row = 1; row <= rowMax; row++){
          for(var col = 1; col <= colMax; col++){
            CM.reg(prefix + list[idx] + "_" + row + "_" + col);
          }
        }
      }
    },
    "B3+console":function(list, prefix){
      prefix = prefix || 'origin_';
      var rowMax = 8;
      var colMax = 12;
      for(var row = 1; row <= rowMax; row++){
        for(var col = 1; col <= colMax; col++){
          CM.reg(prefix + row + "_" + col);
        }
      }
    },
    "mix+console":function(list, prefix){
      prefix = prefix || 'origin_';
      var rowMax = 3;
      var colMax = 3;
      for(var idx in list) {
        for(var row = 1; row <= rowMax; row++){
          for(var col = 1; col <= colMax; col++){
            if(row == 2 || col == 2)
              CM.reg(prefix + list[idx] + "_" + row + "_" + col);
          }
        }
      }
    },
    "mix+tv":function(list,prefix){
      prefix = prefix || 'origin_';
      var rowMax = 3;
      var colMax = 3;
      for(var idx in list) {
        for(var row = 1; row <= rowMax; row++){
          for(var col = 1; col <= colMax; col++){
            if(row == 2 || col == 2)
              CM.reg(prefix + list[idx] + "_" + row + "_" + col);
          }
        }
      }
      for(var row = 1; row <= rowMax; row++){
        for(var col = 1; col <= colMax; col++){
          if(row == 2 || col == 2)
            CM.reg('_zoomTmp' + "_" + row + "_" + col);
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.loadSketchSecond = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+tv","B3+tv"]);
  return {
    "A1+tv":function(){    
      if(!Commons.sketchSecondIns){
        //Commons.sketchSecondIns = Processing.getInstanceById('sketchSecond');
        Commons.sketchSecondIns = TimeBar.getInstanceById('sketchSecond');
      }
      // var p = $(document.getElementById('sketchSecond').parentElement);
      // Commons.sketchSecondIns.setSize(p.width(), p.height());
      Commons.sketchSecondIns.setSecond(Commons.timeRemaining);
    },
    "A2+tv":function(){
      if(!Commons.sketchSecondIns) Commons.sketchSecondIns = {};
      Commons.gamers.all().forEach(function(id){
        if(!Commons.sketchSecondIns[id]){
          //Commons.sketchSecondIns[id] = Processing.getInstanceById('sketchSecond_' + id);
          Commons.sketchSecondIns[id] = TimeBar.getInstanceById('sketchSecond_' + id);
        }
        // var p = $(document.getElementById('sketchSecond_' + id).parentElement);
        // Commons.sketchSecondIns[id].setSize(p.width(), p.height());
        Commons.sketchSecondIns[id].setSecond(Commons.timeRemaining);
      });
    },
    "C1+tv":function(){
      if(!Commons.sketchSecondIns) Commons.sketchSecondIns = {};
      Commons.gamers.all().forEach(function(id){
        if(!Commons.sketchSecondIns[id]){
          //Commons.sketchSecondIns[id] = Processing.getInstanceById('sketchSecond_' + id);
          Commons.sketchSecondIns[id] = TimeBar.getInstanceById('sketchSecond_' + id, {
            startColor: "#52daff", endColor: "#ff0c00"
          });
        }
        // var p = $(document.getElementById('sketchSecond_' + id).parentElement);
        // Commons.sketchSecondIns[id].setSize(p.width(), p.height());
        Commons.sketchSecondIns[id].setSecond(Commons.timeRemaining);
      });
    },
    "mix+tv":function(){
      if(Settings.hasTimeCounter){
        if(Settings.commonWriting){
          if(!Commons.sketchSecondIns){
            Commons.sketchSecondIns = TimeBar.getInstanceById('sketchSecond');
          }
          Commons.sketchSecondIns.setSecond(Commons.timeRemaining);
        }else{
          if(!Commons.sketchSecondIns) Commons.sketchSecondIns = {};
          Commons.gamers.all().forEach(function(id){
            if(!Commons.sketchSecondIns[id]){
              Commons.sketchSecondIns[id] = TimeBar.getInstanceById('sketchSecond_' + id);
            }
            Commons.sketchSecondIns[id].setSecond(Commons.timeRemaining);
          }); 
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setGameCurrentInfo = function(){
  var params = [
    'second=' + (Commons.timeRemaining || ""),
    'common=' + (Settings.commonWriting? 1 : 0),
    'locking=' + (Settings.lockOthers? 1 : 0)
  ];
  $.post('/games/set_game_data.json?' + params.join('&'),
    function(data){            
      //var res = JSON.parse(data);
      console.log("update settings:" + JSON.stringify(data));
    }
  ).fail(function(e){
    console.log('error' + JSON.stringify(e));
  });
};


// =======
// ======= View Style Changing (depends DOM object) =======
// =======
View.setDownLocationStyle = (function(key){
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console",
    "A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"
  ]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv","mix+console","mix+tv"]);
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      CM('origin_'+o.user_id).point({ x: o.x, y: o.y });
    },
    // server: B2
    // tv: B2
    "B2+console":function(o){
      CM('origin_' + o.user_id + '_' + o.block.row + '_' + o.block.column).point({ x: o.x, y: o.y });
    },
    // server: B3
    // tv: B3
    "B3+console":function(o){
      CM('origin_' + o.block.row + '_' + o.block.column).point({ x: o.x, y: o.y });
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setMoveLocationStyle = (function(key){
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console",
    "A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"
  ]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv","mix+console","mix+tv"]);
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      CM('origin_' + o.user_id).line({ x: o.x, y: o.y });
    },
    // server: B2
    // tv: B2
    "B2+console":function(o){
      CM('origin_' + o.user_id + '_' + o.block.row + '_' + o.block.column).line({ x: o.x, y: o.y });
    },
    // server: B3
    // tv: B3
    "B3+console":function(o){
      CM('origin_' + o.block.row + '_' + o.block.column).line({ x: o.x, y: o.y });
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setUpLocationStyle = Commons.emptyFn;

View.setStartStyle = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+tv","B1+tv","B2_v1+tv","B2_v1+console","B2+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+console","A3+console","B1+console"]);
  key = Commons.getCommonGenKey(key, ["A2+console","mix+console"]);
  key = Commons.getCommonGenKey(key, ["A2+tv","C1+tv"]);
  return {
    // tv: A3 B1 B2 B2_v1
    // server: B2_v1
    "A3+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
    },
    // server: A1 A3 B1
    "A1+console":function(o){
      $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
      $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");
    },
    "B2+console":function(o){
      $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
      $('[name^=word_' + o.user_id +']').css("background-color", "#999");
      $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");
    },
    "A2+console":function(o){
      $('#visitor_' + o.user_id).css("border-color", "#4d4ddb");
      $('#visitor_' + o.user_id).css("background-color", "#ebf0fa");
      View.startCounter(o.user_id);
    },
    "B3+console":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      View.startCounter(o.user_id);
    },
    "B3+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      Commons.sketchSecondIns.resetBar();
      Commons.sketchSecondIns.doStart();
    },
    "A1+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      Commons.sketchSecondIns.doStart();
    },
    "A2+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      Commons.sketchSecondIns[o.user_id].doStart();
    },
    "mix+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      if(Settings.hasTimeCounter){
        if(Settings.commonWriting){
          Commons.sketchSecondIns.doStart();
        }else{
          Commons.sketchSecondIns[o.user_id].doStart();     
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setStopStyle = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console","mix+console"]);
  key = Commons.getCommonGenKey(key, ["A3+tv","B1+tv","B2+tv","B2_v1+tv"]);
  key = Commons.getCommonGenKey(key, ["A2+tv","C1+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");
    },
    // tv: A3 B1 B2 B2_v1
    "A3+tv":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
    },
    "B2+console":function(o){
      $('[name=word_' + o.user_id + ']').css("background-color", "#999");
      $('#visitor_' + o.user_id).css("border-color", "#f8f8f8");
    },
    "B3+console":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
      for(var x = 1; x <= 8; x++){
        for(var y = 1; y <= 12; y++){
          $(document.getElementById('glow_' + x + '_' + y)).hide();
        }
      }
      View.updateTrackButtons();
    },
    "A1+tv":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
      Commons.sketchSecondIns.doStop();
    },
    "A2+tv":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
      Commons.sketchSecondIns[o.user_id].doStop();
    },
    "B3+tv":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
      Commons.sketchSecondIns.doStop();
      for(var x = 1; x <= 8; x++){
        for(var y = 1; y <= 12; y++){
          $(document.getElementById('glow_' + x + '_' + y)).hide();
        }
      }
    },
    "mix+tv":function(o){
      $('#user_photo_' + o.user_id).removeClass("green");
      if(Settings.hasTimeCounter){
        if(Settings.commonWriting){
          Commons.sketchSecondIns.doStop();
        }else{
          Commons.sketchSecondIns[o.user_id].doStop();  
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setSubmitStyle = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console"]);
  key = Commons.getCommonGenKey(key, ["A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"]);
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      $(document.getElementById('visitor_' + o.user_id)).css("background-color", "#ff0");
    },
    // tv: A1 A2 A3 B1 B2_v1
    "A1+tv":function(o){
      $(document.getElementById('grid_' + o.user_id)).addClass("bor_g");
      $(document.getElementById('glow_' + o.user_id)).show();
    },
    // tv: B3
    // server: B3
    "B3+console":function(o){
      $(document.getElementById('glow_' + o.block.row + '_' + o.block.column)).show();
    },
    "B2+console":function(o){
      $('[name=word_' + o.cid + ']').css("background-color", "#060");
    },
    "B2+tv":function(o){
      $('#grid_' + o.cid).css("box-shadow", '0px 0px 15px 10px rgba(55, 197, 78, 1) inset');
      $("#grid_" + o.cid).css("opacity", "0");
      $('#grid_' + o.cid).css("opacity", "1");
    },
    "mix+console":function(o){
      if(o.cid){
        $('[id=word_' + o.cid + ']').css("background-color", "#060");
      }else{
        // $(document.getElementById('visitor_' + o.user_id)).css("background-color", "#ff0");
        $('[id=word_' + o.user_id + '_2_2' + ']').css("background-color", "#060");
      }
    },
    "mix+tv":function(o){
      if(o.cid){
        $('#grid_' + o.cid).css("box-shadow", '0px 0px 15px 10px rgba(55, 197, 78, 1) inset');
        $("#grid_" + o.cid).css("opacity", "0");
        $('#grid_' + o.cid).css("opacity", "1");
      }else{
        var cid = [o.user_id, 2, 2].join('_');
        $('#grid_' + cid).css("box-shadow", '0px 0px 15px 10px rgba(55, 197, 78, 1) inset');
        $("#grid_" + cid).css("opacity", "0");
        $('#grid_' + cid).css("opacity", "1");
        // $(document.getElementById('grid_' + o.user_id)).addClass("bor_g");
        // $(document.getElementById('glow_' + o.user_id)).show();
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setCancelSubmitStyle = (function(key){
  // *** server: B2 B3 no action
  // *** tv: B2 B3 no action
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console"]);
  key = Commons.getCommonGenKey(key, ["A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      // $('#origin_' + o.user_id).removeClass("canvas_box_block");
      $('#visitor_' + o.user_id).css("background-color", "");
    },
    // tv: A1 A2 A3 B1 B2_v1
    "A1+tv":function(o){
      $('#grid_' + o.user_id).removeClass("bor_g");
      $('#glow_' + o.user_id).hide();
    },
    "B2+console":function(o){
      $('[name=word_' + o.cid + ']').css("background-color", "");
    },
    "B2+tv":function(o){
      $('#grid_' + o.cid).css("box-shadow", '');
      $("#grid_" + o.cid).css("opacity", "0");
      $('#grid_' + o.cid).css("opacity", "1");
    },
    "mix+console":function(o){
      var cid = o.cid || (o.user_id + '_2_2');
      $('[id=word_' + cid + ']').css("background-color", "#999");
      // $(document.getElementById('visitor_' + o.user_id)).css("background-color", "#ff0");
    },
    "mix+tv":function(o){
      var cid = o.cid || [o.user_id, 2, 2].join('_');
      $('#grid_' + cid).css("box-shadow", '');
      $("#grid_" + cid).css("opacity", "0");
      $('#grid_' + cid).css("opacity", "1");
      // $(document.getElementById('grid_' + o.user_id)).addClass("bor_g");
      // $(document.getElementById('glow_' + o.user_id)).show();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setClearStyle = (function(key){
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console",
    "A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"
  ]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv"]);
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+client","B2+client","B3+client"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      CM('origin_' + o.user_id).clear();
    },
    // tv: B2
    // server: B2
    "B2+console":function(o){
      CM('origin_' + o.cid).clear();
    },
    // tv: B3
    // server: B3
    "B3+console":function(o){
      CM('origin_' + o.block.row + '_' + o.block.column).clear();
    },
    "A1+client":function(o){
      if(o.user_id == Settings.clientUserId){
        CM('origin_' + Settings.clientUserId).clear();
      }
    },
    "mix+console":function(o){
      var id = o.user_id,
          block = o.block,
          sr = block? block.row : 1,
          er = block? block.row : 3,
          sc = block? block.column : 1,
          ec = block? block.column : 3,
          comrc = block? ["",block.row,block.column].join('_') : "";
      for (var i = sr; i <= er; i++){
        for (var j = sc; j <= ec; j++){
          if(i == 2 || j == 2){
            CM('origin_' + id + "_" + i + "_" + j).clear();
            $('[id^=word_' + id + "_" + i + "_" + j + ']').css('opacity', 1);
          }
        }
      }
      // $("[id^=correct_button_" + id + "]").removeClass("btn-success");
      $("[name^=correct_button_" + id + "]").removeClass("btn-success");
      SocketController.receiveActionHandler({name:'stop', user_id:id});
    },
    "mix+tv":function(o){
      var id = o.user_id,
          block = o.block,
          sr = block? block.row : 1,
          er = block? block.row : 3,
          sc = block? block.column : 1,
          ec = block? block.column : 3,
          comrc = block? ["",block.row,block.column].join('_') : "";
      for (var i = sr; i <= er; i++){
        for (var j = sc; j <= ec; j++){
          if(i == 2 || j == 2){
            CM('origin_' + id + "_" + i + "_" + j).clear();
            $('[id^=grid_' + id + "_" + i + "_" + j + ']').css('opacity', 1);
          }
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setClearAllStyle = (function(key){
  // *** server: A2 B3 no action
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  key = Commons.getCommonGenKey(key, ["A3+tv","B1+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+client","B2+client","B3.client"]);
  return {
    // server: A3 B1 B2_v1
    "A3+console":function(o){
      $('[id^=yes_img_]').hide();
      Commons.gamers.all().forEach(function(id){
        CM('origin_' + id).clear();
        $('#visitor_' + id).css("background-color", "#ebf0fa");
        $("#correct_button_" + id).removeClass("btn-success");
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
    },
    // server: A1
    "A1+console":function(o){
      $('[id^=yes_img_]').hide();
      $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
      Commons.gamers.all().forEach(function(id){
        CM('origin_' + id).clear();
        $('#visitor_' + id).css("background-color", "#ebf0fa");
        $("#correct_button_" + id).removeClass("btn-success");
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
    },
    "B2+console":function(o){
      $('[id^=yes_img_]').hide();
      Commons.gamers.all().forEach(function(id){
        $('[name^=word_' + id +']').css("background-color", "#999");
        for (var i = 1; i <= 3; i++){
          for (var j = 1; j <= 3; j++){
            CM('origin_' + id + "_" + i + "_" + j).clear();
            $("[name^=correct_button_" + id + "_" + i + "_" + j + "]").removeClass("btn-success");
          }
        }
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
    },
    "mix+console":function(o){
      $('[id^=yes_img_]').hide();
      $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
      Commons.gamers.all().forEach(function(id){
        $('#visitor_' + id).css("background-color", "#ebf0fa");
        for (var i = 1; i <= 3; i++){
          for (var j = 1; j <= 3; j++){
            if(i == 2 || j == 2){
              CM('origin_' + id + "_" + i + "_" + j).clear();
              SocketController.receiveCancelSubmitHandler({user_id:id, cid:id + "_" + i + "_" + j});
              // $("[id^=correct_button_" + id + "_" + i + "_" + j + "]").removeClass("btn-success");
            }
          }
        }
        $('[id^=word_' + id + ']').css('opacity', 1);
        $("[name^=correct_button_" + id + "]").removeClass("btn-success");
        // $("[id^=correct_button_" + id + "]").removeClass("btn-success");
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
    },
    "B2+tv":function(o){
      $('[id^=yes_img_]').hide();
      Commons.gamers.all().forEach(function(id){
        for (var i = 1; i <=3; i++){
          for (var j = 1; j <= 3; j++){
            var cid = id + "_" + i + "_" + j;
            CM('origin_' + cid).clear();
            $('#glow_' + cid).hide();
            $('#grid_' + cid).css("box-shadow", '');
            $("#grid_" + cid).css("opacity", "0");
            $('#grid_' + cid).css("opacity", "1");
          }
        }
        View.setStopStyle({user_id:id});
      });
    },
    "A1+tv":function(o){
      $('[id^=yes_img_]').hide();
      Commons.gamers.all().forEach(function(id){
        CM('origin_' + id).clear();
        SocketController.receiveCancelSubmitHandler({user_id:id});
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
      Commons.sketchSecondIns.resetBar();
    },
    // tv: A3 B1
    "A3+tv":function(o){
      $('[id^=yes_img_]').hide();
  //$('[id^=answer_correct_]').text("?").css("color","");
      Commons.gamers.all().forEach(function(id){
        CM('origin_'+id).clear();
        SocketController.receiveCancelSubmitHandler({user_id:id});
        SocketController.receiveActionHandler({name:'stop', user_id:id});
      });
    },
    "mix+tv":function(o){
      $('[id^=yes_img_]').hide();
      $('[id^=grid_]').css('opacity', 1);
      Commons.gamers.all().forEach(function(id){
        for (var i = 1; i <= 3; i++){
          for (var j = 1; j <= 3; j++){
            if(i == 2 || j == 2){
              CM('origin_' + id + "_" + i + "_" + j).clear();
              SocketController.receiveCancelSubmitHandler({user_id:id, cid:id + "_" + i + "_" + j});
              SocketController.receiveActionHandler({name:'stop', user_id:id});

            }
          }
        }
        $('[id^=_zoomTmp_' + id + ']').parent().css('opacity', 1);
      });
      SocketController.receiveResetHandler({second:window.timeRemaining});
    },
    // client A1 A2 A3 B1 B2
    "A1+client":function(o){
      CM('origin_' + Settings.clientUserId).clear();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setRightStyle = (function(key){
  // *** server: B3 no action
  // *** tv: B3 no action
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console",
    "A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"
  ]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv","mix+console","mix+tv" ]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      $("#yes_img_" + o.user_id).show();
    },
    // server: B2
    // tv: B2
    "B2+console":function(o){
      $("#yes_img_" + o.user_id + "_" + o.block.row + "_" + o.block.column).show();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setRemoveOStyle = (function(key){
  // *** server: B3 no action
  // *** tv: B3 no action
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console",
    "A1+tv","A2+tv","A3+tv","B1+tv","B2_v1+tv","C1+tv"
  ]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv","mix+console","mix+tv"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      $('#yes_img_' + o.user_id).hide();
    },
    // server: B2
    // tv: B2
    "B2+console":function(o){
      $("#yes_img_" + o.cid).hide();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setCorrectCountStyle = (function(key){
  // *** server: B3 no action
  // *** tv: A2 B3 no action
  key = Commons.getCommonGenKey(key, ["A1+console","A3+console","B1+console"]);
  key = Commons.getCommonGenKey(key, ["A2+tv","A3+tv"]);
  return {
    // server: A1 A3 B1
    "A1+console":function(o){
      $("#correct_button_" + o.user_id).addClass("btn-success");
      if (Settings.hasCorrectCounting){
        $("#no_correct_" + o.user_id).text(o.count + "題");
      }
    },
    // server: A2
    "A2+console":function(o){
      $("#no_correct_" + o.user_id).text(o.count + "題");
    },
    // server: B2_v1
    "B2_v1+console":function(o){
      if (Settings.hasCorrectCounting){
        $("#no_correct_" + o.user_id).text(o.count + "題");
      }
    },
    // server: B2
    "B2+console":function(o){
      if ($("[name^=correct_button_" + o.cid + "]").hasClass("btn-success")) {
        $("[name^=correct_button_" + o.cid + "]").removeClass("btn-success");
      }
      else $("[name^=correct_button_" + o.cid + "]").addClass("btn-success");
      $("#no_correct_" + o.user_id).text(o.count + "題");
    },
    "mix+console":function(o){
      var current = o.count;
      if(Settings.commonWriting){
        if(!Settings.hasCorrectCounting || current > parseInt($("#no_correct_" + o.user_id).text())){
          $("#correct_button_" + o.user_id).addClass("btn-success");
        } 
      }
      if (Settings.hasCorrectCounting){
        if ($("[name^=correct_button_" + o.cid + "]").hasClass("btn-success")) {
          $("[name^=correct_button_" + o.cid + "]").removeClass("btn-success");
        }
        else $("[name^=correct_button_" + o.cid + "]").addClass("btn-success");
        $("#no_correct_" + o.user_id).text(o.count + "題");
        // $("#no_correct_" + o.user_id).text(o.count + "題");
      }
    },
    // tv: A2 A3
    "A2+tv":function(o){
      $("#no_correct_" + o.user_id).css('opacity', 1);
      $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', 'black');
    },
    "C1+tv":function(o){
      $("#no_correct_" + o.user_id).css('opacity', 1);
      $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', '#feeb09');
    },
    // tv: B1
    "B1+tv":function(o){
      if (Settings.hasCorrectCounting){
        $("#no_correct_" + o.user_id).show();
        $("#no_correct_" + o.user_id).css('opacity', 1);
        $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', 'black');
      }
    },
    // tv: B2
    "B2+tv":function(o){
      $("#no_correct_" + o.user_id).css('opacity', 1);
    },
    "mix+tv":function(o){
      if(!Settings.commonWriting){
        if(Settings.hasCorrectCounting){
          $("#no_correct_" + o.user_id).show();
          $("#no_correct_" + o.user_id).css('opacity', 1);
          $("#no_correct_" + o.user_id).text(o.count).css('opacity', 1).css('color', 'black');
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setShowCorrectUsersStyle = (function(key){
  // *** server: A2 A3 B1 B2_v1 B3 no actions.
  // *** tv: A2 A3 B1 B2_v1 B3 no actions.
  key = Commons.getCommonGenKey(key, ["A1+console"]);
  key = Commons.getCommonGenKey(key, ["B2+console","B2+tv","mix+console","mix+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+tv"]);
  return {
    // server: A1
    "A1+console":function(o){
      if(o && o.length){
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
    },
    // tv: A1
    "A1+tv":function(o){
      if(o && o.length){
        o.sort(function(a,b) {
          return parseInt(a) - parseInt(b);
        });
        for (var i in o) {
          setTimeout( (function(id){
            return function() {
              View.setRightStyle({user_id:id});
              if(Settings.hasCorrectCounting){
                var c = Commons.tempcount[id] || 0;
                $("#no_correct_" + id).text(c).css('opacity', (c)? 1 : 0).css('color', 'black');
              }
            }
          })(o[i]), 800 * i);
        }
      }else{
        if(Settings.hasCorrectCounting){
          Commons.gamers.all().forEach(function(id){
            var c = Commons.tempcount[id] || 0;
            $("#no_correct_" + id).text(c).css('opacity', (c)? 1 : 0).css('color', 'black');
          });
        }
      }
    },
    // server: B2
    // tv: B2
    "B2+console":function(o){
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
              $("#no_correct_" + uid).text(Commons.tempcount[uid]).css('opacity', 1).css("color", "black");
            }
          })(i), 600 * total);
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setUserOutStyle = (function(key){
  // *** server: B2 B3 no action
  // *** tv: B2 B3 no action
  key = Commons.getCommonGenKey(key, ["A1+console","A3+console","B1+console","B2_v1+console"]);
  key = Commons.getCommonGenKey(key, ["A1+tv","A3+tv","B1+tv","B2_v1+tv"]);
  return {
    // server: A1 A3 B1 B2_v1
    "A1+console":function(o){
      var user_id = o.user_id;
      CM.unreg('origin_' + user_id);
      $("#correct_button_" + user_id).attr("disabled", true);
      $("#out_button_" + user_id).attr("disabled", true);
      $("#start_button_" + user_id).attr("disabled", true);
      $("#stop_button_" + user_id).attr("disabled", true);
      $("#zoom_button_" + user_id).attr("disabled", true);
      $('#visitor_' + user_id).attr('style','opacity:0.2;border:3px solid #f8f8f8');
      
    },
    // tv: A1 A3 B1 B2_v1
    "A1+tv":function(o){
      $('#out_' + o.user_id).show();
      $('#black_' + o.user_id).show();
    },
    // server: A2
    "A2+console":function(o){
      var user_id = o.user_id;
      CM.unreg('origin_' + user_id);
      $("#correct_button_" + user_id).attr("disabled", true);
      $("#out_button_" + user_id).attr("disabled", true);
      $("#start_button_" + user_id).attr("disabled", true);
      $("#stop_button_" + user_id).attr("disabled", true);
      $("#zoom_button_" + user_id).attr("disabled", true);
      $("#continue_" + user_id).attr("disabled", true);
      $("#remove_O_button_" + user_id).attr("disabled", true);
      $("#remove_writing_button_" + user_id).attr("disabled", true);
      $('#visitor_' + user_id).attr('style','opacity:0.2;border:4px solid #f8f8f8');
    },
    "mix+console":function(o){
      var user_id = o.user_id;
      for (var i = 1; i <= 3; i++){
        for (var j = 1; j <= 3; j++){
          if(i == 2 || j == 2){
            CM.unreg('origin_' + user_id + "_" + i + "_" + j);
          }
        }
      }
      $("#correct_button_" + user_id).attr("disabled", true);
      $("#out_button_" + user_id).attr("disabled", true);
      $("#start_button_" + user_id).attr("disabled", true);
      $("#stop_button_" + user_id).attr("disabled", true);
      $("#zoom_button_" + user_id).attr("disabled", true);
      $("#continue_" + user_id).attr("disabled", true);
      $("#remove_O_button_" + user_id).attr("disabled", true);
      $("#remove_writing_button_" + user_id).attr("disabled", true);
      $('#visitor_' + user_id).attr('style','opacity:0.2;border:3px solid #f8f8f8');
    },
    // tv: A2
    "A2+tv":function(o){
      $('#out_' + o.user_id).show();
      $('#black_' + o.user_id).show();
      Commons.sketchSecondIns[o.user_id].clearBar();
    },
    "C1+tv":function(o){
      $('#out_' + o.user_id).show();
      $('#black_' + o.user_id).show();
      Commons.sketchSecondIns[o.user_id].clearBar();
    },
    "mix+tv":function(o){
      $('#out_' + o.user_id).show();
      $('#black_' + o.user_id).show();
      if(Settings.hasTimeCounter && !Settings.commonWriting)
        Commons.sketchSecondIns[o.user_id].clearBar();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setResetStyle = (function(key){
  // *** server: A3 B1 B2_v1 B2 B3 no action
  // *** tv: A3 B1 B2_v1 B2 B3 no action
  key = Commons.getCommonGenKey(key, ["A2+tv","C1+tv"]);
  return {
    // server: A1
    "A1+console":function(o){
      if (o.second != null) {
        // resetSetStyle(o.second);
        $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
        // console.log(Commons.timeRemaining);
        $('#second').text(Commons.timeRemaining);
      }
    },
    // server: A2
    "A2+console":function(o){
      if (o.second != null) {
        Commons.gamers.all().forEach(function(id){
          $('#second_' + id).text(o.second + "秒");
        });
      }
    },
    "mix+console":function(o){
      if(o.second){
        if(Settings.commonWriting){
          $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
          $('#second').text(Commons.timeRemaining);
        }else{
          Commons.gamers.all().forEach(function(id){
            $('#second_' + id).text(o.second + "秒");
          });
        }
      }
    },
    // tv: A1
    "A1+tv":function(o){
      Commons.sketchSecondIns.resetBar();
      Commons.sketchSecondIns.setSecond(parseInt(o.second));
    },
    // tv: A2
    "A2+tv":function(o){
      if (o.second != null) {
        Commons.gamers.all().forEach(function(id){
          // $('#second_' + id).text(o.second + "秒");
          Commons.sketchSecondIns[id].resetBar();
          Commons.sketchSecondIns[id].setSecond(parseInt(o.second));
        });
      }
    },
    "mix+tv":function(o){
      if(o.second){
        if(Settings.commonWriting){
          Commons.sketchSecondIns.resetBar();
          Commons.sketchSecondIns.setSecond(parseInt(o.second));
        }else{ 
          Commons.gamers.all().forEach(function(id){
            Commons.sketchSecondIns[id].resetBar();
            Commons.sketchSecondIns[id].setSecond(parseInt(o.second));
          });
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setIsConnectedStyle = (function(key){
  // *** tv: all stages no action
  // *** server: B3 no action
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console","B2+console","mix+console"
  ]);
  return {
    // server: A1 A2 A3 B1 B2_v1 B2
    "A1+console":function(o){
      var x = o.check_id;
      if (o.connected){
        $('#status_' + x).attr('class','label label-success').text("OnLine");
      }else{
        $('#status_' + x).attr('class','label label-danger').text("OffLine");
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setClientConnectedStyle = (function(key){
  // *** tv: all stages no action
  // *** server: B3 no action
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console","B2+console","mix+console"
  ]);
  return {
    // server: A1 A2 A3 B1 B2_v1 B2
    "A1+console":function(o){
      for(var x in o) {
        View.setIsConnectedStyle({check_id:x, connected:o[x] });
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setMoveBlockStyle = (function(key){
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  // *** tv: A1 A2 A3 B1 B2_v1 no action
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    // server: B3
    // tv: B3
    "B3+console":function(o){
      $('#glow_' + o.block.row + '_' + o.block.column).hide();
      // set color
      CM('origin_' + o.block.row + '_' + o.block.column).color(o.color);
    },
    // tv: B2
    "B2+tv":function(o){
      $('#glow_' + o.cid).hide();
      $('#grid_' + o.cid).css("box-shadow", '');
      $("#grid_" + o.cid).css("opacity", "0");
      $('#grid_' + o.cid).css("opacity", "1");
    },
    "mix+console":function(o){
      $('[id=word_' + o.cid + ']').css("background-color", "#999");
    },
    "mix+tv":function(o){
      $('#grid_' + o.cid).css("box-shadow", '');
      $("#grid_" + o.cid).css("opacity", "0");
      $('#grid_' + o.cid).css("opacity", "1");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setSendTextStyle = (function(key){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  key = Commons.getCommonGenKey(key, ["mix+console","mix+tv"]);
  return {
    // server: B3
    // tv: B3
    "B3+console":function(o){
      var testCan = document.getElementById('origin_'+ o.block.row +'_' + o.block.column);
      var w = $(testCan).width();
      var context = testCan.getContext("2d");
      context.fillStyle = o.color || "#ececec";
      //context.font = "bold " + (w * 13 / 15) + "px 標楷體";
      context.font = (w * 13 / 15) + "px Sans-serif";
      context.fillText(o.text, w / 15, w * 12 / 15);
    },
    "mix+console":function(o){
      var r = o.block.row,
          c = o.block.column;
      Commons.gamers.all().forEach(function(id){
        if(o.text.toLowerCase() == 'x'){
          $('[id^=word_' + [id, r, c].join('_') + ']').css('opacity', 0);
          $('[id^=grid_' + [id, r, c].join('_') + ']').css('opacity', 0);
          $('[id^=_zoomTmp_' + [r, c].join('_') + ']').parent().css('opacity', 0);
          // hide()
        }else{
          CM(['origin',id, r, c].join('_')).text(o.text);
        }
      });
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// *** server: all stages are no action
// *** tv: all stages are no action
View.setEndRoundStyle = Commons.emptyFn;

View.setRewriteStyle = (function(key){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  key = Commons.getCommonGenKey(key, ["B3+console","B3+tv"]);
  return {
    // server: B3
    // tv: B3
    "B3+console":function(o){
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
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setContinueWriteStyle = (function(key){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  return {
    "B3+console":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      View.startCounter(o.user_id);
    },
    "B3+tv":function(o){
      $('#user_photo_' + o.user_id).addClass("green");
      Commons.sketchSecondIns.doStart();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);


View.setZoomStyle = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+tv", "A2+tv", "A3+tv", "B1+tv", "B2_v1+tv", "C1+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console","mix+console"]);
  return {
    "A1+tv":function(o){
      CM('origin_' + o.user_id).zoomTo('_zoomTmp');
      /*
      $('.Zoom').fadeIn('slow').animate({
        duration: 'slow',
        queue: false,
        complete: function() {}
      });
      */
      $('.Zoom').show();
    },
    "A1+console":function(o){
      $('[id^=zoom_button_]').attr('disabled',true).css('opacity',0.3);
      $('#zoom_button_'+o.user_id).attr('disabled',false).attr('zoom', 1).css('opacity',1).text("復原");
    },
    "mix+tv":function(o){
      for (var i = 1; i <= 3; i++){
        for (var j = 1; j <= 3; j++) {
          if(i == 2 || j == 2)
            CM('origin_' + o.user_id + "_" + i + "_" + j).zoomTo('_zoomTmp' + "_" + i + "_" + j);
        }
      }
      /*
      $('.Zoom').fadeIn('slow').animate({
        duration: 'slow',
        queue: false,
        complete: function() {}
      });
      */
      $('.Zoom').show();
      $('.container > table').css('-webkit-filter', 'blur(8px)');
      $('.Content').css('-webkit-filter', 'blur(8px)');
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.setUnZoomStyle = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+tv", "A2+tv", "A3+tv", "B1+tv", "B2_v1+tv","C1+tv"]);
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console","mix+console"]);
  return {
    "A1+tv":function(o){
      $('.Zoom').hide();
       CM('origin_' + o.user_id).unZoom('_zoomTmp');
      /*
      $('.Zoom').fadeOut('slow').animate({
          duration: 'slow',
          queue: false,
          complete: function() {
            CM('origin_' + o.user_id).unZoom('_zoomTmp');
          }
      });
      */
    },
    "A1+console":function(o){
      $('[id^=zoom_button_]').attr('disabled',false).css('opacity', 1);
      $('#zoom_button_'+o.user_id).attr('zoom', 0).text("放大");
    },
    "mix+tv":function(o){
      $('.Zoom').hide();
      $('.container > table').css('-webkit-filter', '');
      $('.Content').css('-webkit-filter', '');
      for (var i = 1; i <= 3; i++){
              for (var j = 1; j <= 3; j++) {
                if(i == 2 || j == 2)
                  CM('origin_' + o.user_id + "_" + i + "_" + j).unZoom('_zoomTmp' + "_" + i + "_" + j);
              }
            }
      /*
      $('.Zoom').fadeOut('slow').animate({
          duration: 'slow',
          queue: false,
          complete: function() {
            for (var i = 1; i <= 3; i++){
              for (var j = 1; j <= 3; j++) {
                if(i == 2 || j == 2)
                  CM('origin_' + o.user_id + "_" + i + "_" + j).unZoom('_zoomTmp' + "_" + i + "_" + j);
              }
            }
          }
      });
      */
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// ======= Event Trigger on View (JQuery click handler) =======
View.onContinueWriteClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1 A3 B1 B2_v1
    "A1+console":function(){
      var id = this.value;
      SocketController.triggerContinueWrite({user_id: id, has_track: CM('origin_' + id).hasTrack()});
      SocketController.triggerCancelSubmit({user_id: id});
      View.setStartStyle({user_id: id});
    },
    "A2+console":function(){
      var id = this.value;
      SocketController.triggerContinueWrite({user_id: id, has_track: CM('origin_' + id).hasTrack()});
      SocketController.triggerAction({action:'start', user_id: id});
      SocketController.triggerCancelSubmit({user_id: id});
    },
    "B2+console":function(){
      SocketController.triggerContinueWrite({user_id: this.value},"B2.");
      SocketController.triggerCancelSubmit({user_id: this.value},"B2.");
    },
    "B3+console":function(){
      SocketController.triggerContinueWrite({user_id: this.value},"idioms.");
    },
    "mix+console":function(){
      var id = this.value;
      SocketController.triggerContinueWrite({user_id: id},"mix.");
      SocketController.triggerCancelSubmit({user_id: id});
      if(Settings.commonWriting) View.setStartStyle({user_id: id});
      else SocketController.triggerAction({action:'start', user_id: id}, "mix.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onClearClick = (function(key){
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console"
  ]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(){
      SocketController.triggerClear({user_id:this.value});
    },
    // server: B2
    "B2+console":function(){
      var uid = this.value;
      Commons.fromServerCommand = true;
      for (var i = 1; i <= 3; i++){
        for (var j = 1; j <= 3; j++) {
          SocketController.triggerClear({user_id:uid, block:{row:i, column:j } },"B2.");
        }
      }
    },
    "mix+console":function(){
      SocketController.triggerClear({user_id:this.value},"mix.");
    },
    "A1+client":function(){
      SocketController.triggerClear({user_id:Settings.clientUserId, stamp: (new Date()).getTime() });
      CM('origin_'+ Settings.clientUserId).clear();
    },
    "B2+client":function(){
      SocketController.triggerClear({
        user_id:Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        },
        stamp: (new Date()).getTime()
      },"B2.");
      CM('origin_'+ Settings.clientUserId).clear();
    },
    "B3+client":function(){
      SocketController.triggerClear({
        user_id:Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        },
        stamp: (new Date()).getTime()
      },"idioms.");
      CM('origin_'+ Settings.clientUserId).clear();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onClearAllClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A3 B1 B2_v1 B2
    "A3+console":function(){
      SocketController.triggerClearAll({});
      Commons.correct_users = null;
    },
    // server: A1
    "A1+console":function(){
      SocketController.triggerClearAll({});
      Commons.correct_users = null;
      clearInterval(Commons.alarm);
      Commons.alarm = null;
      SocketController.triggerReset({second: Commons.timeRemaining});
    },
    "B2+console":function(){
      SocketController.triggerClearAll({},"B2.");
      Commons.correct_users = null;
    },
    "mix+console":function(){
      SocketController.triggerClearAll({});
      Commons.correct_users = null;
      if(Settings.hasTimeCounter){
        if(Settings.commonWriting){
          clearInterval(Commons.alarm);
          Commons.alarm = null;
        }else{
          Commons.gamers.all().forEach( function(id) {
            clearInterval(Commons.alarm[id]);
            Commons.alarm[id] = null;
          });
        }
        SocketController.triggerReset({second: Commons.timeRemaining});
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onClearBlockClick = (function(key){
  return {
    // server: B2
    "B2+console":function(){
      var val = this.value.split(',');
      var uid = val.shift();
      var xy = val;
      var block = { row: xy[0], column:xy[1] };
      Commons.fromServerCommand = true;
      SocketController.triggerClear({user_id:uid, block:block },"B2.");
    },
    "B3+console":function(){
      var xy = this.value.split(',');
      var block = { row: xy[0], column:xy[1] };
      Commons.fromServerCommand = true;
      SocketController.triggerClear({user_id: Settings.consoleUserId, block:block },"idioms.");
    },
    "mix+console":function(){
      var val = this.value.split(',');
      var uid = val.shift();
      var xy = val;
      var block = { row: xy[0], column:xy[1] };
      Commons.fromServerCommand = true;
      SocketController.triggerClear({user_id:uid, block:block },"mix.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onOutClick = (function(key){
  key = Commons.getCommonGenKey(key, [
    "A1+console","A2+console","A3+console","B1+console","B2_v1+console","mix+console"
  ]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(){
      SocketController.triggerUserOut({user_id:this.value});
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onStartClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A2+console","A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1
    "A1+console":function(){
      SocketController.triggerAction({action:'start', user_id: this.value});
      View.startCounter();
    },
    // server: A2 A3 B1 B2_v1
    "A2+console":function(){
      SocketController.triggerAction({action:'start', user_id: this.value});
    },
    "B2+console":function(){
      SocketController.triggerAction({action:'start', user_id: this.value},"B2.");
    },
    "B3+console":function(){
      $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
      SocketController.triggerAction({action:'start', user_id: this.value},"idioms.");
    },
    "mix+console":function(){
      SocketController.triggerAction({action:'start', user_id: this.value},"mix.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onStartAllClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1
    "A1+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'start', user_id: id});
      });
      View.startCounter();
    },
    // server: A3 B1 B2_v1
    "A3+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'start', user_id: id});
      });
    },
    "B2+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'start', user_id: id},"B2.");
      });
    },
    "mix+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'start', user_id: id},"mix.");
      });
      View.startCounter();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onStopClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1
    "A1+console":function(){
      // clearInterval(Commons.alarm);
      // Commons.alarm = null;
      SocketController.triggerAction({action:'stop', user_id: this.value});
      // View.setStopStyle({user_id:this.value});
      SocketController.triggerCancelSubmit({user_id: this.value});
    },
    // server: A2
    "A2+console":function(){
      SocketController.triggerAction({action:'stop', user_id: this.value});
      SocketController.triggerCancelSubmit({user_id: this.value});
    },
    // server A3 B1 B2_v1
    "A3+console":function(){
      SocketController.triggerAction({action:'stop', user_id: this.value});
      View.setStopStyle({user_id:this.value});
    },
    "B2+console":function(){
      SocketController.triggerAction({action:'stop', user_id: this.value},"B2.");
      View.setStopStyle({user_id:this.value});
    },
    "B3+console":function(){
      SocketController.triggerAction({action:'stop', user_id: this.value},"idioms.");
    },
    "mix+console":function(){
      SocketController.triggerAction({action:'stop', user_id: this.value},"mix.");
      SocketController.triggerCancelSubmit({user_id: this.value});
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onStopAllClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1
    "A1+console":function(){
      if (!Commons.alarm) return;
      clearInterval(Commons.alarm);
      Commons.alarm = null;
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'stop', user_id: id});
        View.setStopStyle({user_id:id});
      });
    },
    // server: A2
    "A2+console":function(){
       if (!Commons.alarm) return;
       Commons.gamers.all().forEach( function(id) {
          clearInterval(Commons.alarm[id]);
          Commons.alarm[id] = null;
          SocketController.triggerAction({action:'stop', user_id: id});
          SocketController.triggerCancelSubmit({user_id: id});
          View.setStopStyle({user_id:id});
      });
    },
    // server A3 B1 B2_v1
    "A3+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'stop', user_id: id});
        View.setStopStyle({user_id:id});
      });
    },
    "B2+console":function(){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'stop', user_id: id},"B2.");
        View.setStopStyle({user_id:id});
      });
    },
    "mix+console":function(){
      if(Settings.hasTimeCounter){
        if (!Commons.alarm) return;
        clearInterval(Commons.alarm);
        Commons.alarm = null;
      }
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'stop', user_id: id},"mix.");
        View.setStopStyle({user_id:id});
      });
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onCorrectClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A2+console","A3+console","B2_v1+console"]);
  return {
    // server: B1
    "B1+console":function(){
      SocketController.triggerRight({user_id:this.value});
      var current_correct_count = 0;
      if(Settings.hasCorrectCounting){
        current_correct_count = View.addCorrectCount(this.value);
      }
      SocketController.triggerSetCorrectCount({user_id:this.value,count:current_correct_count});
      SocketController.triggerAction({action:'stop',user_id:this.value});
    },
    // server: A2 A3 B2_v1
    "A2+console":function(){
      SocketController.triggerRight({user_id:this.value});
      SocketController.triggerSetCorrectCount({user_id:this.value,count:View.addCorrectCount(this.value)});
      SocketController.triggerAction({action:'stop',user_id:this.value});
    },
    // server: A1
    "A1+console":function(){
      if (!Commons.correct_users) Commons.correct_users = [];
      if (Commons.correct_users.indexOf(this.value) == -1)
        Commons.correct_users.push(this.value);
      var current_correct_count = 0;
      if (Settings.hasCorrectCounting){
        current_correct_count = View.addCorrectCount(this.value);
      }
      SocketController.triggerSetCorrectCount({user_id:this.value,count:current_correct_count});
      //SocketController.triggerAction({action:'stop',user_id:this.value});
    },
    "B2+console":function(){
      var val = this.value.split(",");
      var uid = val.shift();
      var xy  = val;
      var block = { row: xy[0], column:xy[1] };

      if (!Commons.correct_users) Commons.correct_users = [];
      if (!Commons.correct_users[uid]) Commons.correct_users[uid] = [];
      if (Commons.inArray(Commons.correct_users[uid], block)) return;

      Commons.correct_users[uid].push(block);

      SocketController.triggerSetCorrectCount({
        user_id: uid,
        block: block,
        count: View.addCorrectCount(uid, 1)
      }, "B2.");
    },
    "mix+console":function(){
      var current_correct_count = 0;
      // if(Settings.hasCorrectCounting){
      //   current_correct_count = View.addCorrectCount(this.value);
      // }
      var val = this.value.split(",");
      var uid = val.shift();
      var xy  = val;
      var block = { row: xy[0], column:xy[1] };

      if(Settings.commonWriting){
        if (!Commons.correct_users) Commons.correct_users = [];
        if (!Commons.correct_users[uid]) Commons.correct_users[uid] = [];
        if (Commons.inArray(Commons.correct_users[uid], block)) return;
        // if (Commons.correct_users.indexOf(this.value) != -1) return;
        // Commons.correct_users.push(this.value);
        Commons.correct_users[uid].push(block);
      }else{
        SocketController.triggerRight({user_id:uid,block:block});
      }
      if(Settings.hasCorrectCounting){
        current_correct_count = View.addCorrectCount(uid);
        SocketController.triggerSetCorrectCount({
          user_id: uid,
          block: block,
          count: current_correct_count
        }, "mix.");
      }
      // SocketController.triggerSetCorrectCount({user_id:this.value,count:current_correct_count});
      //SocketController.triggerAction({action:'stop',user_id:this.value}, "mix.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onRemoveOClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    "A1+console":function(){
      SocketController.triggerRemoveO({user_id:this.value});
    },
    "B2+console":function(){
      var val = this.value.split(',');
      var uid = val.shift();
      var xy = val;
      var block = { row: xy[0], column:xy[1] };
      Commons.fromServerCommand = true;
      SocketController.triggerRemoveO({user_id: uid, block: block},"B2.");
      if (Commons.inArray(Commons.correct_users[uid], block)) {
        Commons.correct_users[uid].splice(Commons.indexOfBlock(Commons.correct_users[uid], block), 1);
        SocketController.triggerSetCorrectCount({
          user_id: uid,
          block: block,
          count: View.addCorrectCount(uid, -1)
        }, "B2.");
      }
    },
    "mix+console":function(){
      var val = this.value.split(',');
      var uid = val.shift();
      var xy = val;
      var block = { row: xy[0], column:xy[1] };
      Commons.fromServerCommand = true;
      SocketController.triggerRemoveO({user_id: uid, block: block},"mix.");
      if (Commons.inArray(Commons.correct_users[uid], block)) {
        Commons.correct_users[uid].splice(Commons.indexOfBlock(Commons.correct_users[uid], block), 1);
        SocketController.triggerSetCorrectCount({
          user_id: uid,
          block: block,
          count: View.addCorrectCount(uid, -1)
        }, "mix.");
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onRemoveAllOClick = (function(key){
  return {
    "B2+console":function(){
      var uid = this.value;
      for (var i = 1; i <= 3; i++){
        for (var j = 1; j <= 3; j++) {
          SocketController.triggerRemoveO({user_id: uid, block: { row: i , column: j } },"B2.");
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onMinusOneClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A3+console","B1+console","B2_v1+console","mix+console"]);
  return {
    // server: A1 A3 B1 B2_v1
    "A1+console":function(){
      SocketController.triggerSetCorrectCount({user_id:this.value, count:View.addCorrectCount(this.value,-1)});
    },
    "B2+console":function(){
      SocketController.triggerSetCorrectCount({
        user_id: this.value,
        block: {},
        count: View.addCorrectCount(this.value, -1)
      }, "B2.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onShowCorrectClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","mix+console"]);
  return {
    // server: A1
    "A1+console":function(){
      SocketController.triggerShowCorrectUsers(Commons.correct_users);
    },
    "B2+console":function(){
      SocketController.triggerShowCorrectUsers(Commons.correct_users,"B2.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onSecondUpdateClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","mix+console"]);
  return {
    // server: A1
    "A1+console":function(){
      Commons.timeRemaining = parseInt($('#secondInput').val());
      SocketController.triggerReset({second:Commons.timeRemaining});
      // $.post('/games/set_game_data.json?second=' + Commons.timeRemaining,
      //   function(data){            
      //     //var res = JSON.parse(data);
      //     console.log("update second:" + JSON.stringify(data));
      //   }
      // ).fail(function(e){
      //   console.log('error' + JSON.stringify(e));
      // });
      View.setGameCurrentInfo();
    },
    // server: A2
    "A2+console":function(){
      SocketController.triggerReset({second:Commons.timeRemaining});
      // $.post('/games/set_game_data.json?second=' + Commons.timeRemaining,
      //   function(data){            
      //     //var res = JSON.parse(data);
      //     console.log("update second:" + JSON.stringify(data));
      //   }
      // ).fail(function(e){
      //   console.log('error' + JSON.stringify(e));
      // });
      View.setGameCurrentInfo();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onNextQuestionClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A3+console","B1+console","B2_v1+console"]);
  return {
    // server: A1
    "A1+console":function(){
      Commons.correct_users = null;
      SocketController.triggerClearAll({});
      Commons.gamers.all().forEach( function(id) {
        SocketController.triggerAction({action:'stop',user_id:id});
      });
      SocketController.triggerReset({second:Commons.timeRemaining});
    },
    "A2+console":function(){
      // stop last user
      if (Commons.gamers.prev() != null) {
        var id = Commons.gamers.prev();
        SocketController.triggerAction({action:'stop',user_id:id});
        SocketController.triggerCancelSubmit({user_id: id});
      }
      var newgamer = Commons.gamers.next();

      SocketController.triggerReset({second: Commons.timeRemaining});
      SocketController.triggerRemoveO({user_id:newgamer});
      SocketController.triggerClear({user_id:newgamer});
      SocketController.triggerAction({action:'start',user_id:newgamer});

    },
    "mix+console":function(){
      if(Settings.commonWriting){
        Commons.correct_users = null;
        SocketController.triggerClearAll({});
        Commons.gamers.all().forEach( function(id) {
          SocketController.triggerAction({action:'stop',user_id:id},"mix.");
        });
        SocketController.triggerReset({second:Commons.timeRemaining});
      }else{
        if (Commons.gamers.prev() != null) {
          var id = Commons.gamers.prev();
          SocketController.triggerAction({action:'stop',user_id:id},"mix.");
          SocketController.triggerCancelSubmit({user_id: id});
        }
        var newgamer = Commons.gamers.next();
        SocketController.triggerReset({second: Commons.timeRemaining});
        SocketController.triggerRemoveO({user_id:newgamer});
        SocketController.triggerClear({user_id:newgamer}, "mix.");
        SocketController.triggerAction({action:'start',user_id:newgamer},"mix.");
      }
    },
    // server A3 B1 B2_v1
    "A3+console":function(){
      Commons.correct_users = null;
      SocketController.triggerClearAll({});
      Commons.gamers.all().forEach( function(id) {
        SocketController.triggerAction({action:'stop',user_id:id});
      });
    },
    "B2+console":function(){
      Commons.correct_users = null;
      SocketController.triggerClearAll({},"B2.");
      View.onStopAllClick.call(this);
    },
    "B3+console":function(){
        // stop last user
      if (Commons.gamers.prev() != null) {
        SocketController.triggerAction({action:'stop', user_id:Commons.gamers.prev() }, "idioms.");
      }
      $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%").text(Commons.timeRemaining+"s");
      SocketController.triggerAction({action:'start',user_id:Commons.gamers.next()}, "idioms.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onColorSelectorClick = (function(key){
  return {
    "B3+console":function(){
      var user_id = this.getAttribute('value'),
          color = $(this).css('background-color'),
          rgbaReg = new RegExp("(rgb|rgba)\\((.*)\\)");
      
      $('.color-selector[value="' + user_id + '"]').removeClass('color-selector-border');
      $(this).addClass('color-selector-border');

      if(rgbaReg.test(color)){
        var matches = color.match(rgbaReg);
        var type = matches[1];  // rgb rbga
        var colors = matches[2].split(',').map(function(val){return parseInt(val.trim());});
        color = "#" + colors[0].toString(16) + colors[1].toString(16) + colors[2].toString(16);
      }

      SocketController.triggerChangeColor({user_id:user_id, color: color}, "idioms.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onShowTextClick = (function(key){
  return {
    "B3+console":function(){
      var row = parseInt($('#row').val());
      var originCol = $('#column').val();
      var col = parseInt(originCol);
      var columnArray = ['a','b','c','d','e','f','g','h','i','j','k','l'];
      if(isNaN(col)){
        var idx = columnArray.indexOf(originCol.toLowerCase());
        if(idx != -1){
          col = (idx + 1).toString();
        }
      }
      var text = $('#showText').val();
      var block = {row: row, column: col};
      Commons.fromServerCommand = true;
      if(typeof Simplized != "undefined"){
        text = Simplized(text);
      }
      SocketController.triggerSendText({block: block, text: text}, "idioms.");
    },
    "mix+console":function(){
      var text = $('#showText').val() || $('.choose-word').text();
      var pos = $('#textPosition').val().split(',');
      var hpos = $('#hidePosition').val().split(',');
      var block = {row: pos[0], column: pos[1]};
      Commons.fromServerCommand = true;
      if(typeof Simplized != "undefined"){
        text = Simplized(text);
      }
      SocketController.triggerSendText({block: block, text: text}, "mix.");
      if(hpos.length == 2){
        var hblock = {row: hpos[0], column: hpos[1]};
        SocketController.triggerSendText({block: hblock, text: 'X'}, "mix.");
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onUndoClick = (function(key){
  return {
    "B3+console":function(){
      var track = Commons.trackCache.getUndo();
      if(track){
        var commandName = '';
        var passObj = { block: track.block, color: track.color };
        switch(track.action){
          case 'rewrite':
            commandName = 'Rewrite';
            passObj.ink = track.ink;
            break;
          case 'text':
            commandName = 'SendText';
            passObj.text = track.text;
            break;
          case 'clear':
            commandName = 'Clear';
            passObj.user_id = Settings.consoleUserId;
            break;
        }
        if(commandName){
          SocketController["trigger" + commandName](passObj, "idioms.");
        }
      }
      View.updateTrackButtons();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onRedoClick = (function(key){
  return {
    "B3+console":function(){
      var track = Commons.trackCache.getRedo();
      if(track){
        var commandName = '';
        var passObj = { block: track.block, color: track.color };
        switch(track.action){
          case 'rewrite':
            commandName = 'Rewrite';
            passObj.ink = track.ink;
            break;
          case 'text':
            commandName = 'SendText';
            passObj.text = track.text;
            break;
          case 'clear':
            commandName = 'Clear';
            passObj.user_id = Settings.consoleUserId;
            break;
        }
        if(commandName){
          SocketController["trigger" + commandName](passObj, "idioms.");
        }
      }
      View.updateTrackButtons();
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onSubmitClick = (function(key){
  return {
    "A1+client":function(){
      SocketController.triggerAction({
        action: 'device_stop',
        user_id: Settings.clientUserId,
        stamp: (new Date()).getTime()
      });
      SocketController.triggerSubmit({user_id: Settings.clientUserId});
    },
    "B2+client":function(){
      SocketController.triggerAction({
        action: 'device_stop',
        user_id: Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        },
        stamp: (new Date()).getTime()
      },"B2.");
      SocketController.triggerSubmit({
        user_id: Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        }
      },"B2.");
    },
    "B3+client":function(){
      SocketController.triggerAction({
        action: 'device_stop',
        user_id: Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        },
        stamp: (new Date()).getTime()
      },"idioms.");
      SocketController.triggerSubmit({
        user_id: Settings.clientUserId,
        block:{
          row: Commons.currentRow,
          column: Commons.currentCol
        }
      },"idioms.");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

View.onZoomClick = (function(key){
  key = Commons.getCommonGenKey(key, ["A1+console","A2+console","A3+console","B1+console","B2_v1+console","mix+console"]);
  return {
    "A1+console":function(){
      if($(this).attr('zoom') == 1){
        SocketController.triggerUnZoom({user_id: this.value});
      }else{
        SocketController.triggerZoom({user_id: this.value});  
      }
      // View.setStopStyle({user_id:this.value});
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);
