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
          startSetStyle(value);
        }

        function receiveStopHandler(c){
          stop_button(c.user_id);
        }

        var stop_button = function(value){
          clearInterval(window.alarm);
          window.alarm = null;
          stopSetStyle(value);
        }


        function isEmpty(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
              return false;
          }
          return true;
        }

        var receiveOHandler = function(o){
          showO(o.user_id);
        }

        var receiveRemoveOHandler = function(o){
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
          if (isEmpty(o)) {
            clearAllSetStyle();
          } else {
            CM('origin_'+o.user_id).clear();
          }
        }

        var receiveResetHandler = function(o){
          if (o.second != null) {
            for (key in window.alarm){
              clearInterval(window.alarm[key]);
              window.alarm[key] = null;
              resetSetStyle(o.second);
            }
          }
        }

        var receiveCorrectCountHandler = function(o){
          correctCountSetStyle(o);
        }

      function receiveCorrectUsersHandler(o) {
        showCorrectUsers(o);
      }

      function showCorrectUsers(users) {
            users.sort(function(a,b) {
              return parseInt(a) - parseInt(b);
            });
            
            for (var i in users) { 
              setTimeout( (function(a){
                return function() {
                  console.log(a);
                  $("#yes_img_"+a).show();
                }
              })(users[i]), 400 * i);
            }
            users = null;
      }