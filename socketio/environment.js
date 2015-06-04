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

                socket.on('down_location',function(message){
                    emitUserId(message.user_id,'down_location',message);
                    emitUserId('0','down_location',message);
                });

                socket.on('move_location',function(message){

                    emitUserId(message.user_id,'move_location',message);
                    emitUserId('0','move_location',message);
                });

                socket.on('up_location',function(message){
                    emitUserId(message.user_id,'up_location');
                    emitUserId('0','up_location',message);
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
