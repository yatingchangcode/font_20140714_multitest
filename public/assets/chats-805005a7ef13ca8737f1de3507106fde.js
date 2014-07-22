(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.isDrawing = false;

  this.ChatApp = (function() {
    function ChatApp(left, top, currentChannel, username) {
      this.currentChannel = currentChannel != null ? currentChannel : void 0;
      this.username = username != null ? username : void 0;
      this.getUserCount = __bind(this.getUserCount, this);
      this.receiveClear = __bind(this.receiveClear, this);
      this.receiveUp = __bind(this.receiveUp, this);
      this.receiveMove = __bind(this.receiveMove, this);
      this.receiveDown = __bind(this.receiveDown, this);
      this.clearMypad = __bind(this.clearMypad, this);
      this.upMypad = __bind(this.upMypad, this);
      this.moveMypad = __bind(this.moveMypad, this);
      this.downMypad = __bind(this.downMypad, this);
      this.dispatcher = new WebSocketRails(window.location.host + "/websocket");
      this.originOffset = {
        left: left,
        top: top
      };
    }

    ChatApp.prototype.triggerEvents = function(userid) {
      this.user_id = userid;
      $('#origin_' + this.user_id).mousedown(this.downMypad);
      $('#origin_' + this.user_id).mousemove(this.moveMypad);
      $('#origin_' + this.user_id).mouseup(this.upMypad);
      return $('#clearBtn').click(this.clearMypad);
    };

    ChatApp.prototype.bindEvents = function() {
      this.dispatcher.bind('down_location', this.receiveDown);
      this.dispatcher.bind('move_location', this.receiveMove);
      this.dispatcher.bind('up_location', this.receiveUp);
      this.dispatcher.bind('clear', this.receiveClear);
      return this.dispatcher.trigger('get_user_count', this.getUserCount);
    };

    ChatApp.prototype.downMypad = function(e) {
      return this.dispatcher.trigger('down_location', {
        user_id: this.user_id,
        x: e.clientX - this.originOffset.left,
        y: e.clientY - this.originOffset.top
      });
    };

    ChatApp.prototype.moveMypad = function(e) {
      return this.dispatcher.trigger('move_location', {
        user_id: this.user_id,
        x: e.clientX - this.originOffset.left,
        y: e.clientY - this.originOffset.top
      });
    };

    ChatApp.prototype.upMypad = function(e) {
      return this.dispatcher.trigger('up_location', {
        user_id: this.user_id
      });
    };

    ChatApp.prototype.clearMypad = function(e) {
      return this.dispatcher.trigger('clear', {
        user_id: this.user_id
      });
    };

    ChatApp.prototype.receiveDown = function(message) {
      this.isDrawing = true;
      return CM('origin_' + message.user_id).point({
        x: message.x,
        y: message.y
      });
    };

    ChatApp.prototype.receiveMove = function(message) {
      if (this.isDrawing) {
        return CM('origin_' + message.user_id).line({
          x: message.x,
          y: message.y
        });
      }
    };

    ChatApp.prototype.receiveUp = function(message) {
      return this.isDrawing = false;
    };

    ChatApp.prototype.receiveClear = function(message) {
      return CM('origin_' + message.user_id).clear();
    };

    ChatApp.prototype.getUserCount = function(data) {
      return $('#user_count').text(data.user_count);
    };

    return ChatApp;

  })();

}).call(this);
