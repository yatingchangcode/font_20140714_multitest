
(function prepareCommonVars(scope){
  var gamers = {
    gamersList : [],
    last: null,
    length: 0,
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
      this.length++;
    }, 
    remove : function(i) {
      var idx = this.gamersList.indexOf(i);
      if (idx > -1) {
        this.gamersList.splice(idx, 1);
      }
      if(this.length) this.length--;
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
    currentColor:null,
    hasDirty:false,
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
      if(self.currentBlock.row && self.currentBlock.column && self.hasDirty){
        var track = {
          block:{
            row: self.currentBlock.row,
            column: self.currentBlock.column
          },
          ink: self.currentPoints.slice(0),
          color: self.currentColor
        };
        self.currentPoints = [];
        self.currentBlock = {};
        self.currentColor = null;
        self.hasDirty = false;
        //self.push(track);
        self.tracks.splice(self.statusIndex, self.tracks.length - self.statusIndex);
        self.tracks.push(track);
        self.statusIndex++;
      }
    },
    moveToBlock:function(row, col, color){
      // this.saveToCache();
      // this.currentBlock.row = row;
      // this.currentBlock.column = col;
      // this.currentColor = color;
      var self = this;
      if(self.currentBlock.row != row || self.currentBlock.column != col){
        self.saveToCache();
        self.currentBlock.row = row;
        self.currentBlock.column = col;
        self.currentColor = color;
      }
    },
    addText:function(row, col, text, color){
      var self = this;
      // self.checkBlock(row, col);
      // force to move there
      self.moveToBlock(row, col, color);
      self.tracks.splice(self.statusIndex, self.tracks.length - self.statusIndex);
      self.tracks.push({
        block:{
          row: self.currentBlock.row,
          column: self.currentBlock.column
        },
        text: text,
        color: color
      });
      self.currentPoints = [];
      self.currentBlock = {};
      self.currentColor = null;
      self.statusIndex++;
    },
    addPoint:function(row, col, x, y){
      // this.checkBlock(row, col);
      //this.currentPoints.push([ { x: x, y: y } ]);
      this.hasDirty = true;
      this.currentPoints.push([ [x], [y] ]);
    },
    addLinePoint:function(row, col, x, y){
      var self = this;
      // self.checkBlock(row, col);
      //if(!self.currentPoints.length) self.currentPoints.push([ { x: x, y: y } ]);
      //self.currentPoints[self.currentPoints.length - 1].push({ x: x, y: y });
      self.hasDirty = true;
      if(!self.currentPoints.length) self.currentPoints.push([ [x], [y] ]);
      var p = self.currentPoints[self.currentPoints.length - 1];
      p[0].push(x);
      p[1].push(y);
    },
    clear:function(row, col, addToCache){
      // this.checkBlock(row, col);
      var isInCurrentClear = this.currentPoints.length > 0;
      this.currentPoints = [];
      if(addToCache || (!this.isEmptyTrack(this.findPrev(row, col)) && !isInCurrentClear)){
        this.hasDirty = true;
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
          return { action: 'text', block: track.block, text: track.text, color: track.color };
        }else if(track.ink && track.ink.length > 0){
          return { action: 'rewrite', block: track.block, ink: track.ink, color: track.color };
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
        return { action: 'rewrite', block: track.block, ink: track.ink, color: track.color };
      }else if(track.text){
        return { action: 'text', block: track.block, text: track.text, color: track.color };
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

  var inArray = function(array, item){
    return array.some(function(d) {
      return (d.row === item.row && d.column === item.column); 
    }); 
  };

  var indexOfBlock = function(array, item){
    for (var i = 0; i < array.length; i++) {
      if (array[i].row === item.row && array[i].column === item.column) return i;
    }
    return -1;
  };
  
  var generateBorderBase64 = function(dependEl, px, splits, background){
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

    if(background != false){
      var innerBackgroundPosition = [[px, px], [px, h - px], [w - px, px], [w - px, h - px]];
      canvasContext.fillStyle = background || '#000000';
      canvasContext.beginPath();
      // canvasContext.moveTo.apply(canvasContext, innerBackgroundPosition[0]);
      // canvasContext.lineTo.apply(canvasContext, innerBackgroundPosition[1]);
      // canvasContext.lineTo.apply(canvasContext, innerBackgroundPosition[2]);
      // canvasContext.lineTo.apply(canvasContext, innerBackgroundPosition[3]);
      canvasContext.fillRect(px, px, w - px - px, h - px - px);
      // canvasContext.fill();
    }
    
    return canvasEl.toDataURL();
  };

  var generateAlphaVideo = function(){
    var cycleOutputCanvas = document.getElementById('cycleOutput'),
        cycleOutput = cycleOutputCanvas.getContext('2d'),
        cycleBufferCanvas = document.getElementById('cycleBuffer'),
        cycleBuffer = cycleBufferCanvas.getContext('2d'),
        cycleVideo = document.getElementById('cycleVideo');
    // 0.156  
    var wrap = document.getElementById('cycleWrap'),
        width = Math.ceil(wrap.clientWidth || 0),
        height = Math.ceil(wrap.clientWidth * 0.156),
        interval;
      
    cycleBufferCanvas.width = cycleOutputCanvas.width = width;
    cycleBufferCanvas.height = cycleOutputCanvas.height = height;
    
    function processFrame() {
      cycleBuffer.drawImage(cycleVideo, 0, 0, width, height);
      
      // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
      var image = cycleBuffer.getImageData(0, 0, width, height),
        imageData = image.data,
        // alphaData = cycleBuffer.getImageData(0, height, width, height).data;
        alphaData = cycleBuffer.getImageData(0, 0, width, height).data;
      
      for (var i = 3, len = imageData.length; i < len; i = i + 4) {
        imageData[i] = alphaData[i-1];
      }
      
      cycleOutput.putImageData(image, 0, 0, 0, 0, width, height);
    }
    
    cycleVideo.addEventListener('play', function() {
      clearInterval(interval);
      interval = setInterval(processFrame, 40)
    }, false);
    
    // Firefox doesn't support looping video, so we emulate it this way
    cycleVideo.addEventListener('ended', function() {
      cycleVideo.play();
    }, false);
  };

  var getCommonGenKey = function(key, list){
    if(Array.isArray(list) && list.length && ~list.indexOf(key)){
      return list[0];
    }
    return key;
  };

  scope.Commons = {};

  // by different stages
  scope.Commons.emptyFn = function(o){ 
    //console.warn("Nothing happens!! Make this line as check point for debug.");
  };
  scope.Commons.gamers = gamers;
  scope.Commons.isEmpty = isEmpty;
  scope.Commons.inArray = inArray;
  scope.Commons.indexOfBlock = indexOfBlock;
  scope.Commons.generateBorderBase64 = generateBorderBase64;
  scope.Commons.getCommonGenKey = getCommonGenKey;
  scope.Commons.generateAlphaVideo = generateAlphaVideo;
  
  var genKey = Settings.genKey;
  
  if(genKey == "B3+console"){
    scope.Commons.trackCache = trackCache;
  }
  
  if(genKey == "mix+console"){
    if(Settings.commonWriting) scope.Commons.alarm = null;
    else scope.Commons.alarm = {};
  }else if(Settings.hasTimeCounter || genKey == "B3+console"){
    scope.Commons.alarm = null;
  }else if(genKey == "A2+console"){
    scope.Commons.alarm = {};
  }

  if(~["A3+tv","B2+tv","C3+tv","group+tv"].indexOf(genKey) || 
    (~["C1+tv","A1+tv","B1+tv"].indexOf(genKey) && Settings.hasCorrectCounting)){
    scope.Commons.tempcount = {};
  }else if(~["mix+console","mix+tv","C5+tv"].indexOf(genKey) && Settings.hasCorrectCounting){
    scope.Commons.tempcount = {};
  }

  if(~["B2+client"].indexOf(genKey)){
    scope.Commons.currentRow = 1;
    scope.Commons.currentCol = 1;
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




