var _ = require('lodash');

module.exports = {

    loadSocketIo: function loadSocketIo() {

        var client_id = {};
        var emitUserId = function(user_id,message_name,message){
            for (var x in client_id[user_id]){
                io.to(client_id[user_id][x]).emit(message_name,message)
            }
        }

        var port = process.env.PORT || 5001;
        if (process.env.NODE_ENV != 'production') {
            port = 5001; // run on a different port when in non-production mode.
        }

        console.log('STARTING ON PORT: ' + port);

        var io = require('socket.io').listen(Number(port));

        io.on('connection', function(socket) {
            console.log(socket.request.session);
            var currentSocketIoUserId = socket.request.session['user_id'];

            if (!client_id[currentSocketIoUserId]){
                client_id[currentSocketIoUserId] = [];
            }
            client_id[currentSocketIoUserId].push(socket.id);


            (function loadFont(){
                var game_id,stage_name,visitors;

                socket.on('down_location',function(msg){
                    emitUserId('0','down_location',msg);
                });

                socket.on('move_location',function(msg){
                    emitUserId('0','move_location',msg);
                });

                socket.on('up_location',function(msg){
                    emitUserId('0','up_location',msg);
                });

                //
                socket.on('clear', function(msg){
                    socket.broadcast.emit('clear',msg);
                })

                //
                socket.on('clearAll',function(){
                    socket.broadcast.emit('clear');
                })

                socket.on('submit',function(msg){
                    emitUserId('0','submit',msg);
                });

                socket.on('cancelSubmit',function(msg){
                    emitUserId('0','cancelSubmit',msg);
                });

                //
                socket.on('set_gameinfo_to_socket',function(msg){
                    game_id = msg.game;
                    stage_name = msg.stage;
                    visitors = msg.visitors.split(",");
                });

                //
                socket.on('action',function(msg){
                    emitUserId(msg.user_id,'action', msg);
                    emitUserId('0','action',msg);
                });

                socket.on('right',function(msg){
                    emitUserId('0','right',msg.user_id);
                });

                socket.on('removeO',function(msg){
                    emitUserId('0','removeO',msg.user_id);
                });

                socket.on('reset',function(msg){
                    socket.broadcast.emit('reset',msg);
                });

                //
                socket.on('continue_write',function(msg){
                    emitUserId(msg.user_id,'continue_write', msg);
                    emitUserId('0','continue_write',msg);
                });

                socket.on('setCorrectCount',function(msg){
                    emitUserId('0','setCorrectCount',msg);
                });

                socket.on('showCorrectUsers',function(msg){
                    emitUserId('0','showCorrectUsers',msg);
                });

                socket.on('userOut',function(msg){
                    emitUserId('0','userOut',msg);
                });





            })();

            socket.on('disconnect', function(message) {
                console.log("which user id "+currentSocketIoUserId);
                console.log("which socket id "+socket.id);
                client_id[currentSocketIoUserId] = _.filter(client_id[currentSocketIoUserId],function(el){
                    return el !== socket.id;
                })
            });

        });

return io;
},

authorize: function authorize(io) {
    io.use(function(socket, next) {

        var userId = null;

        var url = require('url');
        requestUrl = url.parse(socket.request.url);
        requestQuery = requestUrl.query;
        requestParams = requestQuery.split('&');
        params = {};
        for (i=0; i<=requestParams.length; i++){
            param = requestParams[i];
            if (param){
                var p=param.split('=');
                if (p.length != 2) { continue };
                params[p[0]] = p[1];
            }
        }

        userId = params["_rtUserId"];
        socket.request.session = {"user_id": userId};
        next();
    });
},
}
