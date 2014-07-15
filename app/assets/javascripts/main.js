var ocan;
var originCanvas2d;
var isDrawing = false;
var lastX,lastY;
var originWidth = 300;
var originHeight = 300;
var originBorder = 3;
var originOffset = {};
var originLineWidth = Math.min(originWidth, originHeight) / 60;

var scale = 8;
var rootScale = Math.pow(scale, 1/2);

var mcan;
var multipleCanvas2d;
var multipleWidth = rootScale * originWidth;
var multipleHeight = rootScale * originHeight;
var multipleLineWidth = Math.min(multipleWidth, multipleHeight) / 60;

//var aviBuilder = new movbuilder.MotionJPEGBuilder();
//aviBuilder.setup(originWidth, originHeight, 30);

var dataurls = [];
var backImg;

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.ChatApp = (function() {
  ChatApp.prototype.messageTemplate = function(message, channelName) {
    if (channelName == null) {
      channelName = 'broadcast';
    }
    return "<div>\n  <span>\n    <label class='label label-" + (channelName === 'broadcast' ? 'warning' : 'info') + "'>\n      [" + channelName + "]\n    </label> " + message + "\n  </span>\n</div>";
  };

  ChatApp.prototype.joinTemplate = function(channelName) {
    return "<div>\n  <span>\n    <label class='label label-'>\n      [Joined Channel]\n    </label> " + channelName + "\n  </span>\n</div>";
  };

  function ChatApp(currentChannel, username) {
    ocan = document.getElementById('origin');
    ocan.width = 300;
    ocan.height = 300;
    //$(ocan).css('border-width', originBorder);
    originOffset.left = ocan.offsetLeft;
    originOffset.top = ocan.offsetTop;
    originCanvas2d = ocan.getContext("2d");
    originCanvas2d.lineWidth = originLineWidth;
    originCanvas2d.lineCap = 'round';
    originCanvas2d.strokeStyle = '#00ccff';

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
    $('#origin').mousedown(this.downMypad);
    $('#origin').mousemove(this.moveMypad);
    $('#origin').mouseup(this.upMypad);
    this.dispatcher.bind('down_location', this.receiveDown);
    this.dispatcher.bind('move_location', this.receiveMove);
    this.dispatcher.bind('up_location', this.receiveUp);
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

    lastX = message.x;
    lastY = message.y;
    
    originCanvas2d.beginPath();
    multipleCanvas2d.beginPath();
    
    
    originCanvas2d.moveTo(lastX - 0.1, lastY - 0.1);
    multipleCanvas2d.moveTo(rootScale * (lastX - 0.1), rootScale * (lastY - 0.1));
    
    originCanvas2d.lineTo(lastX, lastY);
    multipleCanvas2d.lineTo(rootScale * lastX, rootScale * lastY);
    
    originCanvas2d.stroke();
    multipleCanvas2d.stroke();

  };

  ChatApp.prototype.receiveMove = function(message) {
    if(isDrawing){
      calx = message.x;
      caly = message.y;
      originCanvas2d.beginPath();
      multipleCanvas2d.beginPath();
      
      originCanvas2d.moveTo(lastX, lastY);
      multipleCanvas2d.moveTo(rootScale * lastX, rootScale * lastY);
      
      originCanvas2d.lineTo(calx, caly);
      multipleCanvas2d.lineTo(rootScale * calx, rootScale * caly);
      
      originCanvas2d.stroke();
      multipleCanvas2d.stroke();
      
      //aviBuilder.addCanvasFrame(ocan);
      //dataurls.push(mcan.toDataURL());
      
      lastX = calx;
      lastY = caly;
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

  ChatApp.prototype.new_message = function(message) {
    return $('#chat_history').append(this.messageTemplate(message.text));
  };

  return ChatApp;

})();


function initMultipleCanvas(){
  mcan = document.getElementById('multiple'); 
  mcan.width = Math.round(multipleWidth);
  mcan.height = Math.round(multipleHeight);
  //$(mcan).css('border-width', originBorder * rootScale);
  multipleCanvas2d = mcan.getContext("2d");
  multipleCanvas2d.lineWidth = multipleLineWidth;
  multipleCanvas2d.lineCap = 'round';
  multipleCanvas2d.strokeStyle = '#00ccff';
}

$(document).ready(function() {
  initMultipleCanvas();
  
  backImg = new Image();
  backImg.onload = function(){
    originCanvas2d.drawImage(backImg, 0, 0, originWidth, originHeight);
    multipleCanvas2d.drawImage(backImg, 0, 0, multipleWidth, multipleHeight);
  };
  backImg.src = "assets/block-524.png";
  
  $("#clearBtn").click(function(){
    originCanvas2d.drawImage(backImg, 0, 0, originWidth, originHeight);
    multipleCanvas2d.drawImage(backImg, 0, 0, multipleWidth, multipleHeight);
  });
  
  $("#prevBtn").click(function(){

  });
  return window.chatApp = new ChatApp;
});




