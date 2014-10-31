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
  }     

  var start_button = function(value){
    gamers.setActive(value);
    startSetStyle(value);
    startCounter(value);
  }

  function receiveStopHandler(c){
    stop_button(c.user_id);
  }

  var stop_button = function(value){
    clearInterval(window.alarm[value]);
    window.alarm[value] = null;
    stopSetStyle(value);
  }

  function startCounter(thisvalue) {
    console.log(window.alarm);
    if(window.alarm && window.alarm[thisvalue]) return; 
    if (window.alarm === null) { 
      window.alarm = {};
    }

    window.alarm[thisvalue] = setInterval(function(){
      var s = parseFloat($('#second_'+thisvalue).text()).toFixed(1);
      if (s > 0){
        $('#second_'+thisvalue).text((s-0.1).toFixed(1) + "秒");
      } else {
        clearInterval(window.alarm[thisvalue]);
        window.alarm[thisvalue] = null;
      }
    },100); 
  }

  var receiveMoveBlockHandler = function(o){
    var offset = getOffset();
    $('#user_two').addClass("user_two");
    $('#user_two').css({
      top:(o.block.row-1)*101+offset.top + "px",
      left:(o.block.column-1)*97+offset.left + "px"
    });


  };

  var receiveSendTextHandler = function(o){
    var testCan = document.getElementById('origin_'+ o.block.row +'_' + o.block.column);
    var w = $(testCan).width();
    var context = testCan.getContext("2d");
    context.fillStyle = "purple";
    context.font = "bold " + (w * 13 / 15) + "px 標楷體";
    context.fillText(o.text, w / 15, w * 12 / 15);
  };

  var receiveEndRoundHandler = function(o){
    clearInterval(window.alarm);
    window.alarm = null;
    window.chatApp.action(o.user_id,'stop');
    $('#user_two').removeClass("user_two");
    for(var x=1;x<8;x++){
      for(var y=1;y<12;y++){
        $('#origin_'+x+'_'+y).css({
          zindex:1,
          border:"1px solid red"
        });
      }
    }
  };

  var receiveSubmitHandler = function(o){
    var offset = getOffset();
    $('#origin_'+o.block.row+'_'+o.block.column).css({
      border:"1px solid green",
      width:"96px",
      height:"96px",
      position:"absolute",
      top:(o.block.row-1)*101+offset.top + "px",
      left:(o.block.column-1)*96+offset.left + "px"
    });
  };

  var getOffset = function(){
    var offset = $('#canvasTable').offset();
    offset.top += 40;
    offset.left += 25;
    return offset;
  }
