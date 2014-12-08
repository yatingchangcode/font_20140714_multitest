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
    addLintPoint:function(row, col, x, y){
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
          CM('origin_'+o.user_id + '_' +o.block.row+'_'+o.block.column).point({ x: o.x, y: o.y });
          trackCache.addPoint(o.block.row, o.block.column, o.x, o.y);
        };

        var receiveMoveHandler = function(o){
          //console.log('origin_'+o.user_id + '_' +o.block.row+'_'+o.block.column);
          CM('origin_'+o.user_id + '_' +o.block.row+'_'+o.block.column).line({ x: o.x, y: o.y });
          trackCache.addLintPoint(o.block.row, o.block.column, o.x, o.y);
        };

        var receiveRewriteHandler = function(o){
          var id = 'origin_'+o.user_id + '_' + o.block.row + '_' + o.block.column;
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
        var receiveStartHandler = function(o){
          start_button(o.user_id);
        };     

        var start_button = function(value){
          startSetStyle(value);
        };

        var receiveStopHandler = function(c){
          stop_button(c.user_id);
        };

        var stop_button = function(value){
          //console.log(hasCounter);
          if (window.hasCounter){
            clearInterval(window.alarm);
            window.alarm = null;  
          }
          //gamers.pushStarted(value, window.resetAndStart);
          stopSetStyle(value);
        };


        var isEmpty = function(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
              return false;
          }
          return true;
        };

        var receiveOHandler = function(o){
          showO(o.user_id);
        };

        var receiveRemoveOHandler = function(o){
          removeO(o.user_id);
        };

        var receiveMoveBlockHandler = function(o){
          blockCancelOneSubmitSetStyle(o);
         //trackCache.moveToBlock(o.block.row, o.block.column);
        };


        var receiveUserOutHandler = function(o){
            console.log(o.user_id);
            CM.unreg('origin_'+o.user_id);
            //this.disabled = true;
            gamers.remove(o.user_id);
            outSetStyle(o.user_id);
        };

        var receiveClearHandler = function(o){
          CM('origin_'+o.user_id + '_' + o.block.row + '_' + o.block.column).clear();
          //if(o.user_id != '0') trackCache.clear(o.block.row, o.block.column);
          if(window.fromServerCommand || o.user_id != '0'){
            trackCache.clear(o.block.row, o.block.column, window.fromServerCommand);
            window.fromServerCommand = false;
          }
        };


        var receiveResetHandler = function(o){
          if (o.second != null) {
            if(window.hasCounter){
              // for (key in window.alarm){
              //   clearInterval(window.alarm[key]);
              //   window.alarm[key] = null;
              // }  
              resetSetStyle(o.second);
            }
          }
        };

        var receiveCorrectCountHandler = function(o){
          correctCountSetStyle(o);
        };

      var receiveCorrectUsersHandler = function(o) {
        showCorrectUsers(o);
      };

      var showCorrectUsers = function(users) {
            users.sort(function(a,b) {
              return parseInt(a) - parseInt(b);
            });
            
            for (var i in users) { 
              setTimeout( (function(a){
                return function() {
                  console.log(a);
                  $("#yes_img_"+a).show();
                }
              })(users[i]), 800 * i);
            }
            users = null;
      };

      var generateBorderBase64 = function(dependEl, px, splits){
        var w = $(dependEl).width();
        var h = $(dependEl).height();
        var canvasEl = document.createElement('canvas');
        var canvasContext = canvasEl.getContext('2d');
        var grd;
        var gradientSizeArray = [
          [0, 0, px, 0],
          [w, 0, w - px, 0],
          [0, 0, 0, px],
          [0, h, 0, h - px]
        ];
        var positionArray = [
          [[0, 0], [px, px], [px, h - px], [0, h]], // vertical-left
          [[w, 0], [w - px, px], [w - px, h - px], [w, h]], // vertical-right
          [[0, 0], [px, px], [w - px, px], [w, 0]], // horizontal-top
          [[0, h], [px, h - px], [w - px, h - px], [w, h]]  // horizontal-bottom
        ];
        var colorStopArray = [];
        canvasEl.width = w;
        canvasEl.height = h;
        canvasContext.lineWidth = 0;
        
        for(var i = 0, len = splits.length; i < len; i++){
          var s = splits[i].split(' ');
          colorStopArray.push([parseFloat(s[0]).toFixed(1), s[1]]);
        }

        px = px || 3;

        for(var i = 0, len = gradientSizeArray.length; i < len; i++){
          grd = canvasContext.createLinearGradient.apply(canvasContext, gradientSizeArray[i]);
          for(var a = 0, alen = colorStopArray.length; a < alen; a++){
            grd.addColorStop(colorStopArray[a][0], colorStopArray[a][1]);  
          }
          
          canvasContext.fillStyle = grd;
          canvasContext.beginPath();
          var positions = positionArray[i];
          canvasContext.moveTo.apply(canvasContext, positions[0]);
          canvasContext.lineTo.apply(canvasContext, positions[1]);
          canvasContext.lineTo.apply(canvasContext, positions[2]);
          canvasContext.lineTo.apply(canvasContext, positions[3]);
          canvasContext.fill();
        }

        return canvasEl.toDataURL();
      };