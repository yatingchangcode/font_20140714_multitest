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
          CM('origin_'+o.user_id).point({ x: o.x, y: o.y });
        };

        var receiveMoveHandler = function(o){
          CM('origin_'+o.user_id).line({ x: o.x, y: o.y });
        };

        var receiveStartHandler = function(o){
          start_button(o.user_id);
        }     

        var start_button = function(value){
          startSetStyle(value);
        }

        var receiveStopHandler = function(c){
          stop_button(c.user_id);
        }

        var stop_button = function(value){
          //console.log(hasCounter);
          if (window.hasCounter){
            clearInterval(window.alarm);
            window.alarm = null;  
          }
          //gamers.pushStarted(value, window.resetAndStart);
          stopSetStyle(value);
        }


        var isEmpty = function(obj) {
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
            clearSetStyle(o);
          }
        }

        var receiveResetHandler = function(o){
          if (o.second != null) {
            if(window.hasCounter){
              // for (key in window.alarm){
              //   clearInterval(window.alarm[key]);
              //   window.alarm[key] = null;
              // }  
              resetSetStyle(o.second);
            }
          }
        }

        var receiveCorrectCountHandler = function(o){
          correctCountSetStyle(o);
        }

      var receiveCorrectUsersHandler = function(o) {
        showCorrectUsers(o);
      }

      var showCorrectUsers = function(users) {
            users.sort(function(a,b) {
              return parseInt(a) - parseInt(b);
            });
            
            for (var i in users) { 
              setTimeout( (function(a){
                return function() {
                  console.log(a);
                  $("#yes_img_"+a).show();
                }
              })(users[i]), 800 * i);
            }
            users = null;
      }