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
          clearInterval(window.alarm);
          window.alarm = null;
          stopSetStyle(value);
        }


        var startCounter = function(thisvalue) {
               if(window.alarm) return;
               $('#progress_bar').css("width", "100%").attr("aria-valuenow","100%")
                            .text(window.timeRemaining+"s");
               window.alarm = setInterval(function(){
                var s = parseFloat($('#second').text()).toFixed(1);
                if (s > 0){
                  //console.log(s);
                  var percent = 100 * (s-0.1) / window.timeRemaining;
                  $('#progress_bar').css("width", percent+"%").attr('aria-valuenow', percent)
                  .text((s-0.1).toFixed(1)+"s");
                  $('#second').text((s - 0.1).toFixed(1));
                } else {
                  clearInterval(window.alarm);
                  window.alarm = null;
                  window.chatApp.action(thisvalue,'stop');
                  stopSetStyle(thisvalue);
                  $('#second').text(window.timeRemaining);
                  receiveSubmitHandler({user_id:thisvalue});
             }
              },100); 
            };

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