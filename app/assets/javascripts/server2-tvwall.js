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

        var receiveDownHandler = function(o){
          CM('origin_'+o.user_id).point({ x: o.x, y: o.y });
        };

        var receiveMoveHandler = function(o){
          CM('origin_'+o.user_id).line({ x: o.x, y: o.y });
        };

        var receiveStartHandler = function(o){
          start_button(o.user_id);
        };

        var start_button = function(value){
          gamers.setActive(value);
          startSetStyle(value);
          startCounter(value);
        };

        var receiveStopHandler = function(c){
          stop_button(c.user_id);
        };

        var stop_button = function(value){
          clearInterval(window.alarm[value]);
          window.alarm[value] = null;
          stopSetStyle(value);
        };

        var startCounter = function(thisvalue) {
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
              window.chatApp.action(thisvalue,'stop');
              receiveSubmitHandler({user_id:thisvalue});
            }
          },100); 
        };

        var isEmpty = function(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
              return false;
          }
          return true;
        };

        var receiveOHandler = function(o){
          showO(o.user_id);
        };

        var receiveRemoveOHandler = function(o){
          removeO(o.user_id);
        };

        var receiveUserOutHandler = function(o){
            CM.unreg('origin_'+o.user_id);
            //this.disabled = true;
            gamers.remove(o.user_id);
            outSetStyle(o.user_id);
        };

        var receiveClearHandler = function(o){
          CM('origin_'+o.user_id).clear();
        };

        var receiveResetHandler = function(o){
          if (o.second != null) {
            for (key in window.alarm){
              clearInterval(window.alarm[key]);
              window.alarm[key] = null;
              resetSetStyle(key, o.second);
            }
          }
        };

        var receiveCorrectCountHandler = function(o){
          correctCountSetStyle(o);
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