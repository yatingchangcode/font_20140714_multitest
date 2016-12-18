
window.TimeBar = (function(){
  var _instances = {};

  var _converToSix = function(color){
    if(color.length == 3){
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    return color;
  };

  function colorMgr(from, to){
    var strFromColor = _converToSix(from.substr(1));
    var strToColor = _converToSix(to.substr(1));
    
    var redFrom = parseInt(strFromColor.substring(0, 2), 16);
    var greenFrom = parseInt(strFromColor.substring(2, 4), 16);
    var blueFrom = parseInt(strFromColor.substring(4), 16);

    var redTo = parseInt(strToColor.substring(0, 2), 16);
    var greenTo = parseInt(strToColor.substring(2, 4), 16);
    var blueTo = parseInt(strToColor.substring(4), 16);

    this.red = { origin: redFrom, diff: redFrom - redTo };
    this.green = { origin: greenFrom, diff: greenFrom - greenTo };
    this.blue = { origin: blueFrom, diff: blueFrom - blueTo };

  };

  colorMgr.prototype.getColor = function(percent){
    var self = this;
    var keys = ['red', 'green', 'blue'];
    var res = keys.map(function(item){
      var o = self[item], str;
      if(o.diff == 0) str = o.origin.toString(16);
      else str = parseInt(o.origin - o.diff * (1 - percent)).toString(16);
      return (str.length < 2)? ("0" + str) : str;
    });
    return '#' + res.join('');
  };

  
  var timebarInstance = function(id){
    this._jqel = $('#'+id);
    this._int = null;
    this._curs = 10.0;
    this._sec = 10.0;
    this._changeBegin = (1 / 3) * 100;
    this._changeEnd = (1 / 15) * 100;
    this._changeInt = this._changeBegin - this._changeEnd;
    this._startColor = "#ffff00";
    this._endColor = "#ff0000";
    this._colorMgr = new colorMgr(this._startColor, this._endColor);
  };

  timebarInstance.prototype._stopInterval = function(){
    if(this._int){
      clearInterval(this._int);
      this._int = null;
    }
  };

  timebarInstance.prototype.clearBar = function(){
    this._stopInterval();
    this._curs = 0.0;
    this._jqel.css("width", "0%").attr('aria-valuenow', 0);
  };

  timebarInstance.prototype.resetBar = function(){
    this._stopInterval();
    this._curs = this._sec;
    this._jqel.css("width", "100%").css("background-color", this._startColor).attr('aria-valuenow', 100);
  };

  timebarInstance.prototype.doStop = function(toClear){
    this._stopInterval();
    if(toClear){
      this.clearBar();
    }
  };

  timebarInstance.prototype.doStart = function(){
    if(this._curs && this._int == null){
      this._int = setInterval((function(scope){
        return function(){
          var s = parseFloat(scope._curs).toFixed(1);
          if (s > 0){
            scope._curs = s - 0.1;
            var percent = 100 * scope._curs / scope._sec;
            scope._jqel.css("width", percent+"%").attr('aria-valuenow', percent);
            if(percent >= scope._changeBegin){
              scope._jqel.css("background-color", this._startColor);
            }else if(percent > scope._changeEnd && percent < scope._changeBegin){
              var currentPercent = (percent - scope._changeEnd) / scope._changeInt; // from 0.9x -> 0.01x
              // var percentInGreen = parseInt(currentPercent * 255);
              // scope._jqel.css("background-color", '#ff'+ percentInGreen.toString(16) +'00');
              scope._jqel.css("background-color", scope._colorMgr.getColor(currentPercent));
            }else{
              scope._jqel.css("background-color", this._endColor);
            }
          } else {
            scope.doStop();
          }
        };
      })(this), 100);
    }
  };

  timebarInstance.prototype.setSecond = function(s){
    if(this._int == null && !isNaN(s)){
      this._sec = parseFloat(s).toFixed(1);
      this._curs = this._sec;
    }
  };

  timebarInstance.prototype.setSize = function(width, height){

  };

  timebarInstance.prototype.setColors = function(from, to){
    this._startColor = _converToSix(from);
    this._endColor = _converToSix(to);
    this._colorMgr = new colorMgr(this._startColor, this._endColor);
  };

  var _getIns = function(id){
    if(!_instances[id]){
      _instances[id] = new timebarInstance(id);
    }
    return _instances[id];
  };
  return {
    getInstanceById: _getIns
  };
})();
