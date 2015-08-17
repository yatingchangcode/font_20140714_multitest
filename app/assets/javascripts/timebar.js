
window.TimeBar = (function(){
  var _instances = {};

  var timebarInstance = function(id){
    this._jqel = $('#'+id);
    this._int = null;
    this._curs = 10.0;
    this._sec = 10.0;
    this._changeBegin = (1 / 3) * 100;
    this._changeEnd = (1 / 15) * 100;
    this._changeInt = this._changeBegin - this._changeEnd;
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
    this._jqel.css("width", "100%").css("background-color", '#ffff00').attr('aria-valuenow', 100);
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
              scope._jqel.css("background-color", '#ffff00');
            }else if(percent > scope._changeEnd && percent < scope._changeBegin){
              var percentInGreen = parseInt((percent - scope._changeEnd) / scope._changeInt * 255);
              scope._jqel.css("background-color", '#ff'+ percentInGreen.toString(16) +'00');
            }else{
              scope._jqel.css("background-color", '#ff0000');
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
