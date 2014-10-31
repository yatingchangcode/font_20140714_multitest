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
        }     

        var start_button = function(value){
          gamers.setActive(value);
          startSetStyle(value);
          startCounter(value);
        }

        var receiveStopHandler = function(c){
          stop_button(c.user_id);
        };

        var stop_button = function(value){
          clearInterval(window.alarm[value]);
          window.alarm[value] = null;
          stopSetStyle(value);
        }

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
        }

        var receiveRemoveOHandler = function(o){
          removeO(o.user_id);
        }

        var receiveUserOutHandler = function(o){
            CM.unreg('origin_'+o.user_id);
            //this.disabled = true;
            gamers.remove(o.user_id);
            outSetStyle(o.user_id);
        }

        var receiveClearHandler = function(o){
          CM('origin_'+o.user_id).clear();
        }

        var receiveResetHandler = function(o){
          if (o.second != null) {
            for (key in window.alarm){
              clearInterval(window.alarm[key]);
              window.alarm[key] = null;
              resetSetStyle(key, o.second);
            }
          }
        }

        var receiveCorrectCountHandler = function(o){
          correctCountSetStyle(o);
        }