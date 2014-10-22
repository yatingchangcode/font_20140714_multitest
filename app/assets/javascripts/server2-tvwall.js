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

        var receiveStartHandler = function(o){
          start_button(o.user_id);
        }     

        var start_button = function(value){
          if (!window.alarm) window.alarm = {};

          //console.log(this.value);
          gamers.setActive(value);
          startSetStyle(value);
          startCounter(value);
        }

        function receiveStopHandler(c){
          stop_button(c.user_id);
        }

        var stop_button = function(value){
          clearInterval(window.alarm[value]);
          console.log(value);
          window.alarm[value] = null;
          stopSetStyle(value);
        }

        function startCounter(thisvalue) {
          if (window.alarm === null) { 
            window.alarm = {};
          }
          if (!isEmpty(window.alarm[thisvalue]))  return;

          window.alarm[thisvalue] = setInterval(function(){
            if (parseInt($('#second_'+thisvalue).text()) != 0){
              console.log($('#second_'+thisvalue).text());
              $('#second_'+thisvalue).text(parseInt($('#second_'+thisvalue).text()) - 1 + "秒");
            } else {
              clearInterval(window.alarm[thisvalue]);
              window.alarm[thisvalue] = null;
              window.chatApp.action(thisvalue,'stop');
              receiveSubmitHandler({user_id:thisvalue});
            }
          },1000); 
        }

        function isEmpty(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
              return false;
          }
          return true;
        }

        var receiveRightHandler = function(o){
          showO(o.user_id);
        }

        var receiveRemoveRightHandler = function(o){
          removeO(o.user_id);
        }

        var receiveUserOutHandler = function(o){
          console.log(o.user_id);
            CM.unreg('origin_'+o.user_id);
            //this.disabled = true;
            gamers.remove(o.user_id);
            outSetStyle(o.user_id);
        }

        var receiveClearHandler = function(o){
          CM('origin_'+o.user_id).clear();
        }

        var receiveResetHandler = function(o){
          //not finish
        }