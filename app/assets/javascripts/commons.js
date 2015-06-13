
(function prepareCommonVars(scope){
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

  var isEmpty = function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
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

  var getCommonGenKey = function(key, list){
    if(Array.isArray(list) && list.length && ~list.indexOf(key)){
      return list[0];
    }
    return key;
  };

  scope.Commons = {};

  // by different stages
  scope.Commons.emptyFn = function(o){};
  scope.Commons.gamers = gamers;
  scope.Commons.isEmpty = isEmpty;
  scope.Commons.generateBorderBase64 = generateBorderBase64;
  scope.Commons.getCommonGenKey = getCommonGenKey;

  var genKey = Settings.genKey;
  
  if(genKey == "B3+console"){
    scope.Commons.trackCache = trackCache;
  }
  
  if(Settings.hasTimeCounter || genKey == "B3+console"){
    Commons.alarm = null;
  }else if(genKey == "A2+console"){
    Commons.alarm = {};
  }

  if(~["A3+tv","B2+tv"].indexOf(genKey) || 
    (~["A1+tv","B1+tv"].indexOf(genKey) && Settings.hasCorrectCounting)){
    Commons.tempcount = {};
  }

  // switch(Settings.stageName){
  //   case 'A3':
  //   case 'B3':
  //     scope.Commons.trackCache = trackCache;
  //     break;
  //   case 'B2_v1':
  //     scope.Commons.no_correct = null;
  //     scope.Commons.correct_users = null;
  //     break;
  // }
  // if(Settings.stageName == 'A3'){
  //   scope.Commons.no_correct = null;
  //   scope.Commons.correct_users = null;
  // }
})(window);




