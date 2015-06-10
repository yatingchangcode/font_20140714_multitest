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