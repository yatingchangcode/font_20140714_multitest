
if (typeof Settings == 'undefined'){
  console.error("socketevent-generator.js should be include first.");
}
if (typeof Commons == 'undefined'){
  console.error("commons.js should be include first.");
}

window.Action = {};

// ======= Actions Information =======
Action.onDownLocation = (function(key){
  // *** tv: all stages are no actions.
  // *** server: A1 A2 A3 B1 B2 no action
  // server: B3
  return {
    "B3+console": function(o){
      Commons.trackCache.addPoint(o.block.row, o.block.column, o.x, o.y);
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onMoveLocation = (function(key){
  // *** tv: all stages are no actions.
  // *** server: A1 A2 A3 B1 B2 no action
  // server: B3
  return {
    "B3+console": function(o){
      Commons.trackCache.addLinePoint(o.block.row, o.block.column, o.x, o.y);
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onUpLocation = Commons.emptyFn;

Action.onStart = (function(key){
  // *** server: A1 A3 B1 B2 B2_v1 no action
  // *** tv: A1 B2 B2_v1 no action
  key = Commons.getCommonGenKey(key, ["A2+console","B3+console","A2+tv","B3+tv"]);
  key = Commons.getCommonGenKey(key, ["A3+tv","B1+tv"]);
  return {
    // server: A2 B3
    // tv: A2 B3
    "A2+console":function(o){
      Commons.gamers.setActive(o.user_id);
    },
    // tv: A3 B1
    "A3+tv":function(o){
      SocketController.receiveCancelSubmitHandler(o);
    },
    // on write.html.erb
    "A1+client":function(o){
      SocketController.triggerAction({
        action:'device_start',
        user_id: o.user_id,
        stamp: (new Date()).getTime()
      });
      alert("start");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onStop = (function(key){
  // *** tv: A2 B2 B3 no actions
  key = Commons.getCommonGenKey(key, [
    "A1+console","A3+console","B1+console","B2_v1+console","B2+console",
    "A1+tv","A3+tv","B1+tv","B2_v1+tv"
  ]);
  return {
    // server: A1 A3 B1 B2 B2_v1
    // tv: A1 A3 B1 B2_v1
    "A1+console":function(o){
      if (Settings.hasTimeCounter && Commons.alarm){
        clearInterval(Commons.alarm);
        Commons.alarm = null;
      }
    },
    "A2+console":function(o){
      // server: A2
      clearInterval(Commons.alarm[o.user_id]);
      Commons.alarm[o.user_id] = null;
    },
    "B3+console":function(o){
      // server: B3
      Commons.trackCache.saveToCache();
      clearInterval(Commons.alarm);
      Commons.alarm = null;
    },
    "A1+client":function(o){
      SocketController.triggerAction({
        action:'device_stop',
        user_id: o.user_id,
        stamp: (new Date()).getTime()
      });
      alert("stop");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onSubmit = (function(key){
  // *** server: A1 B1 B3 no actions
  return {
    // server: A2
    "A2+console":function(o){
      SocketController.triggerAction({action:'stop',user_id:o.user_id});
    },
    // server: A3
    "A3+console":function(o){
      Commons.gamers.all().forEach(function(id){
        SocketController.triggerAction({action:'stop',user_id:id});
      });
    },
    // server: B2
    "B2+console":function(o){
      Commons.isNotSave = true;
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// server & tv: all stages are no actions
Action.onCancelSubmit = Commons.emptyFn;

Action.onClear = (function(key){
  // *** server: A1 A2 A3 B1 B2_v1 no actions
  return {
    // server: B2
    "B2+console":function(o){
      if(Commons.fromServerCommand || o.user_id != Settings.consoleUserId){
        Commons.fromServerCommand = false;
      }
    },
    // server: B3
    "B3+console":function(o){
      if(Commons.fromServerCommand || o.user_id != Settings.consoleUserId){
        Commons.trackCache.clear(o.block.row, o.block.column, Commons.fromServerCommand);
        Commons.fromServerCommand = false;
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onClearAll = Commons.emptyFn;

// *** server: all stages are no action
// *** tv: all stages are no action
Action.onRight = Commons.emptyFn;

// *** server: all stages are no action
  // *** tv: all stages are no action
Action.onRemoveO = Commons.emptyFn;

Action.onSetCorrectCount = (function(key){
  // *** server: all stages are no action
  key = Commons.getCommonGenKey(key, ["A1+tv","B1+tv"]);
  key = Commons.getCommonGenKey(key, ["A3+tv","B2+tv"]);
  return {
    // tv: A1 B1
    "A1+tv":function(o){
      if (Settings.hasCorrectCounting){
        Commons.tempcount[o.user_id] = o.count;
      }
    },
    // tv: A3 B2
    "A3+tv":function(o){
      Commons.tempcount[o.user_id] = o.count;
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// *** server: all stages are no action
// *** tv: all stages are no action
Action.onShowCorrectUsers = Commons.emptyFn;

Action.onUserOut = (function(key){
  // *** server: B2 B3 no action
  // *** tv: B2 B3 no action
  key = Commons.getCommonGenKey(key, [
    "A1+console", "A2+console", "A3+console", "B1+console", "B2_v1+console",
    "A1+tv", "A2+tv", "A3+tv", "B1+tv", "B2_v1+tv"
  ]);
  return {
    // server: A1 A2 A3 B1 B2_v1
    // tv: A1 A2 A3 B1 B2_v1
    "A1+console":function(o){
      console.log(o.user_id);
      Commons.gamers.remove(o.user_id);
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey)

Action.onReset = (function(key){
  // *** tv: all stages are no action
  // *** server: A1 A3 B1 B2_v1 no action
  return {
    // server: A2
    "A2+console":function(o){
      if (o.second != null) {
        for (key in Commons.alarm){
          clearInterval(Commons.alarm[key]);
          Commons.alarm[key] = null;
        }
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// *** server: all stages are no action
// *** tv: all stages are no action
Action.onIsConnected = Commons.emptyFn;

// *** server: all stages are no action
// *** tv: all stages are no action
// Action.onClientConnected = Commons.emptyFn;

// *** server: all stages are no action
// *** tv: all stages are no action
Action.onMoveBlock = Commons.emptyFn;

Action.onSendText = (function(key){
  // *** tv: all stages are no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  return {
    // server: B3
    "B3+console":function(o){
      if(Commons.fromServerCommand){
        Commons.trackCache.addText(o.block.row, o.block.column, o.text);
        Commons.fromServerCommand = false;
      }
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey)

Action.onEndRound = (function(key){
  // *** tv: all stages are no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  return {
    // server: B3
    "B3+console":function(o){
      SocketController.triggerAction({action:'stop',user_id:o.user_id});
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

// *** server: all stages are no action
// *** tv: all stages are no action
Action.onRewrite = Commons.emptyFn;

Action.onContinueWrite = (function(key){
  // *** tv: A1 A2 A3 B1 B2_v1 B2 no action
  // *** server: A1 A2 A3 B1 B2_v1 B2 no action
  key = Commons.getCommonGenKey(key, ["B3+console", "B3+tv"]);
  return {
    // server: B3
    // tv: B3
    "B3+console": function(o){
      Commons.gamers.setActive(c);
    },
    "A1+client":function(o){
      SocketController.triggerAction({
        action:'device_start',
        user_id: o.user_id,
        stamp: (new Date()).getTime()
      });
      alert("continue write");
    }
  }[key] || Commons.emptyFn;
})(Settings.genKey);

Action.onZoom = Commons.emptyFn;
Action.onUnZoom = Commons.emptyFn;

