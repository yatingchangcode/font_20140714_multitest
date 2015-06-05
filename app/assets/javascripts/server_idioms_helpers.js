  var gamers = {
    gamersList : [],
    last: null,
    next : function() {
      var newgamer = this.gamersList.shift();
      this.gamersList.push(newgamer);
      this.last = newgamer;
      return newgamer;
    },
    prev: function() {
      return this.last;
    },
    push : function(i) {
      this.gamersList.push(i);
    }, 
    remove : function(i) {
      var idx = this.gamersList.indexOf(i);
      if (idx > -1) {
        this.gamersList.splice(idx, 1);
      }
    },

    all: function() {
      return this.gamersList.slice(0);
    },

    setActive: function(i) {
      this.last = i;
      var idx = this.gamersList.indexOf(i);
      var head = this.gamersList.splice(0, idx+1);
      this.gamersList = this.gamersList.concat(head);
      console.log(this.gamersList);
    }
  };

  var trackCache = {
    tracks:[],
    currentBlock:{},
    currentPoints:[],
    statusIndex:0,
    checkBlock:function(row, col){
      var self = this;
      if(self.currentBlock.row != row || self.currentBlock.column != col){
        self.saveToCache();
        self.currentBlock.row = row;
        self.currentBlock.column = col;
      }
    },
    findPrev:function(row, col, index){
      var lasts = this.tracks.slice(0, index);
      for(var len = lasts.length; len--; ){
        var p = lasts[len];
        if(p.block.row == row && p.block.column == col){
          return p;
        }
      }
      return null;
    },
    isEmptyTrack:function(track){
      if(!track) return null;
      return track.ink && track.ink.length == 0 && !track.text;
    },
    saveToCache:function(){
      var self = this;
      if(self.currentBlock.row && self.currentBlock.column){
        var track = {
          block:{
            row: self.currentBlock.row,
            column: self.currentBlock.column
          },
          ink: self.currentPoints.slice(0)
        };
        self.currentPoints = [];
        self.currentBlock = {};
        //self.push(track);
        self.tracks.splice(self.statusIndex, self.tracks.length - self.statusIndex);
        self.tracks.push(track);
        self.statusIndex++;
      }
    },
    moveToBlock:function(row, col){
      this.saveToCache();
      this.currentBlock.row = row;
      this.currentBlock.column = col;
    },
    addText:function(row, col, text){
      var self = this;
      self.checkBlock(row, col);
      self.tracks.splice(self.statusIndex, self.tracks.length - self.statusIndex);
      self.tracks.push({
        block:{
          row: self.currentBlock.row,
          column: self.currentBlock.column
        },
        text:text
      });
      self.currentPoints = [];
      self.currentBlock = {};
      self.statusIndex++;
    },
    addPoint:function(row, col, x, y){
      this.checkBlock(row, col);
      //this.currentPoints.push([ { x: x, y: y } ]);
      this.currentPoints.push([ [x], [y] ]);
    },
    addLinePoint:function(row, col, x, y){
      var self = this;
      self.checkBlock(row, col);
      //if(!self.currentPoints.length) self.currentPoints.push([ { x: x, y: y } ]);
      //self.currentPoints[self.currentPoints.length - 1].push({ x: x, y: y });
      if(!self.currentPoints.length) self.currentPoints.push([ [x], [y] ]);
      var p = self.currentPoints[self.currentPoints.length - 1];
      p[0].push(x);
      p[1].push(y);
    },
    clear:function(row, col, addToCache){
      this.checkBlock(row, col);
      var isInCurrentClear = this.currentPoints.length > 0;
      this.currentPoints = [];
      if(!this.isEmptyTrack(this.findPrev(row, col)) && !isInCurrentClear){
        this.saveToCache();
      }
    },

    hasUndo:function(){
      return this.statusIndex > 0;
    },
    hasRedo:function(){
      return this.statusIndex < this.tracks.length;
    },

    getUndo:function(){
      if(!this.hasUndo()) return null;
      var idx = --this.statusIndex;
      var track = this.tracks[idx];
      if(this.isEmptyTrack(track)){
        // this is clear
        // find last status
        // var lasts = this.tracks.slice(0, idx);
        var clearRow = track.block.row;
        var clearCol = track.block.column;
        // for(var len = lasts.length; len--; ){
        //   var p = lasts[len];
        //   if(p.block.row == clearRow && p.block.column == clearCol){
        //     track = p;
        //     break;
        //   }
        // }
        track = this.findPrev(clearRow, clearCol, idx) || track;

        // to recover 
        if(track.text){
          return { action: 'text', block: track.block, text: track.text };
        }else if(track.ink && track.ink.length > 0){
          return { action: 'rewrite', block: track.block, ink: track.ink };
        }else{
          return { action: 'clear', block: track.block };
        }
      }else{
        // to do clear
        return { action: 'clear', block: track.block};
      }
    },

    getRedo:function(){
      if(!this.hasRedo()) return null;
      var track = this.tracks[this.statusIndex++];
      if(track.ink && track.ink.length > 0){
        return { action: 'rewrite', block: track.block, ink: track.ink };
      }else if(track.text){
        return { action: 'text', block: track.block, text: track.text };
      }else{
        return { action: 'clear', block: track.block };
      }
    }
  };

  var receiveDownHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).point({ x: o.x, y: o.y });
    trackCache.addPoint(o.block.row, o.block.column, o.x, o.y);
  };

  var receiveMoveHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).line({ x: o.x, y: o.y });
    trackCache.addLinePoint(o.block.row, o.block.column, o.x, o.y);
  };

  var receiveClearHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).clear();
    //if(o.user_id != '0') trackCache.clear(o.block.row, o.block.column);
    if(window.fromServerCommand || o.user_id != '0'){
      trackCache.clear(o.block.row, o.block.column, window.fromServerCommand);
      window.fromServerCommand = false;
    }
  };

  var receiveRewriteHandler = function(o){
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

  var receiveContinueWriteHandler = function(o){
    continueWriteSet(o.user_id);
  };

  var receiveStartHandler = function(o){
    start_button(o.user_id);
  };

  var receiveStopHandler = function(c){
    trackCache.saveToCache();
    stop_button(c.user_id);
  };

  var start_button = function(value){
    gamers.setActive(value);
    startCounter(value);
    startSetStyle(value);
  };

  var stop_button = function(value){
    //clearInterval(window.alarm[value]);
    //window.alarm[value] = null;
    clearInterval(window.alarm);
    window.alarm = null; 
    stopSetStyle(value);
  };

  var receiveMoveBlockHandler = function(o){
    blockCancelOneSubmitSetStyle(o);
    //trackCache.moveToBlock(o.block.row, o.block.column);
  };

  var receiveSendTextHandler = function(o){
    var testCan = document.getElementById('origin_'+ o.block.row +'_' + o.block.column);
    var w = $(testCan).width();
    var context = testCan.getContext("2d");
    context.fillStyle = "#ececec";
    //context.font = "bold " + (w * 13 / 15) + "px 標楷體";
    context.font = (w * 13 / 15) + "px Sans-serif";
    context.fillText(o.text, w / 15, w * 12 / 15);
    if(window.fromServerCommand){
      trackCache.addText(o.block.row, o.block.column, o.text);
      window.fromServerCommand = false;  
    }
  };

  var receiveEndRoundHandler = function(o){
    /*
    clearInterval(window.alarm);
    window.alarm = null;
    blockCancelSubmitSetStyle(o);
    window.chatApp.action(o.user_id,'stop');
    */
  };

  var receiveSubmitHandler = function(o){
    blockSubmitSetStyle(o);
  };

