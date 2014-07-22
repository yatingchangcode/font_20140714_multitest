var isDrawing = false;

var originOffset = {};

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.ChatApp = (function() {


  function ChatApp(currentChannel, username) {
    ocan = document.getElementById('origin');
    originOffset.left = ocan.offsetLeft;
    originOffset.top = ocan.offsetTop;

    this.currentChannel = currentChannel != null ? currentChannel : void 0;
    this.username = username != null ? username : void 0;
    this.new_message = __bind(this.new_message, this);
    this.sendMessage = __bind(this.sendMessage, this);
    this.receiveUp = __bind(this.receiveUp, this);
    this.receiveMove = __bind(this.receiveMove, this);
    this.receiveDown = __bind(this.receiveDown, this);
    this.upMypad = __bind(this.upMypad, this);
    this.moveMypad = __bind(this.moveMypad, this);
    this.downMypad = __bind(this.downMypad, this);
    this.dispatcher = new WebSocketRails(window.location.host + "/websocket");
    this.bindEvents();
  }

  ChatApp.prototype.bindEvents = function() {
    this.dispatcher.trigger('get_user_count');

    this.dispatcher.bind('down_location', this.receiveDown);
    this.dispatcher.bind('move_location', this.receiveMove);
    this.dispatcher.bind('up_location', this.receiveUp);
    this.dispatcher.bind('clear',function(){
      CM('origin').clear();
      CM('origin2').clear();
    })
    $('#send_message').click(this.sendMessage);
    return this.dispatcher.bind('new_message', this.new_message);
  };



  ChatApp.prototype.downMypad = function(e) {
    return this.dispatcher.trigger('down_location', {
      x: e.clientX - originOffset.left,
      y: e.clientY - originOffset.top,
    });
  };

  ChatApp.prototype.moveMypad = function(e) {
    return this.dispatcher.trigger('move_location', {
      x: (e.clientX - originOffset.left),
      y: (e.clientY - originOffset.top)
    });
  };

  ChatApp.prototype.upMypad = function(e) {
    return this.dispatcher.trigger('up_location', {
    });
  };

  ChatApp.prototype.receiveDown = function(message) {
    isDrawing = true;
    //aviBuilder.setup(1280, 720, 60);
    
    CM('origin').point({ x: message.x, y: message.y });

  };

  ChatApp.prototype.receiveMove = function(message) {
    if(isDrawing){
      CM('origin').line({ x: message.x, y: message.y });
    }
  };

  ChatApp.prototype.receiveUp = function(message) {
    isDrawing = false;
  };

  ChatApp.prototype.sendMessage = function(e) {
    var message;
    e.preventDefault();
    message = $('#new_message').val();
    if (this.currentChannel != null) {
      this.currentChannel.trigger('new_message', {
        text: message,
        username: this.username
      });
    } else {
      this.dispatcher.trigger('new_message', {
        text: message,
        username: this.username
      });
    }
    return $('#new_message').val('');
  };


  return ChatApp;

})();




$(document).ready(function() {
  CM.prop({
  width: 500,
  height: 500,
  lineWidth: 6,
  lineColor: '#a0e0e0',
  targetZoomScale: 0.1,
  backgroundImage: '/assets/block-524.png'
});

  CM.reg('origin');
  CM.reg('origin2');

  return window.chatApp = new ChatApp;
});




