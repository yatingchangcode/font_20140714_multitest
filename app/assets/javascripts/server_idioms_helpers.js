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

  var receiveDownHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).point({ x: o.x, y: o.y });
  };

  var receiveMoveHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).line({ x: o.x, y: o.y });
  };

  var receiveClearHandler = function(o){
    CM('origin_'+o.block.row+'_'+o.block.column).clear();
  };

  var receiveStartHandler = function(o){
    start_button(o.user_id);
  };

  var receiveStopHandler = function(c){
    stop_button(c.user_id);
  };

  var start_button = function(value){
    gamers.setActive(value);
    startSetStyle(value);
    startCounter(value);
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
  };

  var receiveSendTextHandler = function(o){
    var testCan = document.getElementById('origin_'+ o.block.row +'_' + o.block.column);
    var w = $(testCan).width();
    var context = testCan.getContext("2d");
    context.fillStyle = "#ececec";
    //context.font = "bold " + (w * 13 / 15) + "px 標楷體";
    context.font = (w * 13 / 15) + "px 標楷體";
    context.fillText(o.text, w / 15, w * 12 / 15);
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

